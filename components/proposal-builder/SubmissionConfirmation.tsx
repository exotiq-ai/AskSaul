import Link from "next/link";
import Button from "@/components/ui/Button";

export default function SubmissionConfirmation({
  proposalId,
}: {
  proposalId?: string;
}) {
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
          Saul is reviewing your project.
        </h2>
        <p className="text-slate text-base leading-relaxed">
          You will have a custom proposal in your inbox within 24 hours. We take these seriously. No templates, no generic replies.
        </p>
      </div>

      {/* What happens next */}
      <div className="w-full max-w-sm bg-graphite border border-wire rounded-xl p-4 text-left">
        <p className="text-xs font-semibold uppercase tracking-widest text-dim mb-3">What happens next</p>
        <div className="flex flex-col gap-3">
          {[
            { step: "1", text: "Saul reviews your answers and scores your project" },
            { step: "2", text: "Gregory puts together a scoped proposal with real pricing" },
            { step: "3", text: "You get an email within 24 hours, often sooner" },
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

      {proposalId && (
        <p className="text-xs text-dim">
          Reference #: <span className="font-mono text-slate">{proposalId.slice(0, 8)}</span>
        </p>
      )}

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <a
          href="https://calendly.com/gregoryr/discovery"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button variant="primary" size="md" className="w-full">
            Book a Call Now
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
