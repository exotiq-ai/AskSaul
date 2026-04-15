import { type NextRequest } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { logProposalEvent } from "@/lib/events";
import { sendEmail } from "@/lib/email";

/**
 * Approve + send a draft. Mirrors the MCP server's approve_and_send_proposal
 * so Gregory can trigger sends from the web UI too.
 */
export async function POST(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthed())) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return Response.json({ error: "no_supabase" }, { status: 503 });
  }

  const { id: draftId } = await ctx.params;
  const supabase = getSupabaseAdmin();

  const { data: draft, error: draftErr } = await supabase
    .from("proposal_drafts")
    .select("*")
    .eq("id", draftId)
    .single();

  if (draftErr || !draft) {
    return Response.json({ error: "draft_not_found" }, { status: 404 });
  }
  if (draft.status !== "pending_approval" && draft.status !== "approved") {
    return Response.json(
      { error: `cannot_send_from_status:${draft.status}` },
      { status: 409 },
    );
  }
  if (!draft.html_body) {
    return Response.json({ error: "no_html_body" }, { status: 409 });
  }

  const { data: proposal } = await supabase
    .from("proposals")
    .select("contact_email, contact_first_name, business_name")
    .eq("id", draft.proposal_id)
    .single();

  if (!proposal?.contact_email) {
    return Response.json({ error: "no_contact_email" }, { status: 409 });
  }

  const subject = `${proposal.business_name}: proposal from AskSaul`;
  const sendRes = await sendEmail({
    to: proposal.contact_email,
    subject,
    html: draft.html_body,
    replyTo: process.env.INTERNAL_NOTIFICATION_EMAIL ?? undefined,
  });

  if (sendRes.error) {
    await logProposalEvent(
      draft.proposal_id,
      "email_failed",
      { kind: "proposal", draft_id: draftId, error: sendRes.error },
      "gregory",
    );
    return Response.json(
      { error: "send_failed", message: sendRes.error },
      { status: 502 },
    );
  }

  // Mark this draft sent; supersede any other active drafts
  const now = new Date().toISOString();
  await supabase
    .from("proposal_drafts")
    .update({
      status: "superseded",
    })
    .eq("proposal_id", draft.proposal_id)
    .in("status", ["draft", "pending_approval", "approved"])
    .neq("id", draftId);

  await supabase
    .from("proposal_drafts")
    .update({
      status: "sent",
      approved_at: draft.approved_at ?? now,
      approved_by: "gregory",
      sent_at: now,
      sent_to_email: proposal.contact_email,
      resend_message_id: sendRes.id,
    })
    .eq("id", draftId);

  await supabase
    .from("proposals")
    .update({ status: "quoted" })
    .eq("id", draft.proposal_id);

  await logProposalEvent(
    draft.proposal_id,
    "quote_sent",
    {
      draft_id: draftId,
      version: draft.version,
      to: proposal.contact_email,
      resend_message_id: sendRes.id,
    },
    "gregory",
  );

  return Response.json({
    success: true,
    resendMessageId: sendRes.id,
  });
}
