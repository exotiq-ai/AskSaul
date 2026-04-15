import { type NextRequest } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { logProposalEvent } from "@/lib/events";
import { buildGhlWebhookPayload } from "@/lib/payload";
import { sendToGHL } from "@/lib/ghl";
import { syncProposalToGhl, isGhlV2Configured } from "@/lib/ghl-v2";
import { proposalSchema, type ProposalFormData } from "@/lib/validation";

/**
 * Retry cron endpoint. Invoke from Netlify Scheduled Functions or Vercel Cron
 * (every 10 minutes). Protected by ADMIN_API_SECRET.
 *
 * Finds proposals with ghl_sync_status='failed' older than 5 minutes (to give
 * the initial sync a chance to finish) and re-attempts the sync.
 */

const STALE_THRESHOLD_MS = 5 * 60 * 1000; // 5 min
const BATCH_LIMIT = 25;

function checkAuth(req: NextRequest): boolean {
  const expected = process.env.ADMIN_API_SECRET;
  if (!expected) return false;
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : header;
  return token === expected;
}

/**
 * Reconstruct a ProposalFormData-shaped object from a stored proposals row.
 * Used to replay GHL sync. Best-effort; we fall back to webhook payload which
 * doesn't rely on every field.
 */
function rowToFormData(row: Record<string, unknown>): ProposalFormData | null {
  const candidate = {
    services: row.services,
    industry: row.industry_label,
    businessName: row.business_name,
    businessWebsite: row.business_website ?? undefined,
    teamSize: row.team_size,
    revenueRange: row.revenue_range ?? undefined,
    monthlySpend: row.monthly_spend ?? undefined,
    roleInCompany: row.role_in_company ?? undefined,
    decisionMaker:
      row.decision_maker && row.decision_maker !== "unspecified"
        ? row.decision_maker
        : undefined,
    currentTools: row.current_tools ?? [],
    complianceNeeds: row.compliance_needs ?? [],
    firstName: row.contact_first_name,
    lastName: row.contact_last_name ?? undefined,
    email: row.contact_email,
    phone: row.contact_phone,
    preferredContact: row.preferred_contact,
    timeline: row.timeline,
    hardDeadline: row.hard_deadline ?? undefined,
    budget: row.budget ?? undefined,
    successMetrics: row.success_metrics ?? undefined,
    notes: row.notes ?? undefined,
    smsConsent: row.sms_consent ?? false,
    marketingSmsOptIn: row.marketing_sms_opt_in ?? false,
    // Service + vertical details are flattened; we lose the one-off fields but
    // the webhook + v2 note carry them via serviceDetails/verticalDetails.
  };
  const parsed = proposalSchema.safeParse(candidate);
  return parsed.success ? parsed.data : null;
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return Response.json({ error: "no_supabase" }, { status: 503 });
  }

  const supabase = getSupabaseAdmin();
  const cutoff = new Date(Date.now() - STALE_THRESHOLD_MS).toISOString();

  const { data: stale, error: queryErr } = await supabase
    .from("proposals")
    .select("*")
    .eq("ghl_sync_status", "failed")
    .lt("created_at", cutoff)
    .limit(BATCH_LIMIT);

  if (queryErr) {
    return Response.json({ error: queryErr.message }, { status: 500 });
  }

  if (!stale || stale.length === 0) {
    return Response.json({ retried: 0, succeeded: 0, failed: 0 });
  }

  let succeeded = 0;
  let failed = 0;

  for (const row of stale) {
    const formData = rowToFormData(row as Record<string, unknown>);
    await logProposalEvent(row.id as string, "ghl_retry_attempted", {});

    let ok = false;
    let err: string | undefined;
    let contactId: string | undefined;
    let opportunityId: string | undefined;

    try {
      if (isGhlV2Configured() && formData) {
        const result = await syncProposalToGhl(
          formData,
          row.id as string,
          (row.service_details as Record<string, unknown>) ?? {},
          (row.vertical_details as Record<string, unknown>) ?? {},
        );
        ok = result.ok;
        err = result.error;
        contactId = result.contactId;
        opportunityId = result.opportunityId;
      } else if (formData) {
        const payload = buildGhlWebhookPayload(formData, row.id as string);
        const result = await sendToGHL(payload);
        ok = result.ok;
        err = result.error ?? undefined;
      } else {
        err = "cannot_reconstruct_form_data";
      }
    } catch (e) {
      err = e instanceof Error ? e.message : String(e);
    }

    const updates: Record<string, unknown> = ok
      ? {
          ghl_sync_status: "synced",
          ghl_synced_at: new Date().toISOString(),
          ...(contactId ? { ghl_contact_id: contactId } : {}),
          ...(opportunityId ? { ghl_opportunity_id: opportunityId } : {}),
        }
      : { ghl_sync_status: "failed" };

    await supabase.from("proposals").update(updates).eq("id", row.id);

    if (ok) {
      succeeded++;
      await logProposalEvent(row.id as string, "ghl_synced", {
        contact_id: contactId,
        opportunity_id: opportunityId,
        mode: isGhlV2Configured() ? "v2" : "webhook",
        retry: true,
      });
    } else {
      failed++;
      await logProposalEvent(row.id as string, "ghl_failed", {
        error: err,
        retry: true,
      });
    }
  }

  return Response.json({
    retried: stale.length,
    succeeded,
    failed,
  });
}

// Also allow GET for simpler Netlify scheduled function invocation
export const GET = POST;
