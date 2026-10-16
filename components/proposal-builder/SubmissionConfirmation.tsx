import Link from "next/link";
import Button from "@/components/ui/Button";
import { BOOKING_URL } from "@/lib/constants";

export default function SubmissionConfirmation() {
  return (
    <div className="flex flex-col items-center text-center gap-6 py-4">
      {/* Success icon */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-cyan/10 border border-cyan/30 flex items-center justify-center">
          <svg className="w-10 h-10 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="absolute inset-0 rounded-full bg-cyan/5 blur-xl" />
      </div>

      {/* Message */}
      <div className="flex flex-col gap-2 max-w-sm">
        <h2 className="font-display text-2xl font-bold text-cloud">
          Your request is with Gregory.
        </h2>
        <p className="text-slate text-base leading-relaxed">
          He&apos;ll review your answers and email a scoped proposal within 24 hours. Want to talk through it sooner? Pick a 15-minute call below.
        </p>
      </div>

      {/* What happens next */}
      <div className="w-full max-w-sm bg-graphite border border-wire rounded-xl p-4 text-left">
        <p className="text-xs font-semibold uppercase tracking-widest text-dim mb-3">What happens next</p>
        <div className="flex flex-col gap-3">
          {[
            { step: "1", text: "Your answers are saved, so you won’t have to start again on a call." },
            { step: "2", text: "Gregory identifies the 1–3 workflows worth automating first, with scope and a clear next step." },
            { step: "3", text: "Your proposal arrives by email within 24 hours. A call is optional." },
          ].map(({ step, text }) => (
            <div key={step} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan/20 text-cyan text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {step}
              </div>
              <p className="text-sm text-slate leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button variant="primary" size="md" className="w-full">
            Book a 15-minute call
          </Button>
        </a>
        <Link href="/" className="flex-1">
          <Button variant="ghost" size="md" className="w-full">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
