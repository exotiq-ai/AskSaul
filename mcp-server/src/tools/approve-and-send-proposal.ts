import { getSupabaseAdmin, logEvent } from "../supabase.js";
import {
  ApproveAndSendInput,
  type ApproveAndSendInputT,
} from "../schemas.js";
import { sendProposalEmail } from "../emailer.js";

export const approveAndSendProposalTool = {
  name: "approve_and_send_proposal",
  description:
    "Approve a pending draft and send it to the prospect via Resend. Draft must be in status 'pending_approval' or 'approved'. Uses proposal_drafts.html_body as the email body. On success: marks draft status='sent' with sent_at, resend_message_id, approved_at, approved_by='gregory'; updates parent proposal status='quoted'; logs quote_sent event. Only call this after Gregory confirms the draft content.",
  inputSchema: {
    type: "object" as const,
    properties: {
      draftId: { type: "string", format: "uuid" },
    },
    required: ["draftId"],
  },
  async run(raw: unknown) {
    const input: ApproveAndSendInputT = ApproveAndSendInput.parse(raw);
    const supabase = getSupabaseAdmin();

    const { data: draft, error: dErr } = await supabase
      .from("proposal_drafts")
      .select("*")
      .eq("id", input.draftId)
      .single();
    if (dErr) throw new Error(`approve_and_send: ${dErr.message}`);

    if (draft.status !== "pending_approval" && draft.status !== "approved") {
      throw new Error(
        `Draft ${input.draftId} has status '${draft.status}'; must be pending_approval or approved.`
      );
    }
    if (!draft.html_body) {
      throw new Error(`Draft ${input.draftId} is missing html_body.`);
    }

    const { data: proposal, error: pErr } = await supabase
      .from("proposals")
      .select("id, business_name, contact_email, contact_first_name")
      .eq("id", draft.proposal_id)
      .single();
    if (pErr) throw new Error(`approve_and_send proposal: ${pErr.message}`);

    const subject = `Your AskSaul proposal — ${proposal.business_name}`;
    const replyTo = process.env.INTERNAL_NOTIFICATION_EMAIL;

    const sendResult = await sendProposalEmail({
      to: proposal.contact_email,
      subject,
      html: draft.html_body,
      replyTo,
    });

    const now = new Date().toISOString();

    const { error: updDraftErr } = await supabase
      .from("proposal_drafts")
      .update({
        status: "sent",
        sent_at: now,
        sent_to_email: proposal.contact_email,
        resend_message_id: sendResult.id,
        approved_at: now,
        approved_by: "gregory",
      })
      .eq("id", input.draftId);
    if (updDraftErr) {
      // Email is already out; surface but don't rethrow the send.
      await logEvent({
        proposalId: proposal.id,
        eventType: "email_failed",
        actor: "system",
        payload: {
          phase: "post_send_update_draft",
          draft_id: input.draftId,
          resend_message_id: sendResult.id,
          error: updDraftErr.message,
        },
      });
      throw new Error(
        `Email sent (${sendResult.id}) but draft update failed: ${updDraftErr.message}`
      );
    }

    // Supersede any other active drafts for this proposal.
    await supabase
      .from("proposal_drafts")
      .update({ status: "superseded" })
      .eq("proposal_id", proposal.id)
      .neq("id", input.draftId)
      .in("status", ["draft", "pending_approval", "approved"]);

    const { error: updPropErr } = await supabase
      .from("proposals")
      .update({ status: "quoted" })
      .eq("id", proposal.id);
    if (updPropErr) throw new Error(`approve_and_send proposal update: ${updPropErr.message}`);

    await logEvent({
      proposalId: proposal.id,
      eventType: "quote_sent",
      actor: "gregory",
      payload: {
        draft_id: input.draftId,
        version: draft.version,
        resend_message_id: sendResult.id,
        to: proposal.contact_email,
        subject,
      },
    });

    return {
      ok: true,
      draftId: input.draftId,
      proposalId: proposal.id,
      resendMessageId: sendResult.id,
      sentTo: proposal.contact_email,
      sentAt: now,
    };
  },
};
