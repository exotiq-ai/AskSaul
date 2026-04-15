import type { ProposalFormData } from "@/lib/validation";
import { calculateEstimatedValue, formatValueRange } from "@/lib/scoring";

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

function Row({
  label,
  value,
}: {
  label: string;
  value: string | string[] | number | undefined | null;
}) {
  if (value === undefined || value === null || value === "") return null;
  if (Array.isArray(value) && value.length === 0) return null;
  const display = Array.isArray(value)
    ? value.join(", ")
    : typeof value === "number"
      ? String(value)
      : value;
  return (
    <div className="flex justify-between items-start gap-4 py-2 border-b border-wire/50 last:border-b-0">
      <span className="text-sm text-slate shrink-0">{label}</span>
      <span className="text-sm text-cloud text-right break-words max-w-[60%]">
        {display}
      </span>
    </div>
  );
}

function Card({
  title,
  step,
  onEdit,
  children,
}: {
  title: string;
  step: number;
  onEdit: (step: number) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-graphite rounded-xl p-4 border border-wire">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-dim">
          {title}
        </p>
        <button
          type="button"
          onClick={() => onEdit(step)}
          className="text-xs text-cyan hover:text-cyan/80 transition-colors"
        >
          Edit
        </button>
      </div>
      {children}
    </div>
  );
}

export default function SummaryReview({
  data,
  onEdit,
}: {
  data: Partial<ProposalFormData>;
  onEdit: (step: number) => void;
}) {
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ");
  const estimate =
    data.services && data.services.length > 0
      ? calculateEstimatedValue(data as ProposalFormData)
      : 0;
  const valueRange = estimate > 0 ? formatValueRange(estimate) : null;

  return (
    <div className="flex flex-col gap-6">
      {valueRange && (
        <div className="bg-cyan/5 border border-cyan/40 rounded-xl p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan mb-1">
            Preliminary scope
          </p>
          <p className="text-base text-cloud">
            Based on what you've told us, we're looking at roughly{" "}
            <span className="font-semibold text-cyan">{valueRange}</span>. Submit and Saul will send a real, scoped number within 24 hours.
          </p>
        </div>
      )}

      <Card title="Services" step={1} onEdit={onEdit}>
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
      </Card>

      <Card title="Business" step={2} onEdit={onEdit}>
        <Row label="Business" value={data.businessName} />
        <Row label="Website" value={data.businessWebsite} />
        <Row label="Industry" value={data.industry} />
        <Row label="Team size" value={data.teamSize} />
        <Row label="Your role" value={data.roleInCompany} />
        <Row label="Decision maker" value={data.decisionMaker} />
        <Row
          label="Revenue"
          value={data.revenueRange ? data.revenueRange.replace(/-/g, " ") : undefined}
        />
        <Row
          label="Monthly spend"
          value={data.monthlySpend ? SPEND_LABELS[data.monthlySpend] : undefined}
        />
      </Card>

      <Card title="Stack + compliance" step={3} onEdit={onEdit}>
        <Row label="Current tools" value={data.currentTools} />
        <Row label="Compliance" value={data.complianceNeeds} />
      </Card>

      <Card title="Project details" step={4} onEdit={onEdit}>
        {data.services?.includes("ai-assistant") && (
          <>
            <Row label="AI users" value={data.aiUserCount} />
            <Row label="AI platforms" value={data.aiPlatform} />
            <Row label="AI use cases" value={data.aiHelp} />
            <Row label="AI tier preference" value={data.aiTierPreference} />
            <Row label="AI message volume" value={data.aiMessageVolume} />
            <Row label="AI add-ons" value={data.aiAddons} />
          </>
        )}
        {data.services?.includes("website") && (
          <>
            <Row label="Existing site" value={data.websiteExisting} />
            <Row label="Existing URL" value={data.websiteExistingUrl} />
            <Row label="Pages" value={data.websitePages} />
            <Row label="E-commerce" value={data.websiteEcommerce} />
            <Row label="E-commerce platform" value={data.websiteEcommercePlatform} />
            <Row label="CMS" value={data.websiteCms} />
            <Row label="Design" value={data.websiteDesignStatus} />
            <Row label="Content" value={data.websiteContentStatus} />
            <Row label="Integrations" value={data.websiteIntegrations} />
          </>
        )}
        {data.services?.includes("marketing") && (
          <>
            <Row label="Marketing tools" value={data.marketingTools} />
            <Row label="Marketing pain" value={data.marketingPain} />
            <Row label="List size" value={data.marketingListSize} />
            <Row label="Email volume" value={data.marketingEmailVolume} />
            <Row label="SMS volume" value={data.marketingSmsVolume} />
            <Row label="Team seats" value={data.marketingTeamSeats} />
            <Row label="Review sources" value={data.marketingReviewSources} />
            <Row label="Automation complexity" value={data.marketingAutomationComplexity} />
          </>
        )}
        {data.services?.includes("automation") && (
          <>
            <Row label="Processes" value={data.automationProcesses} />
            <Row label="Daily tools" value={data.automationTools} />
          </>
        )}
        {data.services?.includes("voice-agent") && (
          <>
            <Row label="Voice use case" value={data.voiceUseCase} />
            <Row label="Call volume" value={data.voiceCallVolume} />
            <Row label="Languages" value={data.voiceLanguages} />
          </>
        )}
        {data.services?.includes("custom-app") && (
          <>
            <Row label="App description" value={data.customAppDescription} />
            <Row label="User types" value={data.customAppUserTypes} />
            <Row label="Key features" value={data.customAppKeyFeatures} />
            <Row label="Auth" value={data.customAppAuth} />
          </>
        )}
        {data.services?.includes("not-sure") && (
          <>
            <Row label="Biggest headache" value={data.notSureHeadache} />
            <Row label="Would automate" value={data.notSureAutomate} />
          </>
        )}
      </Card>

      <Card title="Timeline + contact" step={5} onEdit={onEdit}>
        <Row
          label="Timeline"
          value={data.timeline ? TIMELINE_LABELS[data.timeline] : undefined}
        />
        <Row label="Hard deadline" value={data.hardDeadline} />
        <Row
          label="Budget"
          value={data.budget ? BUDGET_LABELS[data.budget] : undefined}
        />
        <Row label="Success metrics" value={data.successMetrics} />
        <Row label="Name" value={fullName} />
        <Row label="Email" value={data.email} />
        <Row label="Phone" value={data.phone} />
        <Row label="Preferred contact" value={data.preferredContact} />
      </Card>

      {data.notes && (
        <div className="bg-graphite rounded-xl p-4 border border-wire">
          <p className="text-xs font-semibold uppercase tracking-widest text-dim mb-2">
            Notes
          </p>
          <p className="text-sm text-slate leading-relaxed whitespace-pre-wrap">
            {data.notes}
          </p>
        </div>
      )}

      <p className="text-xs text-dim text-center">
        Review everything above. When it looks right, submit and Saul will take it from here.
      </p>
    </div>
  );
}
