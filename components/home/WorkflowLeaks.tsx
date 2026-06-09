import { ClipboardList, MessageSquareOff, PhoneOff, Repeat2 } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

const leaks = [
  {
    icon: PhoneOff,
    title: "Missed calls",
    cost: "Calls go to voicemail while customers call the next company.",
    ship: "A voice agent that answers, qualifies, summarizes, and routes the lead.",
  },
  {
    icon: MessageSquareOff,
    title: "Dead follow-up",
    cost: "Leads fill out forms, then wait too long for a useful response.",
    ship: "CRM, email, and SMS follow-up that triggers automatically and keeps the next step clear.",
  },
  {
    icon: Repeat2,
    title: "Repeat questions",
    cost: "Your team answers pricing, availability, service-area, and process questions all day.",
    ship: "An assistant trained around your services, policies, and customer journey.",
  },
  {
    icon: ClipboardList,
    title: "Admin drag",
    cost: "Staff copy-paste between inboxes, spreadsheets, CRMs, and calendars.",
    ship: "Workflow automation that updates tools, drafts responses, and creates clean handoffs.",
  },
];

export default function WorkflowLeaks() {
  return (
    <section className="relative py-24 bg-carbon">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-cyan mb-3">
            The work leaking revenue
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold text-cloud mb-5" style={{ fontFamily: "var(--font-display)" }}>
            You do not need another tool. You need the work to get done.
          </h2>
          <p className="text-lg text-slate leading-relaxed">
            The best automation opportunities are usually hiding in plain sight: calls, forms, follow-up, customer questions, and repeat admin your team already knows too well.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {leaks.map((leak, index) => {
            const Icon = leak.icon;
            return (
              <AnimatedSection key={leak.title} delay={index * 100} className="rounded-3xl border border-wire bg-graphite/70 p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="h-12 w-12 rounded-2xl border border-cyan/25 bg-cyan/10 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-cyan" aria-hidden="true" />
                  </div>
                  <h3 className="text-2xl font-bold text-cloud" style={{ fontFamily: "var(--font-display)" }}>
                    {leak.title}
                  </h3>
                </div>
                <div className="grid gap-4">
                  <div className="rounded-2xl border border-error/20 bg-error/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-error mb-2">Cost today</p>
                    <p className="text-slate leading-relaxed">{leak.cost}</p>
                  </div>
                  <div className="rounded-2xl border border-cyan/20 bg-cyan/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-cyan mb-2">What Saul ships</p>
                    <p className="text-slate leading-relaxed">{leak.ship}</p>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
