import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How AskSaul.ai collects, uses, and protects your information. A subsidiary of Ask Saul Inc..",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-mono text-dim uppercase tracking-widest mb-3">
            AskSaul.ai, a subsidiary of Ask Saul Inc.
          </p>
          <h1 className="font-display text-4xl font-bold text-cloud mb-2">
            Privacy Policy
          </h1>
          <p className="text-slate mb-8">
            How AskSaul.ai Collects, Uses, and Protects Your Information
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
              AskSaul.ai (&quot;AskSaul,&quot; &quot;we,&quot; &quot;us,&quot;
              or &quot;our&quot;), a subsidiary of Ask Saul Inc., is
              committed to protecting the privacy and security of information
              collected through asksaul.ai (the &quot;Website&quot;) and related
              services. This Privacy Policy explains what information we collect,
              how we use it, who we share it with, and how we protect it.
            </p>
            <p>
              This Privacy Policy applies to all visitors and users of the
              Website, including prospective clients who submit proposals,
              contact forms, or interact with our chat features.
            </p>

            <h2 className="font-display text-xl font-bold text-cloud pt-4">
              Article I: Information We Collect
            </h2>

            <h3 className="font-display text-lg font-semibold text-cloud">
              Section 1.1. Contact Information
            </h3>
            <p>
              When you submit a proposal, contact form, or interact with our
              chat widget, we collect: your name, email address, phone number,
              business name, and any additional information you voluntarily
              provide.
            </p>

            <h3 className="font-display text-lg font-semibold text-cloud">
              Section 1.2. Business and Project Data
            </h3>
            <p>
              Through our proposal builder, we collect: your industry, team
              size, revenue range, service preferences, project timeline, budget
              range, and any notes you include about your project needs.
            </p>

            <h3 className="font-display text-lg font-semibold text-cloud">
              Section 1.3. Chat Interaction Data
            </h3>
            <p>
              When you use our chat widget, we collect: chat conversation logs,
              the name and email you provide, and your stated intent or area of
              interest. Chat transcripts may be used to improve our services.
            </p>

            <h3 className="font-display text-lg font-semibold text-cloud">
              Section 1.4. Technical and Usage Data
            </h3>
            <p>
              We automatically collect: IP addresses, browser type, device
              information, and operating system; pages viewed, features used,
              and session duration; and referral sources.
            </p>

            <h3 className="font-display text-lg font-semibold text-cloud">
              Section 1.5. SMS Consent Data
            </h3>
            <p>
              When you opt in to SMS/text messaging through our forms, we
              collect and store: your mobile phone number; SMS consent
              preferences (transactional, marketing, or both); the timestamp and
              IP address at the time of consent; the specific consent language
              presented at opt-in; and opt-out history and timestamps. These
              consent records are maintained for at least five (5) years after
              the last interaction as required for TCPA compliance.
            </p>

            <h2 className="font-display text-xl font-bold text-cloud pt-4">
              Article II: How We Use Your Information
            </h2>

            <h3 className="font-display text-lg font-semibold text-cloud">
              Section 2.1. Service Delivery
            </h3>
            <p>
              We use your information to: respond to inquiries and proposal
              requests; scope, estimate, and deliver the services you request;
              communicate project updates and deliverables; and provide
              post-project support.
            </p>

            <h3 className="font-display text-lg font-semibold text-cloud">
              Section 2.2. Communications
            </h3>
            <p>
              We use your contact information to send: project-related emails
              and updates; transactional and promotional SMS messages via
              GoHighLevel (only with your prior express consent); and relevant
              service announcements. You may opt out of non-transactional
              communications at any time.
            </p>

            <h3 className="font-display text-lg font-semibold text-cloud">
              Section 2.3. Lead Management
            </h3>
            <p>
              Submitted proposals and contact forms are processed through
              GoHighLevel CRM for lead management, follow-up scheduling, and
              pipeline tracking.
            </p>

            <h2 className="font-display text-xl font-bold text-cloud pt-4">
              Article III: How We Share Your Information
            </h2>

            <h3 className="font-display text-lg font-semibold text-cloud">
              Section 3.1. Third-Party Service Providers
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-wire rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-graphite">
                    <th className="text-left p-3 text-dim font-semibold border-b border-wire">
                      Provider
                    </th>
                    <th className="text-left p-3 text-dim font-semibold border-b border-wire">
                      Purpose
                    </th>
                    <th className="text-left p-3 text-dim font-semibold border-b border-wire">
                      Data Shared
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-wire/50">
                    <td className="p-3">GoHighLevel</td>
                    <td className="p-3">CRM, SMS delivery</td>
                    <td className="p-3">
                      Contact info, form submissions, consent data
                    </td>
                  </tr>
                  <tr className="border-b border-wire/50">
                    <td className="p-3">Netlify</td>
                    <td className="p-3">Website hosting</td>
                    <td className="p-3">
                      Technical data (IP, browser, pages visited)
                    </td>
                  </tr>
                  <tr className="border-b border-wire/50">
                    <td className="p-3">Anthropic</td>
                    <td className="p-3">AI chat features</td>
                    <td className="p-3">Chat conversation text</td>
                  </tr>
                  <tr>
                    <td className="p-3">OpenAI</td>
                    <td className="p-3">AI chat features</td>
                    <td className="p-3">Chat conversation text</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="font-display text-lg font-semibold text-cloud">
              Section 3.2. SMS Consent Data
            </h3>
            <p>
              We do not sell, rent, or share your SMS consent or phone number
              with any third parties for their marketing purposes. Your phone
              number and SMS consent data may only be shared with: (a) our SMS
              service provider (GoHighLevel) solely for message delivery; and
              (b) as required by law or legal process.
            </p>

            <h3 className="font-display text-lg font-semibold text-cloud">
              Section 3.3. No Sale of Personal Data
            </h3>
            <p>
              AskSaul.ai does not sell, rent, or trade personal information to
              third parties for marketing purposes.
            </p>

            <h2 className="font-display text-xl font-bold text-cloud pt-4">
              Article IV: Data Security
            </h2>
            <p>
              We implement commercially reasonable security measures including:
              encryption of data in transit (TLS 1.2+); secure API
              authentication; and regular security assessments of deployed
              infrastructure.
            </p>
            <p>
              In the event of a data breach, we will notify affected users
              within seventy-two (72) hours of confirmed discovery.
            </p>

            <h2 className="font-display text-xl font-bold text-cloud pt-4">
              Article V: Data Retention
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Proposal and contact data: retained for the duration of the
                business relationship plus two (2) years.
              </li>
              <li>
                Chat transcripts: retained for 90 days, then deleted.
              </li>
              <li>
                SMS consent records: retained for at least five (5) years after
                last interaction.
              </li>
              <li>
                Technical logs: retained for 30 days.
              </li>
            </ul>

            <h2 className="font-display text-xl font-bold text-cloud pt-4">
              Article VI: Your Rights
            </h2>

            <h3 className="font-display text-lg font-semibold text-cloud">
              Section 6.1. Access and Portability
            </h3>
            <p>
              You may request a copy of your personal information by contacting
              us.
            </p>

            <h3 className="font-display text-lg font-semibold text-cloud">
              Section 6.2. Correction
            </h3>
            <p>
              You may update or correct your information by contacting{" "}
              <a
                href="mailto:saul3000bot@gmail.com"
                className="text-cyan hover:text-cyan/80 transition-colors"
              >
                saul3000bot@gmail.com
              </a>
              .
            </p>

            <h3 className="font-display text-lg font-semibold text-cloud">
              Section 6.3. Deletion
            </h3>
            <p>
              You may request deletion by contacting{" "}
              <a
                href="mailto:saul3000bot@gmail.com"
                className="text-cyan hover:text-cyan/80 transition-colors"
              >
                saul3000bot@gmail.com
              </a>
              . Requests processed within 30 days, subject to legal retention
              requirements.
            </p>

            <h3 className="font-display text-lg font-semibold text-cloud">
              Section 6.4. Opt-Out
            </h3>
            <p>
              You may opt out of: marketing communications and SMS messages
              (reply STOP or contact support).
            </p>

            <h3 className="font-display text-lg font-semibold text-cloud">
              Section 6.5. State-Specific Rights
            </h3>
            <p>
              California, Colorado, Virginia, and Connecticut residents may have
              additional rights. Contact{" "}
              <a
                href="mailto:saul3000bot@gmail.com"
                className="text-cyan hover:text-cyan/80 transition-colors"
              >
                saul3000bot@gmail.com
              </a>{" "}
              with your request and state of residence.
            </p>

            <h2 className="font-display text-xl font-bold text-cloud pt-4">
              Article VII: Children&apos;s Privacy
            </h2>
            <p>
              The Website and services are not intended for individuals under 18.
              We do not knowingly collect information from minors.
            </p>

            <h2 className="font-display text-xl font-bold text-cloud pt-4">
              Article VIII: Changes to This Policy
            </h2>
            <p>
              Material changes will be communicated via email at least thirty
              (30) days before the effective date.
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
