import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthed } from "@/lib/admin-auth";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  submitted: "bg-cyan/20 text-cyan border-cyan/40",
  reviewed: "bg-ice/20 text-ice border-ice/40",
  quoted: "bg-cyan/20 text-cyan border-cyan/40",
  accepted: "bg-success/20 text-success border-success/40",
  won: "bg-success/20 text-success border-success/40",
  rejected: "bg-dim/20 text-dim border-wire",
  lost: "bg-dim/20 text-dim border-wire",
};

function fmt(date: string): string {
  const d = new Date(date);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function AdminProposalsListPage() {
  if (!(await isAdminAuthed())) redirect("/admin/login");

  if (!isSupabaseConfigured()) {
    return (
      <main className="min-h-screen bg-obsidian text-cloud px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-3xl font-bold mb-4">Admin</h1>
          <p className="text-slate">
            Supabase not configured yet. Set <code>SUPABASE_URL</code> and{" "}
            <code>SUPABASE_SERVICE_ROLE_KEY</code> in Netlify env and redeploy.
          </p>
        </div>
      </main>
    );
  }

  const supabase = getSupabaseAdmin();
  const { data: proposals, error } = await supabase
    .from("proposals")
    .select(
      "id, created_at, status, business_name, contact_first_name, contact_last_name, contact_email, industry_label, services, estimated_value_usd, lead_value_tag, timeline, ghl_sync_status",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <main className="min-h-screen bg-obsidian text-cloud px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold">Proposals</h1>
            <p className="text-sm text-slate mt-1">
              Last 100 submissions. Click a row to see full detail.
            </p>
          </div>
          <Link
            href="/"
            className="text-sm text-slate hover:text-cloud transition-colors"
          >
            Back to site
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/40 text-sm">
            <p className="text-error font-semibold mb-1">Supabase error</p>
            <p className="text-slate font-mono">{error.message}</p>
          </div>
        )}

        {!proposals || proposals.length === 0 ? (
          <div className="bg-carbon border border-wire rounded-2xl p-10 text-center">
            <p className="text-slate">No proposals yet. They show up here as soon as people submit.</p>
          </div>
        ) : (
          <div className="bg-carbon border border-wire rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-graphite/60 text-xs font-semibold uppercase tracking-widest text-dim">
                  <th className="text-left px-4 py-3">When</th>
                  <th className="text-left px-4 py-3">Business</th>
                  <th className="text-left px-4 py-3">Contact</th>
                  <th className="text-left px-4 py-3">Industry</th>
                  <th className="text-left px-4 py-3">Services</th>
                  <th className="text-right px-4 py-3">Est. Value</th>
                  <th className="text-center px-4 py-3">Status</th>
                  <th className="text-center px-4 py-3">GHL</th>
                </tr>
              </thead>
              <tbody>
                {proposals.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t border-wire/40 hover:bg-graphite/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-slate whitespace-nowrap">
                      {fmt(p.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/proposals/${p.id}`}
                        className="text-sm font-medium text-cloud hover:text-cyan transition-colors"
                      >
                        {p.business_name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="text-cloud">
                        {[p.contact_first_name, p.contact_last_name]
                          .filter(Boolean)
                          .join(" ")}
                      </div>
                      <div className="text-xs text-dim">{p.contact_email}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate">
                      {p.industry_label ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate max-w-[200px] truncate">
                      {(p.services as string[] | null)?.join(", ") ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-cloud font-mono">
                      ${(p.estimated_value_usd ?? 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${
                          STATUS_COLORS[p.status] ??
                          "bg-dim/20 text-dim border-wire"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-dim">
                      {p.ghl_sync_status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
