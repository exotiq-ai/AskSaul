import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HomeHero from "@/components/home-v2/HomeHero";
import StackMarquee from "@/components/home/StackMarquee";
import WorkLeaks from "@/components/home-v2/WorkLeaks";
import BuildBento from "@/components/home-v2/BuildBento";
import ProofWall from "@/components/home-v2/ProofWall";
import HowAndClose from "@/components/home-v2/HowAndClose";
import { pageMetadata } from "@/lib/seo";
import PageSeoSchema from "@/components/seo/PageSeoSchema";

export const metadata = pageMetadata("/");

export default function HomePage() {
  return (
    <>
      <PageSeoSchema path="/" />
      <Navbar />
      <main id="main-content" className="overflow-x-clip">
        <HomeHero />
        <StackMarquee />
        <WorkLeaks />
        <BuildBento />
        <ProofWall />
        <HowAndClose />
      </main>
      <Footer />
    </>
  );
}
