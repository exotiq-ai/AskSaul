"use client";

import { useFormContext } from "react-hook-form";
import {
  INDUSTRY_OPTIONS,
  TEAM_SIZE_OPTIONS,
  REVENUE_RANGE_OPTIONS,
  MONTHLY_SPEND_OPTIONS,
  ROLE_IN_COMPANY_OPTIONS,
  DECISION_MAKER_OPTIONS,
} from "@/lib/validation";
import type { ProposalFormData } from "@/lib/validation";

const TEAM_LABELS: Record<string, string> = {
  "1": "Just me",
  "2-5": "2 to 5 people",
  "6-20": "6 to 20 people",
  "20+": "20+ people",
};

const REVENUE_LABELS: Record<string, string> = {
  "under-10k": "Under $10K / mo",
  "10k-50k": "$10K to $50K / mo",
  "50k-250k": "$50K to $250K / mo",
  "250k-plus": "$250K+ / mo",
};

const SPEND_LABELS: Record<string, string> = {
  "under-1k": "Under $1K",
  "1k-2.5k": "$1K to $2.5K",
  "2.5k-5k": "$2.5K to $5K",
  "5k-10k": "$5K to $10K",
  "10k-25k": "$10K to $25K",
  "25k-plus": "$25K+",
  "not-sure": "Not sure",
};

const ROLE_LABELS: Record<string, string> = {
  founder: "Founder",
  ceo: "CEO",
  "marketing-lead": "Marketing lead",
  ops: "Operations",
  "sales-lead": "Sales lead",
  "engineering-lead": "Engineering lead",
  assistant: "Assistant",
  other: "Other",
};

const DECISION_LABELS: Record<string, string> = {
  yes: "Yes, I'm the one",
  shared: "Shared decision",
  no: "I'm researching",
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

export default function BusinessInfo() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<ProposalFormData>();

  const teamSize = watch("teamSize");
  const revenueRange = watch("revenueRange");
  const monthlySpend = watch("monthlySpend");
  const roleInCompany = watch("roleInCompany");
  const decisionMaker = watch("decisionMaker");

  return (
    <div className="flex flex-col gap-5">
      {/* Industry */}
      <div>
        <label className="block text-sm font-medium text-cloud mb-1.5" htmlFor="industry">
          Industry
        </label>
        <select
          id="industry"
          className={`
            w-full px-4 py-3 rounded-lg bg-graphite border text-cloud
            focus:outline-none focus:ring-2 focus:ring-cyan/40 focus:border-cyan/60 transition-colors
            ${errors.industry ? "border-error" : "border-wire"}
          `}
          {...register("industry")}
        >
          <option value="">Select your industry</option>
          {INDUSTRY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {errors.industry && (
          <p className="mt-1 text-xs text-error">{errors.industry.message}</p>
        )}
      </div>

      {/* Business name + website */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-cloud mb-1.5" htmlFor="businessName">
            Business name
          </label>
          <input
            id="businessName"
            type="text"
            autoComplete="organization"
            placeholder="Acme Corp"
            className={`
              w-full px-4 py-3 rounded-lg bg-graphite border text-cloud placeholder:text-dim
              focus:outline-none focus:ring-2 focus:ring-cyan/40 focus:border-cyan/60 transition-colors
              ${errors.businessName ? "border-error" : "border-wire"}
            `}
            {...register("businessName")}
          />
          {errors.businessName && (
            <p className="mt-1 text-xs text-error">{errors.businessName.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-cloud mb-1.5" htmlFor="businessWebsite">
            Website <span className="text-dim font-normal">(optional)</span>
          </label>
          <input
            id="businessWebsite"
            type="text"
            inputMode="url"
            autoComplete="url"
            placeholder="acme.com"
            className={`
              w-full px-4 py-3 rounded-lg bg-graphite border text-cloud placeholder:text-dim
              focus:outline-none focus:ring-2 focus:ring-cyan/40 focus:border-cyan/60 transition-colors
              ${errors.businessWebsite ? "border-error" : "border-wire"}
            `}
            {...register("businessWebsite")}
          />
          {errors.businessWebsite && (
            <p className="mt-1 text-xs text-error">
              {errors.businessWebsite.message as string}
            </p>
          )}
        </div>
      </div>

      {/* Team size */}
      <div>
        <p className="text-sm font-medium text-cloud mb-2">Team size</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TEAM_SIZE_OPTIONS.map((opt) => (
            <Toggle
              key={opt}
              selected={teamSize === opt}
              onClick={() => setValue("teamSize", opt, { shouldValidate: true })}
            >
              {TEAM_LABELS[opt]}
            </Toggle>
          ))}
        </div>
        {errors.teamSize && (
          <p className="mt-1 text-xs text-error">{errors.teamSize.message}</p>
        )}
      </div>

      {/* Role + Decision maker */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <p className="text-sm font-medium text-cloud mb-2">
            Your role <span className="text-dim font-normal">(optional)</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            {ROLE_IN_COMPANY_OPTIONS.map((opt) => (
              <Toggle
                key={opt}
                selected={roleInCompany === opt}
                onClick={() =>
                  setValue(
                    "roleInCompany",
                    roleInCompany === opt ? undefined : opt,
                    { shouldValidate: true },
                  )
                }
              >
                {ROLE_LABELS[opt]}
              </Toggle>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-cloud mb-2">
            Decision maker? <span className="text-dim font-normal">(optional)</span>
          </p>
          <div className="grid grid-cols-1 gap-2">
            {DECISION_MAKER_OPTIONS.map((opt) => (
              <Toggle
                key={opt}
                selected={decisionMaker === opt}
                onClick={() =>
                  setValue(
                    "decisionMaker",
                    decisionMaker === opt ? undefined : opt,
                    { shouldValidate: true },
                  )
                }
              >
                {DECISION_LABELS[opt]}
              </Toggle>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue range */}
      <div>
        <p className="text-sm font-medium text-cloud mb-2">
          Monthly revenue range <span className="text-dim font-normal">(optional)</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          {REVENUE_RANGE_OPTIONS.map((opt) => (
            <Toggle
              key={opt}
              selected={revenueRange === opt}
              onClick={() =>
                setValue(
                  "revenueRange",
                  revenueRange === opt ? undefined : opt,
                  { shouldValidate: true },
                )
              }
            >
              {REVENUE_LABELS[opt]}
            </Toggle>
          ))}
        </div>
      </div>

      {/* Monthly spend */}
      <div>
        <p className="text-sm font-medium text-cloud mb-2">
          Monthly spend on sales and marketing tools{" "}
          <span className="text-dim font-normal">(optional, helps size the opportunity)</span>
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {MONTHLY_SPEND_OPTIONS.map((opt) => (
            <Toggle
              key={opt}
              selected={monthlySpend === opt}
              onClick={() =>
                setValue(
                  "monthlySpend",
                  monthlySpend === opt ? undefined : opt,
                  { shouldValidate: true },
                )
              }
            >
              {SPEND_LABELS[opt]}
            </Toggle>
          ))}
        </div>
      </div>
    </div>
  );
}
