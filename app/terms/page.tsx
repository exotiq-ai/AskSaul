import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms governing access to asksaul.ai and related services. AskSaul.ai is a subsidiary of Ask Saul Inc..",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-mono text-dim uppercase tracking-widest mb-3">
            AskSaul.ai, a subsidiary of Ask Saul Inc.
          </p>
          <h1 className="font-display text-4xl font-bold text-cloud mb-2">
            Terms of Service
          </h1>
          <p className="text-slate mb-8">
            Terms Governing Access to asksaul.ai and Related Services
          </p>

          <div className="flex gap-8 text-sm text-dim mb-10">
            <p>
              <strong className="text-slate">Effective Date:</strong> April 1,
              2026
            </p>
            <p>
              <strong className="text-slate">Last Updated:</strong> April 2026
            </p>
          </div>

          <article className="prose-custom space-y-6 text-slate text-[15px] leading-relaxed">
            <p>
              These Terms of Service (&quot;Terms&quot;) govern your access to
              and use of asksaul.ai (the &quot;Website&quot;) and all services
              provided by AskSaul.ai (&quot;AskSaul,&quot; &quot;we,&quot;
              &quot;us,&quot; or &quot;our&quot;), a subsidiary of Ask Saul
              Inc. By accessing or using the Website, you agree to be
              bound by these Terms. If you do not agree, do not use the Website.
            </p>

            <h2 className="font-display text-xl font-bold text-cloud pt-4">
              Article I: Services Overview
            </h2>
            <p>
              AskSaul.ai provides AI assistant setup and deployment, custom
              website and web application development, marketing automation
              services, and related technology consulting. All services are
              scoped and priced per project through our proposal process.
            </p>
            <p>
              Content on the Website, including service descriptions, pricing
              ranges, and timelines, is for general informational purposes only.
              Nothing constitutes a binding offer until a proposal is accepted
              and a project agreement is signed by both parties.
            </p>

            <h2 className="font-display text-xl font-bold text-cloud pt-4">
              Article II: Proposal and Project Terms
            </h2>

            <h3 className="font-display text-lg font-semibold text-cloud">
              Section 2.1. Proposals
            </h3>
            <p>
              Proposals submitted through the Website are requests for scoping,
              not binding contracts. AskSaul will review submissions and respond
              with a detailed scope, timeline, and fixed-price quote within the
              timeframe stated.
            </p>

            <h3 className="font-display text-lg font-semibold text-cloud">
              Section 2.2. Project Agreements
            </h3>
            <p>
              Work begins only after both parties sign a separate project
              agreement that specifies: scope of work, deliverables, timeline,
              payment schedule, and intellectual property ownership. The project
              agreement supersedes these Terms where they conflict.
            </p>

            <h3 className="font-display text-lg font-semibold text-cloud">
              Section 2.3. Payment
            </h3>
            <p>
              Payment terms are defined in each project agreement. Standard
              terms are 50% deposit before work begins, 50% upon completion.
              Late payments accrue interest at 1.5% per month.
            </p>

            <h3 className="font-display text-lg font-semibold text-cloud">
              Section 2.4. Intellectual Property
            </h3>
            <p>
              Upon full payment, you own all custom code, designs, and content
              created specifically for your project. AskSaul retains the right
              to use general techniques, methods, and non-proprietary components.
              AskSaul may reference the project in portfolio materials unless you
              request otherwise.
            </p>

            <h2 className="font-display text-xl font-bold text-cloud pt-4">
              Article III: Website Use
            </h2>

            <h3 className="font-display text-lg font-semibold text-cloud">
              Section 3.1. Acceptable Use
            </h3>
            <p>
              You agree not to: use the Website unlawfully; attempt to gain
              unauthorized access to any systems; introduce malicious code;
              interfere with Website performance; transmit spam or unsolicited
              communications; impersonate any person or entity; or collect
              personal information from other users without consent.
            </p>

            <h3 className="font-display text-lg font-semibold text-cloud">
              Section 3.2. Intellectual Property
            </h3>
            <p>
              All Website content, including text, design, graphics, logos, and
              software, is property of AskSaul.ai and Ask Saul Inc..
              Trademarks include: AskSaul, AskSaul.ai, and the AskSaul logo.
              You may not reproduce, distribute, scrape, or create derivative
              works from Website content without written permission.
            </p>

            <h2 className="font-display text-xl font-bold text-cloud pt-4">
              Article IV: AI Services and Third-Party APIs
            </h2>
            <p>
              AI assistant deployments connect to third-party AI model providers
              (such as Anthropic and OpenAI). These providers have their own
              terms of service and acceptable use policies. You are responsible
              for complying with those terms when using deployed AI assistants.
            </p>
            <p>
              AskSaul is not responsible for: changes in AI provider pricing,
              terms, or availability; AI model outputs, recommendations, or
              actions; or data processed by third-party AI providers according
              to their own privacy policies.
            </p>

            <h2 className="font-display text-xl font-bold text-cloud pt-4">
              Article V: SMS and Communication Terms
            </h2>
            <p>
              By providing your phone number and opting in to SMS communications,
              you consent to receive text messages from AskSaul.ai for
              project-related communications and, if separately opted in,
              marketing messages. Message frequency varies. Message and data
              rates may apply. Reply STOP to opt out at any time. Reply HELP
              for assistance.
            </p>
            <p>
              Your consent to receive SMS is not a condition of purchasing any
              services. See our{" "}
              <a
                href="/privacy"
                className="text-cyan hover:text-cyan/80 transition-colors"
              >
                Privacy Policy
              </a>{" "}
              for details on SMS data handling.
            </p>

            <h2 className="font-display text-xl font-bold text-cloud pt-4">
              Article VI: Disclaimers
            </h2>
            <p className="uppercase text-xs leading-relaxed tracking-wide">
              The Website and services are provided &quot;as is&quot; without
              warranties of any kind, express or implied. AskSaul disclaims all
              warranties including merchantability, fitness for a particular
              purpose, and non-infringement. Performance claims, timelines, and
              ROI estimates are illustrative, not guarantees.
            </p>

            <h2 className="font-display text-xl font-bold text-cloud pt-4">
              Article VII: Limitation of Liability
            </h2>
            <p className="uppercase text-xs leading-relaxed tracking-wide">
              AskSaul&apos;s total liability for any claim arising from the
              Website shall not exceed one hundred dollars ($100). For claims
              arising from project work, liability is limited to the amount paid
              for that specific project. In no event shall AskSaul be liable
              for indirect, incidental, special, consequential, or punitive
              damages.
            </p>

            <h2 className="font-display text-xl font-bold text-cloud pt-4">
              Article VIII: Dispute Resolution
            </h2>
            <p>
              These Terms are governed by the laws of the State of Montana. Any
              disputes arising from these Terms or your use of the Website shall
              be resolved by binding arbitration under the AAA Commercial
              Arbitration Rules, conducted in Montana.
            </p>
            <p className="uppercase text-xs leading-relaxed tracking-wide">
              Class action waiver: all claims may only be brought in your
              individual capacity, not as a plaintiff or class member in any
              class or representative proceeding.
            </p>

            <h2 className="font-display text-xl font-bold text-cloud pt-4">
              Article IX: Modifications
            </h2>
            <p>
              We may update these Terms at any time. Material changes will be
              posted on this page with an updated &quot;Last Updated&quot; date.
              Your continued use of the Website after changes constitutes
              acceptance.
            </p>

            <h2 className="font-display text-xl font-bold text-cloud pt-4">
              Contact
            </h2>
            <p>
              <strong className="text-cloud">Email:</strong>{" "}
              <a
                href="mailto:saul3000bot@gmail.com"
                className="text-cyan hover:text-cyan/80 transition-colors"
              >
                saul3000bot@gmail.com
              </a>
            </p>
            <p>
              <strong className="text-cloud">Phone:</strong>{" "}
              <a
                href="tel:+19703439634"
                className="text-cyan hover:text-cyan/80 transition-colors"
              >
                970.343.9634
              </a>
            </p>
            <p>
              <strong className="text-cloud">Address:</strong> 1001 S Main St
              #6709, Kalispell, MT 59901
            </p>
          </article>

          <p className="text-xs text-dim mt-10">
            &copy; 2026 AskSaul.ai, a subsidiary of Ask Saul Inc.. All
            rights reserved.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
