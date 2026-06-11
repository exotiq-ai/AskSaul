"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import type { VoiceAgentLeadData } from "@/lib/validation";

const initialForm: VoiceAgentLeadData = {
  name: "",
  businessName: "",
  phone: "",
  email: "",
  serviceType: "",
  serviceArea: "",
  currentCallHandling: "",
  desiredAgentTasks: "",
  missedCallPain: "",
  preferredCallbackWindow: "",
  smsConsent: false,
  marketingSmsOptIn: false,
};

type FieldErrors = Partial<Record<keyof VoiceAgentLeadData, string>>;

const BOOKING_URL =
  "https://api.leadconnectorhq.com/widget/bookings/bookwithusdigitalmarketing-3d837e4b-c899-44ff-b612-275f498c2128";

function hasRequiredFields(form: VoiceAgentLeadData) {
  const errors: FieldErrors = {};
  const required: (keyof VoiceAgentLeadData)[] = [
    "name",
    "businessName",
    "phone",
    "email",
    "serviceType",
    "serviceArea",
    "currentCallHandling",
    "desiredAgentTasks",
    "missedCallPain",
    "preferredCallbackWindow",
  ];

  for (const field of required) {
    const value = form[field];
    if (typeof value === "string" && !value.trim()) {
      errors[field] = "Required";
    }
  }

  if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
    errors.email = "Enter a valid email";
  }

  return errors;
}

interface TextAreaProps {
  id: keyof VoiceAgentLeadData;
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

function TextArea({ id, label, placeholder, value, error, onChange }: TextAreaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate">
        {label}
      </label>
      <textarea
        id={id}
        rows={3}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-graphite border rounded-lg px-4 py-3 text-cloud placeholder:text-dim focus:outline-none focus:border-cyan/60 focus:ring-1 focus:ring-cyan/30 transition-colors duration-200 resize-none ${
          error ? "border-error/60 focus:border-error/80 focus:ring-error/20" : "border-wire"
        }`}
      />
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
}

interface VoiceAgentLeadFormProps {
  vertical?: "general" | "waste";
}

export default function VoiceAgentLeadForm({ vertical = "general" }: VoiceAgentLeadFormProps) {
  const [form, setForm] = useState<VoiceAgentLeadData>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const isWaste = vertical === "waste";

  function update<K extends keyof VoiceAgentLeadData>(field: K, value: VoiceAgentLeadData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextErrors = hasRequiredFields(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/voice-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error((json as { error?: string }).error || "Submission failed");
      }

      setSubmitted(true);
      setForm(initialForm);
    } catch {
      setSubmitError(
        "Something went wrong saving this. Please call Saul at (970) 401-7285 or email saul3000bot@gmail.com."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-cyan/30 bg-cyan/10 p-8 text-center">
        <p className="text-xs font-semibold tracking-widest uppercase text-cyan mb-3">
          Request received
        </p>
        <h3 className="text-2xl font-bold text-cloud mb-3" style={{ fontFamily: "var(--font-display)" }}>
          Gregory has the context.
        </h3>
        <p className="text-slate leading-relaxed mb-6">
          We saved your voice-agent setup request in GHL. If you want to hear the live demo while you wait, call Saul at (970) 401-7285, or grab a 15-minute intro with Gregory now.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
            <Button type="button" variant="primary">
              Book 15 Min with Gregory
            </Button>
          </a>
          <Button type="button" variant="secondary" onClick={() => setSubmitted(false)}>
            Submit another request
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-wire bg-carbon/80 p-5 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)]" noValidate>
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase text-cyan/80 mb-3">
          Get your call flow mapped
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-cloud mb-3" style={{ fontFamily: "var(--font-display)" }}>
          {isWaste ? "Tell us where waste calls get missed or messy." : "Tell us where the phone process breaks."}
        </h2>
        <p className="text-slate leading-relaxed">
          {isWaste
            ? "This goes to the AskSaul lead workflow so Gregory can see your markets, current call handling, dumpster quote flow, and what Saul should collect first."
            : "This goes to the AskSaul lead workflow so Gregory can see your service area, current call handling, and what Saul should cover first."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Input label="Your name" placeholder="Jane Smith" autoComplete="name" value={form.name} error={errors.name} onChange={(e) => update("name", e.target.value)} />
        <Input label="Business name" placeholder={isWaste ? "Smith Roll-Off Rentals" : "Smith Heating & Air"} autoComplete="organization" value={form.businessName} error={errors.businessName} onChange={(e) => update("businessName", e.target.value)} />
        <Input label="Phone" type="tel" placeholder="(555) 867-5309" autoComplete="tel" value={form.phone} error={errors.phone} onChange={(e) => update("phone", e.target.value)} />
        <Input label="Email" type="email" placeholder="you@business.com" autoComplete="email" value={form.email} error={errors.email} onChange={(e) => update("email", e.target.value)} />
        <Input label="Service type" placeholder={isWaste ? "Dumpster rental, junk removal, hauling..." : "HVAC, plumbing, roofing..."} value={form.serviceType} error={errors.serviceType} onChange={(e) => update("serviceType", e.target.value)} />
        <Input label="Service area" placeholder={isWaste ? "Pueblo, Fayetteville, Lake Charles..." : "Denver, Boulder, Pueblo..."} value={form.serviceArea} error={errors.serviceArea} onChange={(e) => update("serviceArea", e.target.value)} />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <TextArea
          id="currentCallHandling"
          label="How are calls handled right now?"
          placeholder={isWaste ? "Owner cell, office line, voicemail, CallRail, GHL, answering service..." : "Owner cell, front desk, voicemail, GHL, answering service..."}
          value={form.currentCallHandling}
          error={errors.currentCallHandling}
          onChange={(value) => update("currentCallHandling", value)}
        />
        <TextArea
          id="desiredAgentTasks"
          label="What should Saul handle first?"
          placeholder={isWaste ? "Quote intake, dumpster size, ZIP checks, debris rules, delivery timing, CRM notes..." : "Missed calls, after-hours, quotes, scheduling, emergencies, CRM notes..."}
          value={form.desiredAgentTasks}
          error={errors.desiredAgentTasks}
          onChange={(value) => update("desiredAgentTasks", value)}
        />
        <TextArea
          id="missedCallPain"
          label="What are missed calls costing you?"
          placeholder={isWaste ? "Missed after-hours calls, price shoppers, wrong details, slow callbacks, bad fit leads..." : "Tell us what gets lost, delayed, or forgotten today."}
          value={form.missedCallPain}
          error={errors.missedCallPain}
          onChange={(value) => update("missedCallPain", value)}
        />
        <Input
          label="Preferred callback window"
          placeholder="Tomorrow afternoon, weekday mornings, after 4 PM..."
          value={form.preferredCallbackWindow}
          error={errors.preferredCallbackWindow}
          onChange={(e) => update("preferredCallbackWindow", e.target.value)}
        />
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-start gap-3">
          <input
            id="voice-sms-consent"
            type="checkbox"
            checked={form.smsConsent}
            onChange={(e) => update("smsConsent", e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-wire bg-graphite text-cyan focus:ring-cyan/40 shrink-0 cursor-pointer"
          />
          <label htmlFor="voice-sms-consent" className="text-xs text-slate leading-relaxed cursor-pointer">
            I consent to receive non-marketing text messages from AskSaul about this voice-agent inquiry, including follow-up questions, callback coordination, and booking reminders. Message frequency varies. Message and data rates may apply. Text HELP for help, reply STOP to opt out.
          </label>
        </div>
        {errors.smsConsent && <p className="text-xs text-error ml-7">{errors.smsConsent}</p>}

        <div className="flex items-start gap-3">
          <input
            id="voice-marketing-consent"
            type="checkbox"
            checked={form.marketingSmsOptIn ?? false}
            onChange={(e) => update("marketingSmsOptIn", e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-wire bg-graphite text-cyan focus:ring-cyan/40 shrink-0 cursor-pointer"
          />
          <label htmlFor="voice-marketing-consent" className="text-xs text-slate leading-relaxed cursor-pointer">
            I consent to receive marketing text messages from AskSaul about voice-agent tips, service updates, and occasional offers. Message frequency varies. Message and data rates may apply. Text HELP for help, reply STOP to opt out.
          </label>
        </div>
        <p className="text-xs text-dim ml-7">
          SMS consent is optional and is not required to submit this form or buy services. View our{" "}
          <a href="/privacy" className="underline hover:text-slate transition-colors">Privacy Policy</a>
          {" "}and{" "}
          <a href="/terms" className="underline hover:text-slate transition-colors">Terms of Service</a>.
        </p>
      </div>

      {submitError && (
        <div className="mt-5 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {submitError}
        </div>
      )}

      <div className="mt-7 flex flex-col sm:flex-row gap-3 sm:items-center">
        <Button type="submit" variant="primary" size="lg" disabled={submitting} className="w-full sm:w-auto">
          {submitting ? "Sending..." : "Map My Call Flow"}
        </Button>
        <p className="text-xs text-dim leading-relaxed">
          Prefer to test it first? Call Saul at <a className="text-cyan hover:text-cyan/80" href={"tel:" + "+1" + "970" + "401" + "7285"}>(970) 401-7285</a>.
        </p>
      </div>
    </form>
  );
}
