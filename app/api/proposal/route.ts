import { type NextRequest } from "next/server";
import { render } from "@react-email/components";
import * as React from "react";

import { proposalSchema, type ProposalFormData } from "@/lib/validation";
import { buildSupabaseRow, buildGhlWebhookPayload } from "@/lib/payload";
import { sendToGHL } from "@/lib/ghl";
import { syncProposalToGhl, isGhlV2Configured } from "@/lib/ghl-v2";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { logProposalEvent } from "@/lib/events";
import { sendEmail } from "@/lib/email";
import Confirmation, { subject as confirmationSubject } from "@/emails/confirmation";
import InternalNotification, {
  subject as internalSubject,
} from "@/emails/internal-notification";

type RequestBody = {
  data: ProposalFormData;
  utm?: Record<string, string>;
};

export async function POST(request: NextRequest) {
  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  // Support legacy payload (raw form data) and new payload ({data, utm})
  const formInput =
    body && typeof body === "object" && "data" in body
      ? body.data
      : (body as unknown as ProposalFormData);
  const utm = body?.utm ?? {};

  const result = proposalSchema.safeParse(formInput);
  if (!result.success) {
    return Response.json(
      { error: "validation", issues: result.error.issues },
      { status: 422 },
    );
  }
  const data = result.data;

  // ─── Insert into Supabase (canonical submission signal) ──────────────────
  if (!isSupabaseConfigured()) {
    // If Supabase isn't live yet, fall back to firing the legacy webhook only
    // so submissions don't drop during the rollout window. Non-blocking.
    console.warn(
      "[api/proposal] Supabase not configured — using legacy webhook-only path",
    );
    const legacyPayload = buildGhlWebhookPayload(data, "");
    await sendToGHL(legacyPayload).catch(() => undefined);
    return Response.json({
      success: true,
      proposalId: null,
      estimatedValue: legacyPayload.estimated_value,
      mode: "legacy-webhook",
    });
  }

  const supabase = getSupabaseAdmin();
  const row = buildSupabaseRow(data, utm);

  const { data: inserted, error: insertError } = await supabase
    .from("proposals")
    .insert(row)
    .select(
      "id, estimated_value_usd, contact_email, contact_first_name, business_name, services, industry_label, timeline",
    )
    .single();

  if (insertError || !inserted) {
    console.error("[api/proposal] supabase insert failed", insertError);
    // Fall back to webhook so we don't lose the lead
    const legacyPayload = buildGhlWebhookPayload(data, "");
    await sendToGHL(legacyPayload).catch(() => undefined);
    return Response.json(
      { error: "persistence", message: insertError?.message },
      { status: 500 },
    );
  }

  const proposalId = inserted.id as string;
  const estimatedValue = inserted.estimated_value_usd as number;

  // Log submission event up front
  await logProposalEvent(proposalId, "submitted", {
    source: row.source,
    utm,
    estimated_value_usd: estimatedValue,
  });

  // ─── Fire side-effects in parallel ───────────────────────────────────────
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://asksaul.ai";
  const adminUrl = `${siteUrl}/admin/proposals/${proposalId}`;
  const internalTo =
    process.env.INTERNAL_NOTIFICATION_EMAIL ?? "saul3000bot@gmail.com";

  const confirmationProps = {
    firstName: data.firstName,
    businessName: data.businessName,
    services: data.services,
    industry: data.industry,
    timeline: data.timeline,
    estimatedValueRange:
      estimatedValue > 0
        ? `$${Math.round(estimatedValue * 0.85).toLocaleString()} to $${Math.round(estimatedValue * 1.25).toLocaleString()}`
        : undefined,
    siteUrl,
  };

  const internalProps = {
    ...data,
    proposalId,
    createdAt: new Date().toISOString(),
    estimatedValueUsd: estimatedValue,
    leadValueTag: row.lead_value_tag ?? "starter",
    tags: row.tags,
    adminUrl,
  };

  const confirmationHtml = await render(
    React.createElement(Confirmation, confirmationProps),
  );
  const internalHtml = await render(
    React.createElement(InternalNotification, internalProps),
  );

  // Use v2 API if configured, else fall back to legacy webhook
  const ghlSyncTask = isGhlV2Configured()
    ? syncProposalToGhl(
        data,
        proposalId,
        row.service_details as Record<string, unknown>,
        row.vertical_details as Record<string, unknown>,
      )
    : sendToGHL(buildGhlWebhookPayload(data, proposalId));

  const [confirmRes, internalRes, ghlRes] = await Promise.allSettled([
    sendEmail({
      to: data.email,
      subject: confirmationSubject(confirmationProps),
      html: confirmationHtml,
      replyTo: internalTo,
    }),
    sendEmail({
      to: internalTo,
      subject: internalSubject(internalProps),
      html: internalHtml,
    }),
    ghlSyncTask,
  ]);

  // ─── Log side-effect outcomes to events + update proposal fields ─────────
  const updates: Record<string, unknown> = {};

  if (confirmRes.status === "fulfilled" && !confirmRes.value.error) {
    updates.resend_confirmation_id = confirmRes.value.id;
    await logProposalEvent(proposalId, "email_sent", {
      kind: "confirmation",
      to: data.email,
      message_id: confirmRes.value.id,
    });
  } else {
    const err =
      confirmRes.status === "rejected"
        ? String(confirmRes.reason)
        : confirmRes.value.error;
    await logProposalEvent(proposalId, "email_failed", {
      kind: "confirmation",
      to: data.email,
      error: err,
    });
  }

  if (internalRes.status === "fulfilled" && !internalRes.value.error) {
    updates.resend_internal_notification_id = internalRes.value.id;
    await logProposalEvent(proposalId, "email_sent", {
      kind: "internal_notification",
      to: internalTo,
      message_id: internalRes.value.id,
    });
  } else {
    const err =
      internalRes.status === "rejected"
        ? String(internalRes.reason)
        : internalRes.value.error;
    await logProposalEvent(proposalId, "email_failed", {
      kind: "internal_notification",
      to: internalTo,
      error: err,
    });
  }

  if (ghlRes.status === "fulfilled" && ghlRes.value.ok) {
    updates.ghl_sync_status = "synced";
    updates.ghl_synced_at = new Date().toISOString();
    // v2 carries contactId + opportunityId; webhook carries status
    const v = ghlRes.value as {
      ok: true;
      contactId?: string;
      opportunityId?: string;
      status?: number;
    };
    if (v.contactId) updates.ghl_contact_id = v.contactId;
    if (v.opportunityId) updates.ghl_opportunity_id = v.opportunityId;
    await logProposalEvent(proposalId, "ghl_synced", {
      mode: isGhlV2Configured() ? "v2" : "webhook",
      contact_id: v.contactId,
      opportunity_id: v.opportunityId,
      status: v.status,
    });
  } else {
    const err =
      ghlRes.status === "rejected"
        ? String(ghlRes.reason)
        : (ghlRes.value as { error?: string }).error;
    updates.ghl_sync_status = "failed";
    await logProposalEvent(proposalId, "ghl_failed", { error: err });
  }

  if (Object.keys(updates).length > 0) {
    await supabase.from("proposals").update(updates).eq("id", proposalId);
  }

  return Response.json({
    success: true,
    proposalId,
    estimatedValue,
  });
}
