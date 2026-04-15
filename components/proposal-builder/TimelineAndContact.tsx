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

export default function TimelineAndContact() {
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
      {/* Timeline */}
      <div>
        <p className="text-sm font-medium text-cloud mb-2">When do you need this?</p>
        <div className="grid grid-cols-2 gap-2">
          {TIMELINE_OPTIONS.map((opt) => (
            <Toggle
              key={opt}
              selected={timeline === opt}
              onClick={() => setValue("timeline", opt, { shouldValidate: true })}
            >
              {TIMELINE_LABELS[opt]}
            </Toggle>
          ))}
        </div>
        {errors.timeline && (
          <p className="mt-1 text-xs text-error">{errors.timeline.message}</p>
        )}
      </div>

      {/* Hard deadline */}
      <div>
        <label className="block text-sm font-medium text-cloud mb-1.5" htmlFor="hardDeadline">
          Hard deadline <span className="text-dim font-normal">(optional — a specific date this needs to be live)</span>
        </label>
        <input
          id="hardDeadline"
          type="date"
          className={`
            w-full px-4 py-3 rounded-lg bg-graphite border text-cloud placeholder:text-dim
            focus:outline-none focus:ring-2 focus:ring-cyan/40 focus:border-cyan/60 transition-colors
            ${errors.hardDeadline ? "border-error" : "border-wire"}
          `}
          {...register("hardDeadline")}
        />
        {errors.hardDeadline && (
          <p className="mt-1 text-xs text-error">{errors.hardDeadline.message as string}</p>
        )}
      </div>

      {/* Budget */}
      <div>
        <p className="text-sm font-medium text-cloud mb-1">
          Budget range <span className="text-dim font-normal">(optional)</span>
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {BUDGET_OPTIONS.map((opt) => (
            <Toggle
              key={opt}
              selected={budget === opt}
              onClick={() =>
                setValue("budget", budget === opt ? undefined : opt, {
                  shouldValidate: true,
                })
              }
            >
              {BUDGET_LABELS[opt]}
            </Toggle>
          ))}
        </div>
      </div>

      {/* Success metrics */}
      <div>
        <label className="block text-sm font-medium text-cloud mb-1.5" htmlFor="successMetrics">
          How will you know this worked?{" "}
          <span className="text-dim font-normal">(2-3 sentences, helps Saul scope to outcomes)</span>
        </label>
        <textarea
          id="successMetrics"
          rows={3}
          placeholder="e.g. Cut our response time from 8 hours to under 15 minutes. Triple booked demos to 40+/mo. Hit $30K MRR by Q3."
          className="w-full px-4 py-3 rounded-lg bg-graphite border border-wire text-cloud placeholder:text-dim focus:outline-none focus:ring-2 focus:ring-cyan/40 focus:border-cyan/60 transition-colors resize-none"
          {...register("successMetrics")}
        />
      </div>

      {/* Contact info */}
      <div className="pt-4 border-t border-wire/50">
        <p className="text-xs font-semibold uppercase tracking-widest text-dim mb-3">
          How we reach you
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-cloud mb-1.5" htmlFor="firstName">
              First name
            </label>
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="Jane"
              className={`
                w-full px-4 py-3 rounded-lg bg-graphite border text-cloud placeholder:text-dim
                focus:outline-none focus:ring-2 focus:ring-cyan/40 focus:border-cyan/60 transition-colors
                ${errors.firstName ? "border-error" : "border-wire"}
              `}
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="mt-1 text-xs text-error">{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-cloud mb-1.5" htmlFor="lastName">
              Last name <span className="text-dim font-normal">(optional)</span>
            </label>
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Smith"
              className={`
                w-full px-4 py-3 rounded-lg bg-graphite border text-cloud placeholder:text-dim
                focus:outline-none focus:ring-2 focus:ring-cyan/40 focus:border-cyan/60 transition-colors
                ${errors.lastName ? "border-error" : "border-wire"}
              `}
              {...register("lastName")}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-cloud mb-1.5" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="jane@yourbusiness.com"
              className={`
                w-full px-4 py-3 rounded-lg bg-graphite border text-cloud placeholder:text-dim
                focus:outline-none focus:ring-2 focus:ring-cyan/40 focus:border-cyan/60 transition-colors
                ${errors.email ? "border-error" : "border-wire"}
              `}
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-error">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-cloud mb-1.5" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="(555) 867-5309"
              className={`
                w-full px-4 py-3 rounded-lg bg-graphite border text-cloud placeholder:text-dim
                focus:outline-none focus:ring-2 focus:ring-cyan/40 focus:border-cyan/60 transition-colors
                ${errors.phone ? "border-error" : "border-wire"}
              `}
              {...register("phone")}
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-error">{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium text-cloud mb-2">Preferred way to reach you</p>
          <div className="grid grid-cols-3 gap-2">
            {PREFERRED_CONTACT_OPTIONS.map((opt) => (
              <Toggle
                key={opt}
                selected={preferredContact === opt}
                onClick={() =>
                  setValue("preferredContact", opt, { shouldValidate: true })
                }
              >
                {CONTACT_LABELS[opt]}
              </Toggle>
            ))}
          </div>
          {errors.preferredContact && (
            <p className="mt-1 text-xs text-error">{errors.preferredContact.message}</p>
          )}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-cloud mb-1.5" htmlFor="notes">
          Anything else Saul should know? <span className="text-dim font-normal">(optional)</span>
        </label>
        <textarea
          id="notes"
          rows={3}
          placeholder="Context, constraints, deadlines, a specific outcome. Whatever is relevant."
          className="w-full px-4 py-3 rounded-lg bg-graphite border border-wire text-cloud placeholder:text-dim focus:outline-none focus:ring-2 focus:ring-cyan/40 focus:border-cyan/60 transition-colors resize-none"
          {...register("notes")}
        />
      </div>

      {/* SMS consent — OPT IN, not a gate */}
      <div className="flex flex-col gap-3 pt-4 border-t border-wire/50">
        <div className="flex items-start gap-3">
          <input
            id="smsConsent"
            type="checkbox"
            className="mt-0.5 w-4 h-4 rounded border-wire bg-graphite text-cyan focus:ring-cyan/40 shrink-0 cursor-pointer"
            {...register("smsConsent")}
          />
          <label htmlFor="smsConsent" className="text-xs text-slate leading-relaxed cursor-pointer">
            I consent to receive transactional SMS messages from AskSaul about this inquiry. Message frequency varies, message and data rates may apply, reply STOP to opt out. <span className="text-dim">(Optional — we'll default to email if unchecked.)</span>
          </label>
        </div>

        <div className="flex items-start gap-3">
          <input
            id="marketingSmsOptIn"
            type="checkbox"
            className="mt-0.5 w-4 h-4 rounded border-wire bg-graphite text-cyan focus:ring-cyan/40 shrink-0 cursor-pointer"
            {...register("marketingSmsOptIn")}
          />
          <label htmlFor="marketingSmsOptIn" className="text-xs text-slate leading-relaxed cursor-pointer">
            I'd also like occasional tips, updates, and offers from AskSaul via SMS. Opt out anytime by replying STOP.
          </label>
        </div>

        <p className="text-xs text-dim ml-7">
          View our{" "}
          <a href="/privacy" className="underline hover:text-slate transition-colors">Privacy Policy</a>
          {" "}and{" "}
          <a href="/terms" className="underline hover:text-slate transition-colors">Terms of Service</a>
        </p>
      </div>
    </div>
  );
}
