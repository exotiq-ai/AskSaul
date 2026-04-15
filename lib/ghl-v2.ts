/**
 * GoHighLevel v2 API integration. Replaces the legacy webhook-only path.
 *
 * Key differences vs the webhook:
 * - We upsert a Contact by email (creates or updates)
 * - We create an Opportunity in the location's pipeline
 * - We attach a Note with the full service_details + vertical_details JSON
 * - Failures return typed errors so the caller can retry
 *
 * This module is intentionally a thin wrapper so callers can fall back to the
 * legacy webhook if the GHL v2 env isn't configured yet.
 */

import type { ProposalFormData } from "./validation";
import { calculateEstimatedValue, buildTags, getLeadValueTag } from "./scoring";

const GHL_BASE = "https://services.leadconnectorhq.com";

export interface GhlV2Result {
  ok: boolean;
  contactId?: string;
  opportunityId?: string;
  error?: string;
}

export function isGhlV2Configured(): boolean {
  return Boolean(process.env.GHL_API_KEY && process.env.GHL_LOCATION_ID);
}

interface GhlContactUpsertResponse {
  contact?: { id: string };
}

interface GhlOpportunityResponse {
  opportunity?: { id: string };
}

async function ghlFetch(
  path: string,
  init: RequestInit,
): Promise<Response> {
  const apiKey = process.env.GHL_API_KEY!;
  return fetch(`${GHL_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Version: "2021-07-28",
      "Content-Type": "application/json",
      ...(init.headers as Record<string, string> | undefined),
    },
  });
}

/**
 * Upsert a contact by email + return contact id.
 */
async function upsertContact(
  locationId: string,
  data: ProposalFormData,
  proposalId: string,
  tags: string[],
): Promise<{ id: string } | { error: string }> {
  const payload = {
    locationId,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName ?? "",
    phone: data.phone,
    companyName: data.businessName,
    website: data.businessWebsite ?? "",
    tags,
    customFields: [
      { key: "asksaul_proposal_id", value: proposalId },
      { key: "asksaul_industry", value: data.industry ?? "" },
      {
        key: "asksaul_services",
        value: (data.services ?? []).join(", "),
      },
      {
        key: "asksaul_estimated_value",
        value: String(calculateEstimatedValue(data)),
      },
      { key: "asksaul_timeline", value: data.timeline ?? "" },
      { key: "asksaul_hard_deadline", value: data.hardDeadline ?? "" },
      { key: "asksaul_success_metrics", value: data.successMetrics ?? "" },
    ],
  };

  const res = await ghlFetch("/contacts/upsert", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    return { error: `contact_upsert_${res.status}: ${txt.slice(0, 200)}` };
  }

  const body = (await res.json()) as GhlContactUpsertResponse;
  if (!body.contact?.id) return { error: "contact_upsert_no_id" };
  return { id: body.contact.id };
}

/**
 * Create an Opportunity linked to the upserted contact. Requires the
 * first pipeline's first stage; caller must pre-configure
 * GHL_DEFAULT_PIPELINE_ID and GHL_DEFAULT_STAGE_ID in env.
 */
async function createOpportunity(
  locationId: string,
  contactId: string,
  data: ProposalFormData,
  proposalId: string,
): Promise<{ id: string } | { error: string; skipped?: boolean }> {
  const pipelineId = process.env.GHL_DEFAULT_PIPELINE_ID;
  const stageId = process.env.GHL_DEFAULT_STAGE_ID;

  if (!pipelineId || !stageId) {
    // Not configured — skip (non-fatal)
    return {
      error: "pipeline_not_configured",
      skipped: true,
    };
  }

  const value = calculateEstimatedValue(data);

  const res = await ghlFetch("/opportunities/", {
    method: "POST",
    body: JSON.stringify({
      locationId,
      pipelineId,
      pipelineStageId: stageId,
      name: `${data.businessName} — ${(data.services ?? []).join(", ")}`,
      status: "open",
      contactId,
      monetaryValue: value,
      source: "asksaul-proposal-builder",
      customFields: [
        { key: "asksaul_proposal_id", value: proposalId },
      ],
    }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    return { error: `opp_create_${res.status}: ${txt.slice(0, 200)}` };
  }

  const body = (await res.json()) as GhlOpportunityResponse;
  if (!body.opportunity?.id) return { error: "opp_create_no_id" };
  return { id: body.opportunity.id };
}

/**
 * Attach a Note with the full context dump (service_details + vertical_details)
 * so Gregory has everything in one place inside GHL.
 */
async function addNote(
  locationId: string,
  contactId: string,
  noteBody: string,
): Promise<{ ok: boolean; error?: string }> {
  const res = await ghlFetch(`/contacts/${contactId}/notes`, {
    method: "POST",
    body: JSON.stringify({ userId: locationId, body: noteBody }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    return { ok: false, error: `note_${res.status}: ${txt.slice(0, 200)}` };
  }
  return { ok: true };
}

/**
 * Full sync: upsert contact + create opportunity + attach context note.
 * Returns partial success info so the caller can decide how to react.
 */
export async function syncProposalToGhl(
  data: ProposalFormData,
  proposalId: string,
  serviceDetails: Record<string, unknown>,
  verticalDetails: Record<string, unknown>,
): Promise<GhlV2Result> {
  if (!isGhlV2Configured()) {
    return { ok: false, error: "ghl_v2_not_configured" };
  }

  const locationId = process.env.GHL_LOCATION_ID!;
  const estimate = calculateEstimatedValue(data);
  const tags = buildTags(data, getLeadValueTag(estimate));

  const contactResult = await upsertContact(
    locationId,
    data,
    proposalId,
    tags,
  );
  if ("error" in contactResult) {
    return { ok: false, error: contactResult.error };
  }

  const noteBody = [
    `Proposal ID: ${proposalId}`,
    `Estimated value: $${estimate.toLocaleString()}`,
    `Timeline: ${data.timeline}`,
    data.hardDeadline ? `Hard deadline: ${data.hardDeadline}` : null,
    data.successMetrics ? `Success metrics: ${data.successMetrics}` : null,
    "",
    "Service details:",
    JSON.stringify(serviceDetails, null, 2),
    "",
    "Vertical details:",
    JSON.stringify(verticalDetails, null, 2),
  ]
    .filter(Boolean)
    .join("\n");

  // Fire note + opp in parallel
  const [noteRes, oppRes] = await Promise.all([
    addNote(locationId, contactResult.id, noteBody),
    createOpportunity(locationId, contactResult.id, data, proposalId),
  ]);

  const oppId = "id" in oppRes ? oppRes.id : undefined;
  const oppError =
    "error" in oppRes && !oppRes.skipped ? oppRes.error : undefined;

  return {
    ok: !oppError && noteRes.ok,
    contactId: contactResult.id,
    opportunityId: oppId,
    error: oppError ?? noteRes.error,
  };
}
