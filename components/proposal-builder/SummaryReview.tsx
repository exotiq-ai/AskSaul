import type { ProposalFormData } from "@/lib/validation";

const SERVICE_LABELS: Record<string, string> = {
  "ai-assistant": "AI Assistant / Chatbot",
  website: "Website Build or Redesign",
  marketing: "Marketing Automation / CRM",
  automation: "Workflow Automation",
  "voice-agent": "Voice Agent",
  "custom-app": "Custom App / Platform",
  "not-sure": "Not Sure Yet",
};

const TIMELINE_LABELS: Record<string, string> = {
  asap: "ASAP",
  "1-2-weeks": "1 to 2 weeks",
  "1-2-months": "1 to 2 months",
  exploring: "Just exploring",
};

const BUDGET_LABELS: Record<string, string> = {
  "under-2k": "Under $2K",
  "2k-5k": "$2K to $5K",
  "5k-10k": "$5K to $10K",
  "10k-25k": "$10K to $25K",
  "25k-plus": "$25K+",
};

const SPEND_LABELS: Record<string, string> = {
  "under-1k": "Under $1K / mo",
  "1k-2.5k": "$1K to $2.5K / mo",
  "2.5k-5k": "$2.5K to $5K / mo",
  "5k-10k": "$5K to $10K / mo",
  "10k-25k": "$10K to $25K / mo",
  "25k-plus": "$25K+ / mo",
  "not-sure": "Not sure",
};

interface SummaryRowProps {
  label: string;
  value: string | string[] | undefined;
}

function SummaryRow({ label, value }: SummaryRowProps) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  const display = Array.isArray(value) ? value.join(", ") : value;
  return (
    <div className="flex justify-between items-start gap-4 py-2 border-b border-wire/50 last:border-b-0">
      <span className="text-sm text-slate shrink-0">{label}</span>
      <span className="text-sm text-cloud text-right">{display}</span>
    </div>
  );
}

interface SummaryReviewProps {
  data: Partial<ProposalFormData>;
  onEdit: (step: number) => void;
}

export default function SummaryReview({ data, onEdit }: SummaryReviewProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Services */}
      <div className="bg-graphite rounded-xl p-4 border border-wire">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-dim">Services</p>
          <button
            type="button"
            onClick={() => onEdit(1)}
            className="text-xs text-cyan hover:text-cyan/80 transition-colors"
          >
            Edit
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(data.services ?? []).map((s) => (
            <span
              key={s}
              className="px-2.5 py-1 rounded-full bg-cyan/10 border border-cyan/30 text-cyan text-xs font-medium"
            >
              {SERVICE_LABELS[s] ?? s}
            </span>
          ))}
        </div>
      </div>

      {/* Business */}
      <div className="bg-graphite rounded-xl p-4 border border-wire">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-dim">Business</p>
          <button
            type="button"
            onClick={() => onEdit(2)}
            className="text-xs text-cyan hover:text-cyan/80 transition-colors"
          >
            Edit
          </button>
        </div>
        <SummaryRow label="Business" value={data.businessName} />
        <SummaryRow label="Industry" value={data.industry} />
        <SummaryRow label="Team size" value={data.teamSize} />
        {data.revenueRange && (
          <SummaryRow label="Revenue" value={data.revenueRange.replace(/-/g, " ")} />
        )}
        <SummaryRow
          label="Monthly sales/marketing spend"
          value={data.monthlySpend ? SPEND_LABELS[data.monthlySpend] : undefined}
        />
        <SummaryRow label="Current tools" value={data.currentTools} />
      </div>

      {/* Contact */}
      <div className="bg-graphite rounded-xl p-4 border border-wire">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-dim">Contact</p>
          <button
            type="button"
            onClick={() => onEdit(4)}
            className="text-xs text-cyan hover:text-cyan/80 transition-colors"
          >
            Edit
          </button>
        </div>
        <SummaryRow label="Name" value={data.name} />
        <SummaryRow label="Email" value={data.email} />
        <SummaryRow label="Phone" value={data.phone} />
        <SummaryRow
          label="Preferred contact"
          value={data.preferredContact}
        />
        <SummaryRow
          label="Timeline"
          value={data.timeline ? TIMELINE_LABELS[data.timeline] : undefined}
        />
        <SummaryRow
          label="Budget"
          value={data.budget ? BUDGET_LABELS[data.budget] : undefined}
        />
      </div>

      {data.notes && (
        <div className="bg-graphite rounded-xl p-4 border border-wire">
          <p className="text-xs font-semibold uppercase tracking-widest text-dim mb-2">Notes</p>
          <p className="text-sm text-slate leading-relaxed">{data.notes}</p>
        </div>
      )}

      <p className="text-xs text-dim text-center">
        Review everything above. When it looks right, submit and Saul will get to work.
      </p>
    </div>
  );
}
