import {
  CalendarCheck,
  ClipboardCheck,
  Database,
  FileText,
  Mic,
  PhoneIncoming,
  type LucideIcon,
} from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

interface FlowStep {
  label: string;
  description: string;
  icon: LucideIcon;
  featured?: boolean;
}

const FLOW_STEPS: FlowStep[] = [
  {
    label: "Customer calls",
    description: "After hours, during a job, or while your team is already on another call.",
    icon: PhoneIncoming,
  },
  {
    label: "Saul answers",
    description: "A natural voice agent picks up and follows your intake rules.",
    icon: Mic,
    featured: true,
  },
  {
    label: "Qualifies the job",
    description: "Service type, urgency, location, timing, and caller details.",
    icon: ClipboardCheck,
  },
  {
    label: "Logs the details",
    description: "Clean notes instead of voicemail chaos or half-remembered callbacks.",
    icon: FileText,
  },
  {
    label: "CRM updated",
    description: "GHL or your CRM gets the lead record, tags, notes, and next step.",
    icon: Database,
  },
  {
    label: "Follow-up or booking",
    description: "Gregory or your team gets the summary and can close the loop fast.",
    icon: CalendarCheck,
  },
];

const CAPTURED_DETAILS = [
  "Caller name and phone number",
  "Service requested",
  "Location or service area",
  "Urgency level",
  "Preferred appointment window",
  "Call summary and next step",
];

export default function VoiceAgentFlow() {
  return (
    <section id="how-it-works" className="relative py-24 bg-obsidian overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-50" aria-hidden="true" />
      <div
        className="absolute left-1/2 top-12 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-dim mb-3">
            Voice Agent Workflow
          </p>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-cloud leading-tight mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            From missed call to usable lead record.
          </h2>
          <p className="text-lg text-slate leading-relaxed">
            Saul answers, asks the right questions, captures job details, and pushes the context into GHL or your CRM so a human can take action.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={120}>
          <div className="relative bg-carbon/80 backdrop-blur-sm border border-wire rounded-3xl p-4 sm:p-6 lg:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)] overflow-hidden">
            <div className="absolute inset-0 dot-pattern opacity-30" aria-hidden="true" />
            <div
              className="absolute -top-32 right-10 h-64 w-64 rounded-full bg-ice/10 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 lg:gap-8 items-stretch">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {FLOW_STEPS.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.label}
                      className={`relative rounded-2xl border p-5 transition-all duration-200 ${
                        step.featured
                          ? "bg-cyan/10 border-cyan/40 shadow-[0_0_36px_rgba(0,212,170,0.10)]"
                          : "bg-graphite/80 border-wire hover:border-cyan/30"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                            step.featured
                              ? "bg-cyan text-obsidian border-cyan"
                              : "bg-cyan/10 text-cyan border-cyan/20"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-xs font-mono text-dim mb-1">
                            Step {index + 1}
                          </div>
                          <h3 className="text-base font-semibold text-cloud mb-2">
                            {step.label}
                          </h3>
                          <p className="text-sm leading-relaxed text-slate">
                            {step.description}
                          </p>
                        </div>
                      </div>
                      {step.featured && (
                        <div className="mt-5 flex items-center gap-1.5" aria-hidden="true">
                          {[...Array(16)].map((_, i) => (
                            <span
                              key={i}
                              className="w-1 rounded-full bg-cyan/70"
                              style={{ height: `${8 + ((i * 7) % 18)}px` }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <aside className="rounded-2xl border border-cyan/20 bg-obsidian/60 p-5 sm:p-6">
                <p className="text-xs font-semibold tracking-widest uppercase text-cyan/80 mb-3">
                  What gets captured
                </p>
                <h3 className="text-xl font-bold text-cloud mb-4" style={{ fontFamily: "var(--font-display)" }}>
                  No more mystery voicemails.
                </h3>
                <ul className="space-y-3">
                  {CAPTURED_DETAILS.map((detail) => (
                    <li key={detail} className="flex items-start gap-2 text-sm text-slate leading-relaxed">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 rounded-xl border border-wire bg-graphite/70 p-4">
                  <p className="text-sm text-cloud font-medium mb-1">The point is not just answering.</p>
                  <p className="text-sm text-slate leading-relaxed">
                    The point is turning a call into a clean follow-up record your business can act on.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
