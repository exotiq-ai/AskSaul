import VerticalLanding, { type VerticalContent } from "@/components/voice-agents/VerticalLanding";
import { HVAC_STORY } from "@/components/voice-agents/stories";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/voice-agents/hvac");

const content: VerticalContent = {
  trade: "hvac",
  eyebrow: "Front Range HVAC",
  line1: "More homeowners find you.",
  line2: "Every no-heat call gets answered.",
  sub: "The first cold night, furnaces quit. Homeowners call at 9 p.m., get voicemail, and book whoever picks up. Saul picks up.",
  rings:
    "Google Business Profile optimization, local SEO for your service cities, and AI search so ChatGPT, Gemini, and Google's AI answers can find and recommend you.",
  answered:
    "Saul answers after hours and overflow, says it's an AI up front, and gets system type, symptoms, address, and urgency. Gas smell goes straight to your safety instructions and on-call protocol. It texts you the lead and books by your rules.",
  story: HVAC_STORY,
  proofNote: "That was the phone-rings half. Saul is the other half, and the guarantee covers it: if Saul misses your lead target in the first 30 days, month 2 is free.",
  faqs: [
    {
      question: "What happens on a gas-smell call?",
      answer:
        "Saul gives the safety instructions you approve and routes the call to your on-call protocol right away. It never tries to diagnose.",
    },
    {
      question: "Will it quote prices or arrival windows?",
      answer: "Only if you write that rule. By default Saul captures the job and leaves pricing and timing to your team.",
    },
    {
      question: "Will callers know they are talking to an AI?",
      answer: "Yes. Saul says so at the start of every call. Homeowners with no heat care more about getting help tonight.",
    },
    {
      question: "How much of my time does setup take?",
      answer: "About 30 minutes on a kickoff call. We build, tune, and report. You approve the intake rules before anything goes live.",
    },
  ],
  closing: ["The next cold snap is coming.", "Be the shop that picks up."],
};

export default function HvacPage() {
  return <VerticalLanding c={content} />;
}
