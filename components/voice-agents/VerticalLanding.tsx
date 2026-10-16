import Link from "next/link";
import { ArrowRight, PhoneIncoming, Search } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FAQSchema from "@/components/seo/FAQSchema";
import PageSeoSchema from "@/components/seo/PageSeoSchema";
import { serviceSchema } from "@/components/seo/schema";
import CallStory from "@/components/voice-agents/CallStory";
import MobileActionBar from "@/components/site/MobileActionBar";
import type { CallStoryData } from "@/components/voice-agents/stories";
import {
  AuditBand,
  FaqList,
  FinalCta,
  FounderNote,
  FoundingSection,
  ProofStrip,
  TryToBreakIt,
  VoiceHero,
  type Trade,
} from "@/components/voice-agents/blocks";

export type VerticalContent = {
  trade: Trade;
  eyebrow: string;
  line1: string;
  line2: string;
  sub: string;
  rings: string;
  answered: string;
  story: CallStoryData;
  proofNote: string;
  faqs: { question: string; answer: string }[];
  closing: [string, string];
};

export default function VerticalLanding({ c }: { c: VerticalContent }) {
  return (
    <>
      <FAQSchema questions={c.faqs} />
      <PageSeoSchema
        path={`/voice-agents/${c.trade}`}
        extra={[
          serviceSchema({
            path: `/voice-agents/${c.trade}`,
            name: c.trade === "hvac" ? "AI receptionist for HVAC companies" : "AI receptionist for roofing companies",
            serviceType: "AI receptionist",
            description: c.answered,
            audience: c.trade === "hvac" ? "HVAC contractors" : "Roofing contractors",
          }),
        ]}
      />
      <Navbar />
      <main id="main-content" className="overflow-x-clip">
        <VoiceHero eyebrow={c.eyebrow} line1={c.line1} line2={c.line2} sub={c.sub} trade={c.trade} />

        <ProofStrip
          items={[
            { n: "+300%", l: "website visits for Lou's Heating & Cooling since the rebuild" },
            { n: "2x", l: "contact form submissions for Lou's, same period" },
            { n: "24/7", l: "after-hours and overflow calls answered by Saul" },
          ]}
        />

        <section className="bg-obsidian py-32 sm:py-40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="reveal mb-20 max-w-3xl">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-cyan">What you get</p>
              <h2 className="font-display text-4xl font-bold leading-[1.02] text-cloud sm:text-6xl">Both halves of the problem.</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[
                { icon: Search, label: "Phone rings", body: c.rings },
                { icon: PhoneIncoming, label: "Phone answered", body: c.answered },
              ].map((half, i) => {
                const Icon = half.icon;
                return (
                  <div
                    key={half.label}
                    className={`reveal rounded-[2rem] p-8 sm:p-12 ${
                      i === 1 ? "bg-gradient-to-br from-cyan/20 via-carbon to-carbon ring-1 ring-cyan/30" : "border border-wire bg-carbon/50"
                    }`}
                  >
                    <Icon className="mb-10 h-8 w-8 text-cyan" />
                    <p className="font-display text-3xl font-bold text-cloud sm:text-4xl">{half.label}</p>
                    <p className="mt-5 text-lg leading-relaxed text-slate">{half.body}</p>
                  </div>
                );
              })}
            </div>
            <p className="reveal mt-8 text-slate">
              Plus a real person reviews your calls every month and tunes Saul&apos;s script.
            </p>
          </div>
        </section>

        <CallStory story={c.story} />

        <section className="bg-carbon/30 py-32 sm:py-40">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <p className="reveal mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-cyan">Proof, honestly</p>
            <p className="reveal font-display text-3xl font-bold leading-snug text-cloud sm:text-5xl">
              We rebuilt the website for Lou&apos;s Heating &amp; Cooling, cleaned up their Google profile, and set them up for AI search. Visits are up 300% and form fills doubled.
            </p>
            <p className="reveal mt-8 max-w-2xl text-lg leading-relaxed text-slate">{c.proofNote}</p>
            <Link
              href="/case-studies/lous-hvac"
              className="reveal mt-8 inline-flex items-center gap-2 font-semibold text-cyan transition-all hover:gap-3"
            >
              Read the Lou&apos;s case study <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <FounderNote />
        <FoundingSection trade={c.trade} />
        <TryToBreakIt />
        <AuditBand />
        <FaqList faqs={c.faqs} />
        <FinalCta line1={c.closing[0]} line2={c.closing[1]} />
        <div className="h-20 md:hidden" aria-hidden="true" />
      </main>
      <Footer />
      <MobileActionBar />
    </>
  );
}
