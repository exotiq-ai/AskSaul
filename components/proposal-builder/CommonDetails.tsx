"use client";

import { useFormContext } from "react-hook-form";
import {
  CURRENT_TOOLS_OPTIONS,
  COMPLIANCE_OPTIONS,
  type ProposalFormData,
} from "@/lib/validation";
import VerticalQuestions from "./VerticalQuestions";

const CURRENT_TOOLS_LABELS: Record<string, string> = {
  apollo: "Apollo",
  hubspot: "HubSpot",
  salesforce: "Salesforce",
  instantly: "Instantly",
  mailchimp: "Mailchimp",
  "linkedin-automation": "LinkedIn automation",
  calendly: "Calendly",
  gohighlevel: "GoHighLevel",
  podium: "Podium",
  connectwise: "ConnectWise",
  autotask: "Autotask",
  none: "None",
  other: "Other",
};

const COMPLIANCE_LABELS: Record<string, string> = {
  hipaa: "HIPAA",
  soc2: "SOC 2",
  pci: "PCI",
  gdpr: "GDPR",
  ccpa: "CCPA",
  none: "None",
  other: "Other",
};

function Toggle({
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
      aria-pressed={selected}
      onClick={onClick}
      className={`
        py-2.5 px-3 rounded-lg border text-sm font-medium transition-all duration-200
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

export default function CommonDetails() {
  const { watch, setValue } = useFormContext<ProposalFormData>();
  const currentTools = watch("currentTools") ?? [];
  const compliance = watch("complianceNeeds") ?? [];

  function toggleTool(t: (typeof CURRENT_TOOLS_OPTIONS)[number]) {
    if (currentTools.includes(t)) {
      setValue(
        "currentTools",
        currentTools.filter((v) => v !== t),
      );
    } else {
      setValue("currentTools", [...currentTools, t]);
    }
  }

  function toggleCompliance(c: (typeof COMPLIANCE_OPTIONS)[number]) {
    if (compliance.includes(c)) {
      setValue(
        "complianceNeeds",
        compliance.filter((v) => v !== c),
      );
    } else {
      setValue("complianceNeeds", [...compliance, c]);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-medium text-cloud mb-2">
          What tools are you currently using for sales and marketing?{" "}
          <span className="text-dim font-normal">(select any that apply)</span>
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CURRENT_TOOLS_OPTIONS.map((opt) => (
            <Toggle
              key={opt}
              selected={currentTools.includes(opt)}
              onClick={() => toggleTool(opt)}
            >
              {CURRENT_TOOLS_LABELS[opt]}
            </Toggle>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-cloud mb-2">
          Compliance requirements <span className="text-dim font-normal">(optional)</span>
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {COMPLIANCE_OPTIONS.map((opt) => (
            <Toggle
              key={opt}
              selected={compliance.includes(opt)}
              onClick={() => toggleCompliance(opt)}
            >
              {COMPLIANCE_LABELS[opt]}
            </Toggle>
          ))}
        </div>
      </div>

      <VerticalQuestions />
    </div>
  );
}
