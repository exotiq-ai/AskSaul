import type { Metadata } from "next";
import RoiCalculator from "@/components/voice-agents/RoiCalculator";

export const metadata: Metadata = {
  title: "Internal Voice Agent ROI Calculator",
  description: "Internal AskSaul ROI calculator with deal economics and contract levers.",
  robots: { index: false, follow: false, nocache: true },
};

export default function InternalRoiPage() {
  return <RoiCalculator internalEnabled />;
}
