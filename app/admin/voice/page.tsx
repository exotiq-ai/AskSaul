// app/admin/voice/page.tsx
import Link from "next/link";
import { getVoiceSupabase } from "@/lib/voice/supabase";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminVoicePage() {
  await requireAdmin();
  const sb = getVoiceSupabase();

  const [leads, calls] = await Promise.all([
    sb.from("voice_leads").select("*").order("created_at", { ascending: false }).limit(50),
    sb
      .from("call_logs")
      .select("conversation_id,caller_number,started_at,duration_sec,outcome")
      .order("started_at", { ascending: false })
      .limit(50),
  ]);

  return (
    <main className="min-h-screen bg-obsidian text-cloud">
      <div className="mx-auto max-w-6xl p-6">
        <h1 className="mb-6 text-2xl font-semibold">Voice · Sawyer · Wolf&apos;s Tailor</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <section>
            <h2 className="mb-3 text-lg font-medium">Leads ({leads.data?.length ?? 0})</h2>
            <ul className="divide-y divide-wire rounded border border-wire bg-carbon">
              {(leads.data ?? []).map((l) => (
                <li key={l.id} className="p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{l.name}</span>
                    <span className="rounded bg-graphite px-2 py-0.5 text-xs">{l.kind}</span>
                  </div>
                  <div className="text-slate">
                    {l.phone}
                    {l.party_size ? ` · party of ${l.party_size}` : ""}
                    {l.requested_date ? ` · ${l.requested_date}` : ""}
                    {l.allergy_flag && <span className="ml-2 text-amber-400">⚠ allergy</span>}
                  </div>
                  {l.notes && <div className="mt-1 text-xs text-slate">{l.notes}</div>}
                  <Link
                    href={`/admin/voice/${l.conversation_id}`}
                    className="text-xs text-cyan hover:underline"
                  >
                    View call →
                  </Link>
                </li>
              ))}
              {leads.data?.length === 0 && (
                <li className="p-3 text-sm text-slate">No leads yet.</li>
              )}
            </ul>
          </section>
          <section>
            <h2 className="mb-3 text-lg font-medium">Recent calls ({calls.data?.length ?? 0})</h2>
            <ul className="divide-y divide-wire rounded border border-wire bg-carbon">
              {(calls.data ?? []).map((c) => (
                <li key={c.conversation_id} className="p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/admin/voice/${c.conversation_id}`}
                      className="font-mono text-xs text-cyan hover:underline"
                    >
                      {c.conversation_id.slice(-8)}
                    </Link>
                    <span className="rounded bg-graphite px-2 py-0.5 text-xs">
                      {c.outcome ?? "—"}
                    </span>
                  </div>
                  <div className="text-slate">
                    {c.caller_number ?? "unknown"} ·{" "}
                    {new Date(c.started_at).toLocaleString()} · {c.duration_sec}s
                  </div>
                </li>
              ))}
              {calls.data?.length === 0 && (
                <li className="p-3 text-sm text-slate">No calls yet.</li>
              )}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
