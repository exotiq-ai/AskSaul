import Link from "next/link";
import { ArrowRight, Shield, Zap, Users } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";

const capabilities = [
  {
    icon: Zap,
    label: "Set up for you",
    description: "Configured, tested, and handed off ready to work",
  },
  {
    icon: Shield,
    label: "Security hardened",
    description: "Zero critical findings before every handoff",
  },
  {
    icon: Users,
    label: "Lives in your apps",
    description: "Telegram, WhatsApp, Discord, or Slack",
  },
];

export default function SaulDemo() {
  return (
    <section className="relative py-24 bg-carbon overflow-hidden">
      <div
        className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse 80% 100% at 100% 50%, rgba(74,198,232,0.12) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: copy */}
          <AnimatedSection>
            <p className="text-xs font-semibold tracking-widest uppercase text-dim mb-3">
              Meet Saul
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-cloud mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Your AI assistant,
              <br />
              <span className="text-ice">on your infrastructure</span>
            </h2>
            <p className="text-slate leading-relaxed mb-8">
              Saul is your AI assistant, set up for you, tuned to your business,
              and supported after launch. You talk to him in the apps your team
              already uses. He remembers your context, takes real actions, and
              gets better over time. Unlike SaaS chatbots, Saul runs on your own
              infrastructure, which means your data stays yours and there are no
              monthly seat fees.
            </p>

            <div className="space-y-4 mb-8">
              {capabilities.map((cap) => {
                const Icon = cap.icon;
                return (
                  <div key={cap.label} className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-ice/10 border border-ice/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-ice" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-cloud">
                        {cap.label}
                      </p>
                      <p className="text-base text-slate">{cap.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link href="/ai-automation">
              <Button variant="secondary" size="md" className="group">
                See AI Service Tiers
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </AnimatedSection>

          {/* Right: mock chat UI */}
          <AnimatedSection delay={200}>
            <div className="bg-graphite border border-wire rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
              {/* Chat header */}
              <div className="flex items-center gap-3 px-4 py-3 bg-carbon border-b border-wire">
                <div className="w-8 h-8 rounded-full bg-cyan/20 border border-cyan/30 flex items-center justify-center">
                  <span className="text-xs font-bold text-cyan">S</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-cloud">Saul</p>
                  <p className="text-xs text-success flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
                    Online
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="p-4 space-y-3 min-h-64">
                <div className="flex justify-end">
                  <div className="bg-cyan/15 border border-cyan/20 rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-cloud max-w-xs">
                    I have a sales call with Meridian Properties in 20 minutes. What should I know?
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-cyan/20 border border-cyan/30 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-cyan">S</span>
                  </div>
                  <div className="bg-carbon border border-wire rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-cloud max-w-xs leading-relaxed">
                    Meridian Properties is a Denver-based commercial real estate firm. They manage 12 properties across the metro area. Their CEO, Lisa Chen, was quoted last month about expanding into mixed-use developments. They are currently hiring a marketing director, which suggests growth mode. Want me to draft talking points for the call?
                  </div>
                </div>

                <div className="flex gap-2 pl-10">
                  {["Yes, draft talking points", "Pull up their website"].map((label) => (
                    <span
                      key={label}
                      className="text-xs text-ice border border-ice/30 rounded-full px-3 py-1.5 cursor-pointer hover:bg-ice/10 transition-colors"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="px-4 py-3 border-t border-wire">
                <p className="text-xs text-center text-dim">
                  Powered by AskSaul.ai
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
