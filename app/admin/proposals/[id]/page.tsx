import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { isAdminAuthed } from "@/lib/admin-auth";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import DraftActions from "./DraftActions";

export const dynamic = "force-dynamic";

function fmt(date: string | null | undefined): string {
  if (!date) return "—";
  const d = new Date(date);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function AdminProposalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdminAuthed())) redirect("/admin/login");
  if (!isSupabaseConfigured()) redirect("/admin/proposals");

  const { id } = await params;
  const supabase = getSupabaseAdmin();

  const { data: proposal, error: propErr } = await supabase
    .from("proposals")
    .select("*")
    .eq("id", id)
    .single();

  if (propErr || !proposal) notFound();

  const { data: drafts } = await supabase
    .from("proposal_drafts")
    .select("*")
    .eq("proposal_id", id)
    .order("version", { ascending: false });

  const { data: events } = await supabase
    .from("proposal_events")
    .select("*")
    .eq("proposal_id", id)
    .order("created_at", { ascending: false })
    .limit(40);

  const serviceDetails = (proposal.service_details as Record<string, unknown>) ?? {};
  const verticalDetails = (proposal.vertical_details as Record<string, unknown>) ?? {};

  return (
    <main className="min-h-screen bg-obsidian text-cloud px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/admin/proposals"
          className="text-sm text-slate hover:text-cloud transition-colors"
        >
          ← All proposals
        </Link>

        <div className="mt-4 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-3xl font-bold">
              {proposal.business_name}
            </h1>
            <p className="text-sm text-slate mt-1">
              {proposal.contact_first_name} {proposal.contact_last_name} ·{" "}
              {proposal.contact_email}
            </p>
            <p className="text-xs text-dim mt-1 font-mono">{id}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan/10 border border-cyan/40 text-sm text-cyan font-semibold">
              {proposal.status}
            </span>
            <span className="text-2xl font-mono text-cloud">
              ${(proposal.estimated_value_usd ?? 0).toLocaleString()}
            </span>
            <span className="text-xs text-dim">
              {proposal.lead_value_tag}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Left: proposal detail */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <Panel title="Submission">
              <Kv label="Submitted" value={fmt(proposal.created_at)} />
              <Kv label="Industry" value={proposal.industry_label} />
              <Kv label="Team size" value={proposal.team_size} />
              <Kv label="Role" value={proposal.role_in_company} />
              <Kv label="Decision maker" value={proposal.decision_maker} />
              <Kv label="Revenue" value={proposal.revenue_range} />
              <Kv label="Monthly spend" value={proposal.monthly_spend} />
              <Kv label="Website" value={proposal.business_website} link />
              <Kv label="Timeline" value={proposal.timeline} />
              <Kv label="Hard deadline" value={proposal.hard_deadline} />
              <Kv label="Budget" value={proposal.budget} />
              <Kv
                label="Preferred contact"
                value={proposal.preferred_contact}
              />
              <Kv label="Phone" value={proposal.contact_phone} />
            </Panel>

            {proposal.success_metrics && (
              <Panel title="Success metrics">
                <p className="text-sm text-slate whitespace-pre-wrap">
                  {proposal.success_metrics}
                </p>
              </Panel>
            )}

            <Panel title="Services">
              <div className="flex flex-wrap gap-2">
                {(proposal.services as string[]).map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-full bg-cyan/10 border border-cyan/30 text-cyan text-xs font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Panel>

            <Panel title="Stack + compliance">
              <Kv
                label="Current tools"
                value={(proposal.current_tools as string[])?.join(", ")}
              />
              <Kv
                label="Compliance"
                value={(proposal.compliance_needs as string[])?.join(", ")}
              />
            </Panel>

            {Object.keys(serviceDetails).length > 0 && (
              <Panel title="Service details">
                <pre className="text-xs text-slate font-mono whitespace-pre-wrap overflow-x-auto">
                  {JSON.stringify(serviceDetails, null, 2)}
                </pre>
              </Panel>
            )}

            {Object.keys(verticalDetails).length > 0 && (
              <Panel title="Vertical details">
                <pre className="text-xs text-slate font-mono whitespace-pre-wrap overflow-x-auto">
                  {JSON.stringify(verticalDetails, null, 2)}
                </pre>
              </Panel>
            )}

            {proposal.notes && (
              <Panel title="Notes">
                <p className="text-sm text-slate whitespace-pre-wrap">
                  {proposal.notes}
                </p>
              </Panel>
            )}
          </div>

          {/* Right: drafts + actions + events */}
          <div className="flex flex-col gap-5">
            <DraftActions
              proposalId={id}
              currentStatus={proposal.status}
              drafts={drafts ?? []}
            />

            <Panel title="Recent events">
              <div className="flex flex-col gap-2">
                {(events ?? []).map((e) => (
                  <div key={e.id} className="text-xs border-b border-wire/40 pb-2 last:border-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-cyan font-mono">{e.event_type}</span>
                      <span className="text-dim">{fmt(e.created_at)}</span>
                    </div>
                    <div className="text-slate mt-0.5">by {e.actor}</div>
                  </div>
                ))}
                {(events ?? []).length === 0 && (
                  <p className="text-xs text-dim">No events yet.</p>
                )}
              </div>
            </Panel>

            <Panel title="Tags">
              <div className="flex flex-wrap gap-1.5">
                {(proposal.tags as string[])?.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded bg-graphite border border-wire text-xs text-slate font-mono"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Panel>

            <Panel title="Integrations">
              <Kv label="GHL sync" value={proposal.ghl_sync_status} />
              <Kv label="GHL synced at" value={fmt(proposal.ghl_synced_at)} />
              <Kv label="Confirmation email" value={proposal.resend_confirmation_id} />
              <Kv label="Internal email" value={proposal.resend_internal_notification_id} />
            </Panel>
          </div>
        </div>
      </div>
    </main>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-carbon border border-wire rounded-2xl p-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-dim mb-4">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Kv({
  label,
  value,
  link = false,
}: {
  label: string;
  value: string | null | undefined | number;
  link?: boolean;
}) {
  if (value === null || value === undefined || value === "") {
    return (
      <div className="flex justify-between gap-3 py-1.5 border-b border-wire/30 last:border-0">
        <span className="text-xs text-dim shrink-0">{label}</span>
        <span className="text-xs text-dim">—</span>
      </div>
    );
  }
  return (
    <div className="flex justify-between gap-3 py-1.5 border-b border-wire/30 last:border-0">
      <span className="text-xs text-dim shrink-0">{label}</span>
      {link && typeof value === "string" ? (
        <a
          href={value.startsWith("http") ? value : `https://${value}`}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-cyan hover:underline break-all"
        >
          {value}
        </a>
      ) : (
        <span className="text-xs text-cloud text-right break-words max-w-[70%]">
          {String(value)}
        </span>
      )}
    </div>
  );
}
