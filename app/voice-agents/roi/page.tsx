import type { Metadata } from "next";
import RoiCalculator from "@/components/voice-agents/RoiCalculator";

export const metadata: Metadata = {
  title: "Voice Agent ROI Calculator",
  description:
    "Estimate missed-call revenue, labor savings, ROI multiple, and payback period for an AskSaul voice agent.",
  alternates: { canonical: "https://asksaul.ai/voice-agents/roi" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "AskSaul Voice Agent ROI Calculator",
    description: "Run the missed-call math and export a branded ROI briefing.",
    url: "https://asksaul.ai/voice-agents/roi",
  },
};

export default function VoiceAgentRoiPage() {
  return <RoiCalculator />;
}
