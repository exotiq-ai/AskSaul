import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import ProblemStatement from "@/components/home/ProblemStatement";
import ServiceLanes from "@/components/home/ServiceLanes";
import WhatSaulDoes from "@/components/home/WhatSaulDoes";
import IndustriesServed from "@/components/home/IndustriesServed";
import SaulDemo from "@/components/home/SaulDemo";
import PortfolioPreview from "@/components/home/PortfolioPreview";
import CaseStudyTeaser from "@/components/home/CaseStudyTeaser";
import SocialProof from "@/components/home/SocialProof";
import FinalCTA from "@/components/home/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <ProblemStatement />
        <ServiceLanes />
        <WhatSaulDoes />
        <IndustriesServed />
        <SocialProof />
        <SaulDemo />
        <PortfolioPreview />
        <CaseStudyTeaser />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
