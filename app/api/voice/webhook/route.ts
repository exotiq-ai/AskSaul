import { type NextRequest } from "next/server";
import { verifyWebhookSignature, unauthorizedResponse } from "@/lib/voice/auth";
import { getVoiceSupabase } from "@/lib/voice/supabase";

type ToolCall = { name?: string; tool_name?: string };
type WebhookPayload = {
  conversation_id?: string;
  started_at?: string;
  ended_at?: string;
  transcript?: unknown;
  tool_calls?: ToolCall[];
  audio_url?: string;
  metadata?: { caller_number?: string };
  cost?: { llm_usd?: number; tts_usd?: number };
};

export async function POST(request: NextRequest | Request) {
  const raw = await request.text();
  const sig = request.headers.get("elevenlabs-signature") ?? "";
  if (!verifyWebhookSignature(raw, sig)) return unauthorizedResponse();

  let payload: WebhookPayload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return Response.json({ error: "invalid JSON" }, { status: 400 });
  }

  const conversationId = payload.conversation_id;
  if (!conversationId) {
    return Response.json({ error: "missing conversation_id" }, { status: 400 });
  }

  const startedAt = payload.started_at ?? new Date().toISOString();
  const endedAt = payload.ended_at ?? null;
  const duration =
    endedAt && startedAt
      ? Math.round((new Date(endedAt).getTime() - new Date(startedAt).getTime()) / 1000)
      : null;

  const outcome = inferOutcome(payload);

  const sb = getVoiceSupabase();
  const { error } = await sb.from("call_logs").upsert(
    {
      conversation_id: conversationId,
      caller_number: payload.metadata?.caller_number ?? null,
      started_at: startedAt,
      ended_at: endedAt,
      duration_sec: duration,
      transcript_json: payload.transcript ?? null,
      tool_calls_json: payload.tool_calls ?? null,
      audio_url: payload.audio_url ?? null,
      llm_cost_usd: payload.cost?.llm_usd ?? null,
      tts_cost_usd: payload.cost?.tts_usd ?? null,
      outcome,
    },
    { onConflict: "conversation_id" },
  );
  if (error) console.error("[voice/webhook] upsert error:", error);

  return Response.json({ ok: true });
}

function inferOutcome(
  p: WebhookPayload,
): "info_only" | "lead_captured" | "escalated" | "abandoned" {
  const tools: string[] = (p.tool_calls ?? []).map((t) => t.name ?? t.tool_name ?? "");
  if (tools.includes("message_for_team")) return "escalated";
  if (tools.includes("create_lead") || tools.includes("private_dining_intake")) {
    return "lead_captured";
  }
  const duration =
    p.ended_at && p.started_at
      ? (new Date(p.ended_at).getTime() - new Date(p.started_at).getTime()) / 1000
      : 0;
  if (duration < 10) return "abandoned";
  return "info_only";
}
