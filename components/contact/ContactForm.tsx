"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type FormState = "idle" | "loading" | "success" | "error";

const SOURCE_OPTIONS = [
  "Google Search",
  "Referral",
  "Social Media",
  "Cold Email/Outreach",
  "Blog Post",
  "Other",
];

const BOOKING_URL =
  "https://api.leadconnectorhq.com/widget/bookings/bookwithusdigitalmarketing-3d837e4b-c899-44ff-b612-275f498c2128";

export default function ContactForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setFormState("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const fullName = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
    const nameParts = fullName.split(" ");
    const firstName = nameParts[0] ?? fullName;
    const lastName = nameParts.slice(1).join(" ") || "-";

    const data = {
      firstName,
      lastName,
      email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value.trim(),
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value.trim(),
      referralSource: (form.elements.namedItem("source") as HTMLSelectElement).value,
      smsConsent,
      marketingSmsOptIn: marketingOptIn,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setErrorMsg(json.error || "Something went wrong. Try again.");
        setFormState("error");
        return;
      }

      setFormState("success");
      form.reset();
      setSmsConsent(false);
      setMarketingOptIn(false);
    } catch {
      setErrorMsg("Network error. Check your connection and try again.");
      setFormState("error");
    }
  }

  if (formState === "success") {
    return (
      <div className="rounded-2xl border border-cyan/30 bg-cyan/5 p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-cyan/10 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 text-cyan"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display text-xl font-bold text-cloud mb-2">Message sent.</h3>
        <p className="text-slate text-sm">
          Your message is in the Ask Saul GHL workflow. If you already know you want to talk through it, grab a 15-minute intro with Gregory now.
        </p>
        <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="mt-5 block">
          <Button variant="primary" size="md" className="w-full">
            Book 15 Min with Gregory
          </Button>
        </a>
        <button
          className="mt-4 text-xs text-dim hover:text-slate transition-colors"
          onClick={() => setFormState("idle")}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          id="name"
          name="name"
          label="Name"
          placeholder="Your name"
          required
          disabled={formState === "loading"}
        />
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          required
          disabled={formState === "loading"}
        />
      </div>

      <Input
        id="phone"
        name="phone"
        type="tel"
        label="Phone"
        placeholder="555.555.5555"
        required
        disabled={formState === "loading"}
      />

      <div className="flex flex-col gap-3 pt-1">
        <div className="flex items-start gap-3">
          <input
            id="smsConsent"
            type="checkbox"
            checked={smsConsent}
            onChange={(e) => setSmsConsent(e.target.checked)}
            disabled={formState === "loading"}
            className="mt-0.5 w-4 h-4 rounded border-wire bg-graphite text-cyan focus:ring-cyan/40 shrink-0 cursor-pointer"
          />
          <label htmlFor="smsConsent" className="text-xs text-slate leading-relaxed cursor-pointer">
            I consent to receive non-marketing text messages from AskSaul about this inquiry, including follow-up questions, callback coordination, project updates, and booking reminders. Message frequency varies. Message and data rates may apply. Text HELP for help, reply STOP to opt out.
          </label>
        </div>

        <div className="flex items-start gap-3">
          <input
            id="marketingOptIn"
            type="checkbox"
            checked={marketingOptIn}
            onChange={(e) => setMarketingOptIn(e.target.checked)}
            disabled={formState === "loading"}
            className="mt-0.5 w-4 h-4 rounded border-wire bg-graphite text-cyan focus:ring-cyan/40 shrink-0 cursor-pointer"
          />
          <label htmlFor="marketingOptIn" className="text-xs text-slate leading-relaxed cursor-pointer">
            I consent to receive marketing text messages from AskSaul about automation tips, service updates, and occasional offers. Message frequency varies. Message and data rates may apply. Text HELP for help, reply STOP to opt out.
          </label>
        </div>

        <p className="text-xs text-dim ml-7">
          SMS consent is optional and is not required to submit this form or buy services.{" "}
          View our{" "}
          <a href="/privacy" className="underline hover:text-slate transition-colors">Privacy Policy</a>
          {" "}and{" "}
          <a href="/terms" className="underline hover:text-slate transition-colors">Terms of Service</a>
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium text-slate">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          disabled={formState === "loading"}
          placeholder="Tell us what you are working on and what you need..."
          className="w-full bg-graphite border border-wire rounded-lg px-4 py-3 text-cloud placeholder:text-dim focus:outline-none focus:border-cyan/60 focus:ring-1 focus:ring-cyan/30 transition-colors duration-200 resize-none disabled:opacity-50"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="source" className="text-sm font-medium text-slate">
          How did you hear about us?
        </label>
        <select
          id="source"
          name="source"
          disabled={formState === "loading"}
          defaultValue=""
          className="w-full bg-graphite border border-wire rounded-lg px-4 py-3 text-cloud focus:outline-none focus:border-cyan/60 focus:ring-1 focus:ring-cyan/30 transition-colors duration-200 disabled:opacity-50"
        >
          <option value="" disabled>
            Select an option
          </option>
          {SOURCE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {formState === "error" && (
        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
          {errorMsg}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={formState === "loading"}
      >
        {formState === "loading" ? (
          <>
            <svg
              className="w-4 h-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  );
}
