"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type DraftStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "sent"
  | "superseded";

interface Draft {
  id: string;
  version: number;
  status: DraftStatus;
  scope_summary: string | null;
  deliverables: unknown;
  price_usd: number | null;
  price_model: string | null;
  timeline_weeks: number | null;
  terms: string | null;
  markdown_body: string | null;
  html_body: string | null;
  created_at: string;
  sent_at: string | null;
  sent_to_email: string | null;
  resend_message_id: string | null;
}

const STATUS_COLORS: Record<DraftStatus, string> = {
  draft: "bg-dim/20 text-dim border-wire",
  pending_approval: "bg-ice/20 text-ice border-ice/40",
  approved: "bg-cyan/20 text-cyan border-cyan/40",
  sent: "bg-success/20 text-success border-success/40",
  superseded: "bg-dim/10 text-dim border-wire",
};

function fmt(d: string | null): string {
  if (!d) return "—";
  return new Date(d).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function DraftActions({
  proposalId,
  currentStatus,
  drafts,
}: {
  proposalId: string;
  currentStatus: string;
  drafts: Draft[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(drafts[0]?.id ?? null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedDraft = drafts.find((d) => d.id === selected) ?? null;

  function approveAndSend() {
    if (!selectedDraft) return;
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/admin/drafts/${selectedDraft.id}/send`, {
        method: "POST",
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body?.error ?? "Failed to send");
        return;
      }
      router.refresh();
    });
  }

  function updateStatus(newStatus: string) {
    const note = prompt("Add a note (optional):") ?? undefined;
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/admin/proposals/${proposalId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, note }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body?.error ?? "Failed to update status");
        return;
      }
      router.refresh();
    });
  }

  return (
    <section className="bg-carbon border border-wire rounded-2xl p-5 flex flex-col gap-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-dim">
        Drafts + actions
      </h2>

      {drafts.length === 0 ? (
        <p className="text-sm text-slate">
          No drafts yet. Ask Saul via MCP:{" "}
          <code className="text-xs text-cyan">draft_proposal</code>.
        </p>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {drafts.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelected(d.id)}
                className={`text-left p-3 rounded-lg border transition-colors ${
                  selected === d.id
                    ? "border-cyan bg-cyan/5"
                    : "border-wire bg-graphite hover:border-cyan/30"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-cloud">
                    v{d.version}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium border ${STATUS_COLORS[d.status] ?? ""}`}
                  >
                    {d.status}
                  </span>
                </div>
                <p className="text-xs text-slate mt-1">
                  ${(d.price_usd ?? 0).toLocaleString()} ·{" "}
                  {d.timeline_weeks ?? "?"} wks · {d.price_model ?? "fixed"}
                </p>
                <p className="text-xs text-dim mt-0.5">Created {fmt(d.created_at)}</p>
              </button>
            ))}
          </div>

          {selectedDraft && (
            <div className="border-t border-wire/50 pt-4">
              <h3 className="text-sm font-semibold text-cloud mb-2">
                Draft v{selectedDraft.version} preview
              </h3>
              <div className="bg-graphite rounded-lg p-3 max-h-96 overflow-y-auto">
                <pre className="text-xs text-slate font-mono whitespace-pre-wrap">
                  {selectedDraft.markdown_body ?? "(no body yet)"}
                </pre>
              </div>

              {selectedDraft.status === "pending_approval" ||
              selectedDraft.status === "approved" ? (
                <button
                  type="button"
                  onClick={approveAndSend}
                  disabled={isPending}
                  className="mt-3 w-full px-4 py-3 rounded-lg bg-cyan text-obsidian font-semibold disabled:opacity-50 hover:bg-cyan/90 transition-colors"
                >
                  {isPending ? "Sending..." : "Approve + Send"}
                </button>
              ) : selectedDraft.status === "sent" ? (
                <p className="mt-3 text-xs text-success">
                  Sent {fmt(selectedDraft.sent_at)} to{" "}
                  {selectedDraft.sent_to_email}
                </p>
              ) : null}
            </div>
          )}
        </>
      )}

      <div className="border-t border-wire/50 pt-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-dim mb-3">
          Change status
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {["reviewed", "quoted", "accepted", "rejected", "lost", "won"]
            .filter((s) => s !== currentStatus)
            .map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => updateStatus(s)}
                disabled={isPending}
                className="px-3 py-2 rounded-lg border border-wire bg-graphite text-sm text-slate hover:border-cyan/30 hover:text-cloud disabled:opacity-50 transition-colors"
              >
                {s}
              </button>
            ))}
        </div>
      </div>

      {error && <p className="text-xs text-error">{error}</p>}
    </section>
  );
}
