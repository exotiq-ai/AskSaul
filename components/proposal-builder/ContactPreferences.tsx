"use client";

import { useFormContext } from "react-hook-form";
import type { ProposalFormData } from "@/lib/validation";
import {
  PREFERRED_CONTACT_OPTIONS,
  TIMELINE_OPTIONS,
  BUDGET_OPTIONS,
} from "@/lib/validation";

const CONTACT_LABELS: Record<string, string> = {
  email: "Email",
  phone: "Phone call",
  text: "Text message",
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

export default function ContactPreferences() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ProposalFormData>();

  const preferredContact = watch("preferredContact");
  const timeline = watch("timeline");
  const budget = watch("budget");

  return (
    <div className="flex flex-col gap-5">
      {/* Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-cloud mb-1.5" htmlFor="name">
            Your name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Jane Smith"
            className={`w-full px-4 py-3 rounded-lg bg-graphite border text-cloud placeholder:text-dim focus:outline-none focus:ring-2 focus:ring-cyan/40 focus:border-cyan/60 transition-colors ${errors.name ? "border-error" : "border-wire"}`}
            {...register("name")}
          />
          {errors.name && <p className="mt-1 text-xs text-error">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-cloud mb-1.5" htmlFor="phone">
            Phone <span className="text-error">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="(555) 867-5309"
            className={`w-full px-4 py-3 rounded-lg bg-graphite border text-cloud placeholder:text-dim focus:outline-none focus:ring-2 focus:ring-cyan/40 focus:border-cyan/60 transition-colors ${errors.phone ? "border-error" : "border-wire"}`}
            {...register("phone")}
          />
          {errors.phone && <p className="mt-1 text-xs text-error">{errors.phone.message}</p>}
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-cloud mb-1.5" htmlFor="email">
          Email address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="jane@yourbusiness.com"
          className={`w-full px-4 py-3 rounded-lg bg-graphite border text-cloud placeholder:text-dim focus:outline-none focus:ring-2 focus:ring-cyan/40 focus:border-cyan/60 transition-colors ${errors.email ? "border-error" : "border-wire"}`}
          {...register("email")}
        />
        {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}
      </div>

      {/* Preferred contact */}
      <div>
        <p className="text-sm font-medium text-cloud mb-2">Preferred way to reach you</p>
        <div className="grid grid-cols-3 gap-2">
          {PREFERRED_CONTACT_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setValue("preferredContact", opt, { shouldValidate: true })}
              className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/60 ${preferredContact === opt ? "border-cyan bg-cyan/10 text-cyan" : "border-wire bg-graphite text-slate hover:border-cyan/30 hover:text-cloud"}`}
            >
              {CONTACT_LABELS[opt]}
            </button>
          ))}
        </div>
        {errors.preferredContact && (
          <p className="mt-1 text-xs text-error">{errors.preferredContact.message}</p>
        )}
      </div>

      {/* Timeline */}
      <div>
        <p className="text-sm font-medium text-cloud mb-2">When do you need this?</p>
        <div className="grid grid-cols-2 gap-2">
          {TIMELINE_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setValue("timeline", opt, { shouldValidate: true })}
              className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/60 ${timeline === opt ? "border-cyan bg-cyan/10 text-cyan" : "border-wire bg-graphite text-slate hover:border-cyan/30 hover:text-cloud"}`}
            >
              {TIMELINE_LABELS[opt]}
            </button>
          ))}
        </div>
        {errors.timeline && (
          <p className="mt-1 text-xs text-error">{errors.timeline.message}</p>
        )}
      </div>

      {/* Budget - optional */}
      <div>
        <p className="text-sm font-medium text-cloud mb-1">
          Budget range{" "}
          <span className="text-dim font-normal">(optional)</span>
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {BUDGET_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() =>
                setValue("budget", budget === opt ? undefined : opt, { shouldValidate: true })
              }
              className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/60 ${budget === opt ? "border-cyan bg-cyan/10 text-cyan" : "border-wire bg-graphite text-slate hover:border-cyan/30 hover:text-cloud"}`}
            >
              {BUDGET_LABELS[opt]}
            </button>
          ))}
        </div>
      </div>

      {/* SMS Consent */}
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex items-start gap-3">
          <input
            id="smsConsent"
            type="checkbox"
            className="mt-0.5 w-4 h-4 rounded border-wire bg-graphite text-cyan focus:ring-cyan/40 shrink-0 cursor-pointer"
            {...register("smsConsent")}
          />
          <label htmlFor="smsConsent" className="text-xs text-slate leading-relaxed cursor-pointer">
            <span className="text-error mr-1">*</span>
            By providing your phone number, you consent to receive transactional SMS messages from AskSaul related to your inquiry. Message frequency varies. Message and data rates may apply. Reply STOP to opt out. Reply HELP for help.
          </label>
        </div>
        {errors.smsConsent && (
          <p className="text-xs text-error ml-7">{errors.smsConsent.message}</p>
        )}

        <div className="flex items-start gap-3">
          <input
            id="marketingSmsOptIn"
            type="checkbox"
            className="mt-0.5 w-4 h-4 rounded border-wire bg-graphite text-cyan focus:ring-cyan/40 shrink-0 cursor-pointer"
            {...register("marketingSmsOptIn")}
          />
          <label htmlFor="marketingSmsOptIn" className="text-xs text-slate leading-relaxed cursor-pointer">
            I also want to receive occasional tips, updates, and offers from AskSaul via SMS. You can opt out anytime by replying STOP.
          </label>
        </div>

        <p className="text-xs text-dim ml-7">
          View our{" "}
          <a href="/privacy" className="underline hover:text-slate transition-colors">Privacy Policy</a>
          {" "}and{" "}
          <a href="/terms" className="underline hover:text-slate transition-colors">Terms of Service</a>
        </p>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-cloud mb-1.5" htmlFor="notes">
          Anything else Saul should know?{" "}
          <span className="text-dim font-normal">(optional)</span>
        </label>
        <textarea
          id="notes"
          rows={3}
          placeholder="Context, constraints, a deadline, a specific outcome you need. Whatever is relevant."
          className="w-full px-4 py-3 rounded-lg bg-graphite border border-wire text-cloud placeholder:text-dim focus:outline-none focus:ring-2 focus:ring-cyan/40 focus:border-cyan/60 transition-colors resize-none"
          {...register("notes")}
        />
      </div>
    </div>
  );
}
