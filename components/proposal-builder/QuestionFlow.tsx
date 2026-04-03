"use client";

import { useFormContext } from "react-hook-form";
import type { ProposalFormData, ServiceOption } from "@/lib/validation";
import {
  AI_USER_COUNT_OPTIONS,
  AI_PLATFORM_OPTIONS,
  AI_HELP_OPTIONS,
  WEBSITE_EXISTING_OPTIONS,
  WEBSITE_PAGES_OPTIONS,
  ECOMMERCE_OPTIONS,
  MARKETING_TOOLS_OPTIONS,
  MARKETING_PAIN_OPTIONS,
} from "@/lib/validation";

// ─── Label maps ──────────────────────────────────────────────────────────────

const AI_USER_LABELS: Record<string, string> = {
  "just-me": "Just me",
  "small-team": "My team",
  customers: "Our customers",
};

const AI_PLATFORM_LABELS: Record<string, string> = {
  telegram: "Telegram",
  whatsapp: "WhatsApp",
  discord: "Discord",
  slack: "Slack",
  "website-chat": "Website chat",
  "not-sure": "Not sure",
};

const AI_HELP_LABELS: Record<string, string> = {
  "customer-support": "Customer support",
  sales: "Sales",
  "internal-productivity": "Internal productivity",
  research: "Research",
  all: "All of the above",
};

const WEBSITE_EXISTING_LABELS: Record<string, string> = {
  "yes-redesign": "Yes, needs a redesign",
  "yes-fresh": "Yes, but starting fresh",
  no: "No, building from scratch",
};

const WEBSITE_PAGES_LABELS: Record<string, string> = {
  "1-5": "1 to 5 pages",
  "5-10": "5 to 10 pages",
  "10-20": "10 to 20 pages",
  "20+": "20+ pages",
};

const ECOMMERCE_LABELS: Record<string, string> = {
  yes: "Yes",
  no: "No",
  maybe: "Maybe later",
};

const MARKETING_TOOLS_LABELS: Record<string, string> = {
  mailchimp: "Mailchimp",
  hubspot: "HubSpot",
  activecampaign: "ActiveCampaign",
  gohighlevel: "GoHighLevel",
  spreadsheets: "Spreadsheets",
  nothing: "Nothing yet",
  other: "Other",
};

const MARKETING_PAIN_LABELS: Record<string, string> = {
  "lead-capture": "Lead capture",
  "follow-up": "Follow-up",
  "email-sequences": "Email sequences",
  "review-management": "Review management",
  all: "All of the above",
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function OptionButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        py-2.5 px-4 rounded-lg border text-sm font-medium transition-all duration-200 text-left
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/60
        ${
          selected
            ? "border-cyan bg-cyan/10 text-cyan"
            : "border-wire bg-graphite text-slate hover:border-cyan/30 hover:text-cloud"
        }
      `}
    >
      {children}
    </button>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-medium text-cloud mb-2">{children}</p>;
}

// ─── Section components ──────────────────────────────────────────────────────

function AIQuestions() {
  const { watch, setValue } = useFormContext<ProposalFormData>();
  const aiUserCount = watch("aiUserCount");
  const aiPlatform = watch("aiPlatform");
  const aiHelp = watch("aiHelp");

  return (
    <div className="flex flex-col gap-5">
      <div>
        <FieldLabel>How many people will use the AI?</FieldLabel>
        <div className="grid grid-cols-3 gap-2">
          {AI_USER_COUNT_OPTIONS.map((opt) => (
            <OptionButton
              key={opt}
              selected={aiUserCount === opt}
              onClick={() => setValue("aiUserCount", opt)}
            >
              {AI_USER_LABELS[opt]}
            </OptionButton>
          ))}
        </div>
      </div>
      <div>
        <FieldLabel>What messaging platform does your team use?</FieldLabel>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {AI_PLATFORM_OPTIONS.map((opt) => (
            <OptionButton
              key={opt}
              selected={aiPlatform === opt}
              onClick={() => setValue("aiPlatform", opt)}
            >
              {AI_PLATFORM_LABELS[opt]}
            </OptionButton>
          ))}
        </div>
      </div>
      <div>
        <FieldLabel>What should the AI help with?</FieldLabel>
        <div className="grid grid-cols-2 gap-2">
          {AI_HELP_OPTIONS.map((opt) => (
            <OptionButton
              key={opt}
              selected={aiHelp === opt}
              onClick={() => setValue("aiHelp", opt)}
            >
              {AI_HELP_LABELS[opt]}
            </OptionButton>
          ))}
        </div>
      </div>
    </div>
  );
}

function WebsiteQuestions() {
  const { watch, setValue } = useFormContext<ProposalFormData>();
  const websiteExisting = watch("websiteExisting");
  const websitePages = watch("websitePages");
  const websiteEcommerce = watch("websiteEcommerce");

  return (
    <div className="flex flex-col gap-5">
      <div>
        <FieldLabel>Do you have an existing website?</FieldLabel>
        <div className="flex flex-col gap-2">
          {WEBSITE_EXISTING_OPTIONS.map((opt) => (
            <OptionButton
              key={opt}
              selected={websiteExisting === opt}
              onClick={() => setValue("websiteExisting", opt)}
            >
              {WEBSITE_EXISTING_LABELS[opt]}
            </OptionButton>
          ))}
        </div>
      </div>
      <div>
        <FieldLabel>How many pages do you need?</FieldLabel>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {WEBSITE_PAGES_OPTIONS.map((opt) => (
            <OptionButton
              key={opt}
              selected={websitePages === opt}
              onClick={() => setValue("websitePages", opt)}
            >
              {WEBSITE_PAGES_LABELS[opt]}
            </OptionButton>
          ))}
        </div>
      </div>
      <div>
        <FieldLabel>Do you need e-commerce?</FieldLabel>
        <div className="grid grid-cols-3 gap-2">
          {ECOMMERCE_OPTIONS.map((opt) => (
            <OptionButton
              key={opt}
              selected={websiteEcommerce === opt}
              onClick={() => setValue("websiteEcommerce", opt)}
            >
              {ECOMMERCE_LABELS[opt]}
            </OptionButton>
          ))}
        </div>
      </div>
    </div>
  );
}

function MarketingQuestions() {
  const { watch, setValue } = useFormContext<ProposalFormData>();
  const marketingTools = watch("marketingTools") ?? [];
  const marketingPain = watch("marketingPain");

  function toggleTool(tool: (typeof MARKETING_TOOLS_OPTIONS)[number]) {
    if (marketingTools.includes(tool)) {
      setValue(
        "marketingTools",
        marketingTools.filter((t) => t !== tool)
      );
    } else {
      setValue("marketingTools", [...marketingTools, tool]);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <FieldLabel>What tools are you currently using?</FieldLabel>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {MARKETING_TOOLS_OPTIONS.map((opt) => (
            <OptionButton
              key={opt}
              selected={marketingTools.includes(opt)}
              onClick={() => toggleTool(opt)}
            >
              {MARKETING_TOOLS_LABELS[opt]}
            </OptionButton>
          ))}
        </div>
      </div>
      <div>
        <FieldLabel>What is your biggest marketing pain?</FieldLabel>
        <div className="grid grid-cols-2 gap-2">
          {MARKETING_PAIN_OPTIONS.map((opt) => (
            <OptionButton
              key={opt}
              selected={marketingPain === opt}
              onClick={() => setValue("marketingPain", opt)}
            >
              {MARKETING_PAIN_LABELS[opt]}
            </OptionButton>
          ))}
        </div>
      </div>
    </div>
  );
}

function AutomationQuestions() {
  const { register } = useFormContext<ProposalFormData>();
  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="block text-sm font-medium text-cloud mb-1.5" htmlFor="automationProcesses">
          What processes take the most time?
        </label>
        <textarea
          id="automationProcesses"
          rows={3}
          placeholder="e.g. Following up with leads, scheduling appointments, entering data..."
          className="w-full px-4 py-3 rounded-lg bg-graphite border border-wire text-cloud placeholder:text-dim focus:outline-none focus:ring-2 focus:ring-cyan/40 focus:border-cyan/60 transition-colors resize-none"
          {...register("automationProcesses")}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-cloud mb-1.5" htmlFor="automationTools">
          What tools does your team use daily?
        </label>
        <textarea
          id="automationTools"
          rows={2}
          placeholder="e.g. Google Sheets, Slack, QuickBooks, Salesforce..."
          className="w-full px-4 py-3 rounded-lg bg-graphite border border-wire text-cloud placeholder:text-dim focus:outline-none focus:ring-2 focus:ring-cyan/40 focus:border-cyan/60 transition-colors resize-none"
          {...register("automationTools")}
        />
      </div>
    </div>
  );
}

function NotSureQuestions() {
  const { register } = useFormContext<ProposalFormData>();
  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="block text-sm font-medium text-cloud mb-1.5" htmlFor="notSureHeadache">
          What is the biggest headache in your business right now?
        </label>
        <textarea
          id="notSureHeadache"
          rows={3}
          placeholder="No wrong answers. Tell it like it is."
          className="w-full px-4 py-3 rounded-lg bg-graphite border border-wire text-cloud placeholder:text-dim focus:outline-none focus:ring-2 focus:ring-cyan/40 focus:border-cyan/60 transition-colors resize-none"
          {...register("notSureHeadache")}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-cloud mb-1.5" htmlFor="notSureAutomate">
          What would you automate if you could?
        </label>
        <textarea
          id="notSureAutomate"
          rows={3}
          placeholder="Dream a little. What would free up the most time?"
          className="w-full px-4 py-3 rounded-lg bg-graphite border border-wire text-cloud placeholder:text-dim focus:outline-none focus:ring-2 focus:ring-cyan/40 focus:border-cyan/60 transition-colors resize-none"
          {...register("notSureAutomate")}
        />
      </div>
    </div>
  );
}

// ─── Main QuestionFlow ────────────────────────────────────────────────────────

interface QuestionFlowProps {
  services: ServiceOption[];
}

const SECTION_LABELS: Record<ServiceOption, string> = {
  "ai-assistant": "AI Assistant",
  website: "Website",
  marketing: "Marketing Automation",
  automation: "Workflow Automation",
  "voice-agent": "Voice Agent",
  "custom-app": "Custom App",
  "not-sure": "Help me figure it out",
};

const ORDERED_SERVICES: ServiceOption[] = [
  "ai-assistant",
  "website",
  "marketing",
  "automation",
  "voice-agent",
  "custom-app",
  "not-sure",
];

export default function QuestionFlow({ services }: QuestionFlowProps) {
  const activeServices = ORDERED_SERVICES.filter((s) => services.includes(s));

  if (activeServices.length === 0) {
    return (
      <p className="text-slate text-sm">No services selected. Go back to Step 1.</p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {activeServices.map((service) => (
        <div key={service}>
          {activeServices.length > 1 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-wire" />
              <span className="text-xs font-semibold uppercase tracking-widest text-dim px-2">
                {SECTION_LABELS[service]}
              </span>
              <div className="h-px flex-1 bg-wire" />
            </div>
          )}
          {service === "ai-assistant" && <AIQuestions />}
          {service === "website" && <WebsiteQuestions />}
          {service === "marketing" && <MarketingQuestions />}
          {service === "automation" && <AutomationQuestions />}
          {service === "voice-agent" && (
            <p className="text-slate text-sm">
              Voice agents are scoped per project. Tell us more about your needs in the notes field on the next step.
            </p>
          )}
          {service === "custom-app" && (
            <p className="text-slate text-sm">
              Custom apps are scoped per project. We will dig into the details on a call. Tell us more in the notes field.
            </p>
          )}
          {service === "not-sure" && <NotSureQuestions />}
        </div>
      ))}
    </div>
  );
}
