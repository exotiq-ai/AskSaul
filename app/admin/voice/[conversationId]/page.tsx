// app/admin/voice/[conversationId]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { getVoiceSupabase } from "@/lib/voice/supabase";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

interface TranscriptTurn {
  role?: string;
  content?: string;
  text?: string;
  message?: string;
}

export default async function VoiceCallDetail({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  await requireAdmin();
  const { conversationId } = await params;
  const sb = getVoiceSupabase();

  const [call, leads] = await Promise.all([
    sb.from("call_logs").select("*").eq("conversation_id", conversationId).single(),
    sb.from("voice_leads").select("*").eq("conversation_id", conversationId),
  ]);

  if (!call.data) notFound();

  const turns = (call.data.transcript_json as TranscriptTurn[] | null) ?? [];
  const tools = (call.data.tool_calls_json as unknown[] | null) ?? [];

  return (
    <main className="min-h-screen bg-obsidian text-cloud">
      <div className="mx-auto max-w-4xl p-6">
        <Link href="/admin/voice" className="mb-4 inline-block text-sm text-cyan hover:underline">
          ← back to voice inbox
        </Link>
        <h1 className="mb-2 text-xl font-semibold">Call {conversationId.slice(-8)}</h1>
        <p className="mb-4 text-sm text-slate">
          {new Date(call.data.started_at).toLocaleString()} · {call.data.duration_sec}s ·{" "}
          {call.data.caller_number ?? "unknown"} · outcome: {call.data.outcome ?? "—"}
        </p>
        {call.data.audio_url && (
          <audio controls src={call.data.audio_url} className="mb-6 w-full" />
        )}

        {leads.data && leads.data.length > 0 && (
          <section className="mb-6 rounded border border-amber-700 bg-amber-950/30 p-4 text-sm">
            <h3 className="mb-2 font-medium">Lead captured</h3>
            <pre className="whitespace-pre-wrap text-xs">
              {JSON.stringify(leads.data, null, 2)}
            </pre>
          </section>
        )}

        <section className="mb-6">
          <h3 className="mb-2 font-medium">Transcript</h3>
          <ul className="space-y-2">
            {turns.map((t, i) => (
              <li
                key={i}
                className={`rounded p-3 text-sm ${
                  t.role === "agent" ? "bg-carbon border border-wire" : "bg-graphite"
                }`}
              >
                <strong className="mr-2">{t.role ?? "?"}:</strong>
                {t.content ?? t.text ?? t.message ?? ""}
              </li>
            ))}
            {turns.length === 0 && <li className="text-sm text-slate">No transcript.</li>}
          </ul>
        </section>

        <section>
          <h3 className="mb-2 font-medium">Tool calls</h3>
          <pre className="rounded bg-carbon border border-wire p-3 text-xs">
{JSON.stringify(tools, null, 2)}
          </pre>
        </section>
      </div>
    </main>
  );
}
