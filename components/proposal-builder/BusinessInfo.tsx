"use client";

import { useFormContext } from "react-hook-form";
import { INDUSTRY_OPTIONS, TEAM_SIZE_OPTIONS, REVENUE_RANGE_OPTIONS } from "@/lib/validation";
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

export default function BusinessInfo() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<ProposalFormData>();

  const teamSize = watch("teamSize");
  const revenueRange = watch("revenueRange");

  return (
    <div className="flex flex-col gap-5">
      {/* Business name */}
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

      {/* Team size */}
      <div>
        <p className="text-sm font-medium text-cloud mb-2">Team size</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TEAM_SIZE_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setValue("teamSize", opt, { shouldValidate: true })}
              className={`
                py-2.5 px-3 rounded-lg border text-sm font-medium transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/60
                ${
                  teamSize === opt
                    ? "border-cyan bg-cyan/10 text-cyan"
                    : "border-wire bg-graphite text-slate hover:border-cyan/30 hover:text-cloud"
                }
              `}
            >
              {TEAM_LABELS[opt]}
            </button>
          ))}
        </div>
        {errors.teamSize && (
          <p className="mt-1 text-xs text-error">{errors.teamSize.message}</p>
        )}
      </div>

      {/* Revenue range - optional */}
      <div>
        <p className="text-sm font-medium text-cloud mb-1">
          Monthly revenue range{" "}
          <span className="text-dim font-normal">(optional, helps with scoping)</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          {REVENUE_RANGE_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() =>
                setValue("revenueRange", revenueRange === opt ? undefined : opt, {
                  shouldValidate: true,
                })
              }
              className={`
                py-2.5 px-3 rounded-lg border text-sm font-medium transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/60
                ${
                  revenueRange === opt
                    ? "border-cyan bg-cyan/10 text-cyan"
                    : "border-wire bg-graphite text-slate hover:border-cyan/30 hover:text-cloud"
                }
              `}
            >
              {REVENUE_LABELS[opt]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
