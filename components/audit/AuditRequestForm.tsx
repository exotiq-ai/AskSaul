"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { auditRequestSchema, type AuditRequestData } from "@/lib/validation";
import { BOOKING_URL, BRAND, DEMO_PHONE_DISPLAY } from "@/lib/constants";

const TRADES = ["Roofing", "HVAC", "Other"] as const;
const CITIES = ["Denver metro", "Boulder", "Fort Collins", "Colorado Springs", "Loveland", "Longmont", "Greeley", "Other"];

const initialForm: AuditRequestData = {
  name: "",
  businessName: "",
  email: "",
  phone: "",
  trade: "" as AuditRequestData["trade"],
  city: "",
  website: "",
  afterHoursTestOk: false,
  smsConsent: false,
};

type Errors = Partial<Record<keyof AuditRequestData, string>>;

function Pills<T extends string>({
  label,
  options,
  value,
  onChange,
  error,
}: {
  label: string;
  options: readonly T[];
  value: string;
  onChange: (v: T) => void;
  error?: string;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-slate">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={value === o}
            onClick={() => onChange(o)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              value === o ? "border-cyan bg-cyan text-obsidian" : "border-wire bg-graphite text-slate hover:border-cyan/40"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
      {error && <p className="mt-1.5 text-sm text-error">{error}</p>}
    </fieldset>
  );
}

export default function AuditRequestForm() {
  const [form, setForm] = useState<AuditRequestData>(initialForm);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function update<K extends keyof AuditRequestData>(field: K, value: AuditRequestData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = auditRequestSchema.safeParse(form);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof AuditRequestData;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      setSubmitError(`Something went wrong saving this. Please call Saul at ${DEMO_PHONE_DISPLAY} or email ${BRAND.email}.`);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-[2rem] border border-cyan/30 bg-cyan/10 p-8 text-center sm:p-10">
        <CheckCircle2 className="mx-auto mb-5 h-10 w-10 text-cyan" />
        <h2 className="font-display text-3xl font-bold text-cloud">Your audit is on the way.</h2>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-slate">
          We&apos;ll run the checks and email you the report. Want to talk it through sooner?
        </p>
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex rounded-xl bg-cyan px-6 py-3.5 font-semibold text-obsidian"
        >
          Book a 20-minute call
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-[2rem] border border-wire bg-carbon/80 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-8"
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan">Free audit request</p>
      <h2 className="mb-7 font-display text-2xl font-bold text-cloud sm:text-3xl">Where should we send it?</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input id="audit-name" label="Your name" autoComplete="name" value={form.name} error={errors.name} onChange={(e) => update("name", e.target.value)} />
        <Input
          id="audit-business"
          label="Business name"
          autoComplete="organization"
          value={form.businessName}
          error={errors.businessName}
          onChange={(e) => update("businessName", e.target.value)}
        />
        <Input id="audit-email" type="email" label="Email" autoComplete="email" value={form.email} error={errors.email} onChange={(e) => update("email", e.target.value)} />
        <Input id="audit-phone" type="tel" label="Phone" autoComplete="tel" value={form.phone} error={errors.phone} onChange={(e) => update("phone", e.target.value)} />
      </div>

      <div className="mt-6 space-y-5">
        <Pills label="Your trade" options={TRADES} value={form.trade} onChange={(v) => update("trade", v)} error={errors.trade} />
        <Pills label="Main city" options={CITIES} value={form.city} onChange={(v) => update("city", v)} error={errors.city} />
        <Input
          id="audit-website"
          label="Website (optional)"
          placeholder="yourshop.com"
          autoComplete="url"
          value={form.website}
          onChange={(e) => update("website", e.target.value)}
        />
      </div>

      <div className="mt-6 space-y-3">
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-slate">
          <input
            type="checkbox"
            checked={form.afterHoursTestOk ?? false}
            onChange={(e) => update("afterHoursTestOk", e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded border-wire bg-graphite text-cyan"
          />
          OK to place one after-hours test call to my business line, so the report shows what a homeowner hears.
        </label>
        <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-slate">
          <input
            type="checkbox"
            checked={form.smsConsent ?? false}
            onChange={(e) => update("smsConsent", e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded border-wire bg-graphite text-cyan"
          />
          I consent to receive non-marketing text messages from AskSaul about this audit request, including follow-up questions and scheduling. Message frequency varies. Message and data rates may apply. Text HELP for help, reply STOP to opt out.
        </label>
        <p className="ml-7 text-xs text-dim">
          SMS consent is optional. View our{" "}
          <a href="/privacy" className="underline hover:text-slate">Privacy Policy</a> and{" "}
          <a href="/terms" className="underline hover:text-slate">Terms of Service</a>.
        </p>
      </div>

      {submitError && <div className="mt-5 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">{submitError}</div>}

      <Button type="submit" variant="primary" size="lg" disabled={submitting} className="mt-7 w-full">
        {submitting ? "Sending..." : "Get my free audit"}
      </Button>
      <p className="mt-3 text-center text-xs text-dim">You keep it either way. No pitch attached.</p>
    </form>
  );
}
