"use client";

import { useFormContext } from "react-hook-form";
import type { ProposalFormData, ServiceOption } from "@/lib/validation";
import {
  AI_USER_COUNT_OPTIONS,
  AI_PLATFORM_OPTIONS,
  AI_HELP_OPTIONS,
  AI_TIER_PREFERENCE_OPTIONS,
  AI_MESSAGE_VOLUME_OPTIONS,
  AI_ADDON_OPTIONS,
  VPS_PREFERENCE_OPTIONS,
  WEBSITE_EXISTING_OPTIONS,
  WEBSITE_PAGES_OPTIONS,
  ECOMMERCE_OPTIONS,
  ECOMMERCE_PLATFORM_OPTIONS,
  CMS_OPTIONS,
  DESIGN_STATUS_OPTIONS,
  CONTENT_STATUS_OPTIONS,
  HOSTING_PREFERENCE_OPTIONS,
  WEBSITE_INTEGRATION_OPTIONS,
  MARKETING_TOOLS_OPTIONS,
  MARKETING_PAIN_OPTIONS,
  LIST_SIZE_OPTIONS,
  EMAIL_VOLUME_OPTIONS,
  SMS_VOLUME_OPTIONS,
  REVIEW_SOURCE_OPTIONS,
  AUTOMATION_COMPLEXITY_OPTIONS,
  VOICE_AGENT_USE_CASE_OPTIONS,
  CALL_VOLUME_OPTIONS,
  LANGUAGE_OPTIONS,
  AUTH_OPTIONS,
} from "@/lib/validation";

// ─── Label maps ──────────────────────────────────────────────────────────────

const AI_USER_LABELS: Record<string, string> = {
  "just-me": "Just me",
  "small-team": "My team",
  customers: "Our customers",
};
const AI_PLATFORM_LABELS: Record<string, string> = {
  telegram: "Telegram",
  whatsapp: "WhatsApp",
  discord: "Discord",
  slack: "Slack",
  "website-chat": "Website chat",
  "not-sure": "Not sure",
};
const AI_HELP_LABELS: Record<string, string> = {
  "customer-support": "Customer support",
  sales: "Sales",
  "internal-productivity": "Internal productivity",
  research: "Research",
  all: "All of the above",
};
const AI_TIER_LABELS: Record<string, string> = {
  starter: "Starter",
  team: "Team",
  pro: "Pro",
  developer: "Developer",
  "not-sure": "Not sure yet",
};
const AI_VOLUME_LABELS: Record<string, string> = {
  "under-1k": "Under 1K / mo",
  "1k-10k": "1K to 10K / mo",
  "10k-100k": "10K to 100K / mo",
  "100k-plus": "100K+ / mo",
  "not-sure": "Not sure",
};
const AI_ADDON_LABELS: Record<string, string> = {
  "additional-channel": "Additional channel",
  "custom-skill": "Custom skill",
  "managed-care": "Managed care",
  "security-audit": "Security audit",
  "vps-provisioning": "VPS provisioning",
};
const VPS_PREF_LABELS: Record<string, string> = {
  "we-provision": "You provision it",
  "i-have-vps": "I have a VPS",
  "not-sure": "Not sure",
};
const WEBSITE_EXISTING_LABELS: Record<string, string> = {
  "yes-redesign": "Yes, needs redesign",
  "yes-fresh": "Yes, starting fresh",
  no: "Building from scratch",
};
const WEBSITE_PAGES_LABELS: Record<string, string> = {
  "1-5": "1 to 5",
  "5-10": "5 to 10",
  "10-20": "10 to 20",
  "20+": "20+",
};
const ECOM_LABELS: Record<string, string> = {
  yes: "Yes",
  no: "No",
  maybe: "Maybe later",
};
const ECOM_PLATFORM_LABELS: Record<string, string> = {
  shopify: "Shopify",
  woocommerce: "WooCommerce",
  custom: "Custom",
  "not-sure": "Not sure",
};
const CMS_LABELS: Record<string, string> = {
  "nextjs-headless": "Next.js / headless",
  wordpress: "WordPress",
  webflow: "Webflow",
  sanity: "Sanity",
  contentful: "Contentful",
  "not-sure": "Not sure",
};
const DESIGN_STATUS_LABELS: Record<string, string> = {
  "has-figma": "I have Figma mocks",
  "needs-design": "I need design",
  "redesign-existing": "Redesign existing",
  partial: "Partial / some assets",
};
const CONTENT_STATUS_LABELS: Record<string, string> = {
  "will-provide": "I'll provide copy",
  "need-copywriting": "I need copywriting",
  partial: "Partial / some copy",
};
const HOSTING_LABELS: Record<string, string> = {
  "we-host": "You host it",
  "client-host": "I host it",
  "dont-know": "Don't know yet",
};
const INTEGRATION_LABELS: Record<string, string> = {
  stripe: "Stripe",
  calendly: "Calendly",
  hubspot: "HubSpot",
  salesforce: "Salesforce",
  mailchimp: "Mailchimp",
  "google-analytics": "Google Analytics",
  "meta-pixel": "Meta Pixel",
  zapier: "Zapier",
  "custom-api": "Custom API",
  none: "None",
};
const MK_TOOLS_LABELS: Record<string, string> = {
  mailchimp: "Mailchimp",
  hubspot: "HubSpot",
  activecampaign: "ActiveCampaign",
  gohighlevel: "GoHighLevel",
  spreadsheets: "Spreadsheets",
  nothing: "Nothing yet",
  other: "Other",
};
const MK_PAIN_LABELS: Record<string, string> = {
  "lead-capture": "Lead capture",
  "follow-up": "Follow-up",
  "email-sequences": "Email sequences",
  "review-management": "Review management",
  all: "All of the above",
};
const LIST_SIZE_LABELS: Record<string, string> = {
  "under-1k": "Under 1K",
  "1k-10k": "1K to 10K",
  "10k-50k": "10K to 50K",
  "50k-plus": "50K+",
  "not-sure": "Not sure",
};
const EMAIL_VOL_LABELS: Record<string, string> = {
  "under-10k": "Under 10K / mo",
  "10k-50k": "10K to 50K / mo",
  "50k-250k": "50K to 250K / mo",
  "250k-plus": "250K+ / mo",
  "not-sure": "Not sure",
};
const SMS_VOL_LABELS: Record<string, string> = {
  none: "None",
  "under-1k": "Under 1K / mo",
  "1k-10k": "1K to 10K / mo",
  "10k-plus": "10K+ / mo",
  "not-sure": "Not sure",
};
const REVIEW_LABELS: Record<string, string> = {
  google: "Google",
  facebook: "Facebook",
  yelp: "Yelp",
  trustpilot: "Trustpilot",
  "industry-specific": "Industry-specific",
  "not-sure": "Not sure",
};
const AUTOMATION_COMPLEXITY_LABELS: Record<string, string> = {
  "simple-drip": "Simple drip",
  "behavioral-triggers": "Behavioral triggers",
  "multi-stage-nurture": "Multi-stage nurture",
  "not-sure": "Not sure",
};
const VOICE_USE_CASE_LABELS: Record<string, string> = {
  "after-hours-intake": "After-hours intake",
  "appointment-booking": "Appointment booking",
  "lead-qualification": "Lead qualification",
  "customer-support": "Customer support",
  other: "Other",
};
const CALL_VOLUME_LABELS: Record<string, string> = {
  "under-100": "Under 100 / mo",
  "100-500": "100 to 500 / mo",
  "500-2k": "500 to 2K / mo",
  "2k-plus": "2K+ / mo",
  "not-sure": "Not sure",
};
const LANGUAGE_LABELS: Record<string, string> = {
  english: "English",
  spanish: "Spanish",
  french: "French",
  other: "Other",
};
const AUTH_LABELS: Record<string, string> = {
  "email-password": "Email + password",
  "sso-required": "SSO required",
  "magic-link": "Magic link",
  "oauth-google-microsoft": "Google / Microsoft OAuth",
  "not-sure": "Not sure",
};

// ─── Shared UI primitives ───────────────────────────────────────────────────

function Toggle({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`
        py-2.5 px-3 rounded-lg border text-sm font-medium transition-all duration-200 text-left
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/60
        ${
          selected
            ? "border-cyan bg-cyan/10 text-cyan"
            : "border-wire bg-graphite text-slate hover:border-cyan/30 hover:text-cloud"
        }
      `}
    >
      {children}
    </button>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-medium text-cloud mb-2">{children}</p>;
}

function Optional() {
  return <span className="text-dim font-normal">(optional)</span>;
}

// ─── Per-service blocks ─────────────────────────────────────────────────────

function AiBlock() {
  const { watch, setValue } = useFormContext<ProposalFormData>();
  const users = watch("aiUserCount");
  const platforms = watch("aiPlatform") ?? [];
  const helps = watch("aiHelp") ?? [];
  const tier = watch("aiTierPreference");
  const vol = watch("aiMessageVolume");
  const addons = watch("aiAddons") ?? [];
  const vps = watch("aiVpsPreference");

  function toggleArr<T extends string>(
    key: keyof ProposalFormData,
    arr: readonly T[],
    v: T,
  ) {
    if (arr.includes(v)) {
      setValue(key, arr.filter((x) => x !== v) as never);
    } else {
      setValue(key, [...arr, v] as never);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <FieldLabel>Who will use it?</FieldLabel>
        <div className="grid grid-cols-3 gap-2">
          {AI_USER_COUNT_OPTIONS.map((o) => (
            <Toggle
              key={o}
              selected={users === o}
              onClick={() => setValue("aiUserCount", users === o ? undefined : o)}
            >
              {AI_USER_LABELS[o]}
            </Toggle>
          ))}
        </div>
      </div>
      <div>
        <FieldLabel>Which messaging platforms?</FieldLabel>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {AI_PLATFORM_OPTIONS.map((o) => (
            <Toggle
              key={o}
              selected={platforms.includes(o)}
              onClick={() => toggleArr("aiPlatform", platforms, o)}
            >
              {AI_PLATFORM_LABELS[o]}
            </Toggle>
          ))}
        </div>
      </div>
      <div>
        <FieldLabel>What should it help with?</FieldLabel>
        <div className="grid grid-cols-2 gap-2">
          {AI_HELP_OPTIONS.map((o) => (
            <Toggle
              key={o}
              selected={helps.includes(o)}
              onClick={() => toggleArr("aiHelp", helps, o)}
            >
              {AI_HELP_LABELS[o]}
            </Toggle>
          ))}
        </div>
      </div>
      <div>
        <FieldLabel>Tier preference <Optional /></FieldLabel>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {AI_TIER_PREFERENCE_OPTIONS.map((o) => (
            <Toggle
              key={o}
              selected={tier === o}
              onClick={() =>
                setValue("aiTierPreference", tier === o ? undefined : o)
              }
            >
              {AI_TIER_LABELS[o]}
            </Toggle>
          ))}
        </div>
      </div>
      <div>
        <FieldLabel>Monthly message volume <Optional /></FieldLabel>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {AI_MESSAGE_VOLUME_OPTIONS.map((o) => (
            <Toggle
              key={o}
              selected={vol === o}
              onClick={() =>
                setValue("aiMessageVolume", vol === o ? undefined : o)
              }
            >
              {AI_VOLUME_LABELS[o]}
            </Toggle>
          ))}
        </div>
      </div>
      <div>
        <FieldLabel>Interested in add-ons? <Optional /></FieldLabel>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {AI_ADDON_OPTIONS.map((o) => (
            <Toggle
              key={o}
              selected={addons.includes(o)}
              onClick={() => toggleArr("aiAddons", addons, o)}
            >
              {AI_ADDON_LABELS[o]}
            </Toggle>
          ))}
        </div>
      </div>
      <div>
        <FieldLabel>Hosting preference <Optional /></FieldLabel>
        <div className="grid grid-cols-3 gap-2">
          {VPS_PREFERENCE_OPTIONS.map((o) => (
            <Toggle
              key={o}
              selected={vps === o}
              onClick={() => setValue("aiVpsPreference", vps === o ? undefined : o)}
            >
              {VPS_PREF_LABELS[o]}
            </Toggle>
          ))}
        </div>
      </div>
    </div>
  );
}

function WebsiteBlock() {
  const { watch, setValue, register } = useFormContext<ProposalFormData>();
  const existing = watch("websiteExisting");
  const pages = watch("websitePages");
  const ecom = watch("websiteEcommerce");
  const ecomPlatform = watch("websiteEcommercePlatform");
  const cms = watch("websiteCms");
  const design = watch("websiteDesignStatus");
  const content = watch("websiteContentStatus");
  const hosting = watch("websiteHostingPreference");
  const integrations = watch("websiteIntegrations") ?? [];
  const domainOwned = watch("websiteDomainOwned");

  function toggleIntegration(v: (typeof WEBSITE_INTEGRATION_OPTIONS)[number]) {
    if (integrations.includes(v)) {
      setValue(
        "websiteIntegrations",
        integrations.filter((x) => x !== v),
      );
    } else {
      setValue("websiteIntegrations", [...integrations, v]);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <FieldLabel>Do you have an existing site?</FieldLabel>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {WEBSITE_EXISTING_OPTIONS.map((o) => (
            <Toggle
              key={o}
              selected={existing === o}
              onClick={() =>
                setValue("websiteExisting", existing === o ? undefined : o)
              }
            >
              {WEBSITE_EXISTING_LABELS[o]}
            </Toggle>
          ))}
        </div>
      </div>
      {(existing === "yes-redesign" || existing === "yes-fresh") && (
        <div>
          <FieldLabel>Existing site URL <Optional /></FieldLabel>
          <input
            type="text"
            placeholder="https://example.com"
            className="w-full px-4 py-3 rounded-lg bg-graphite border border-wire text-cloud placeholder:text-dim focus:outline-none focus:ring-2 focus:ring-cyan/40 focus:border-cyan/60"
            {...register("websiteExistingUrl")}
          />
        </div>
      )}
      <div>
        <FieldLabel>How many pages?</FieldLabel>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {WEBSITE_PAGES_OPTIONS.map((o) => (
            <Toggle
              key={o}
              selected={pages === o}
              onClick={() => setValue("websitePages", pages === o ? undefined : o)}
            >
              {WEBSITE_PAGES_LABELS[o]}
            </Toggle>
          ))}
        </div>
      </div>
      <div>
        <FieldLabel>Need e-commerce?</FieldLabel>
        <div className="grid grid-cols-3 gap-2">
          {ECOMMERCE_OPTIONS.map((o) => (
            <Toggle
              key={o}
              selected={ecom === o}
              onClick={() =>
                setValue("websiteEcommerce", ecom === o ? undefined : o)
              }
            >
              {ECOM_LABELS[o]}
            </Toggle>
          ))}
        </div>
      </div>
      {ecom === "yes" && (
        <div>
          <FieldLabel>E-commerce platform preference <Optional /></FieldLabel>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ECOMMERCE_PLATFORM_OPTIONS.map((o) => (
              <Toggle
                key={o}
                selected={ecomPlatform === o}
                onClick={() =>
                  setValue(
                    "websiteEcommercePlatform",
                    ecomPlatform === o ? undefined : o,
                  )
                }
              >
                {ECOM_PLATFORM_LABELS[o]}
              </Toggle>
            ))}
          </div>
        </div>
      )}
      <div>
        <FieldLabel>CMS preference <Optional /></FieldLabel>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CMS_OPTIONS.map((o) => (
            <Toggle
              key={o}
              selected={cms === o}
              onClick={() => setValue("websiteCms", cms === o ? undefined : o)}
            >
              {CMS_LABELS[o]}
            </Toggle>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Design status</FieldLabel>
          <div className="grid grid-cols-1 gap-2">
            {DESIGN_STATUS_OPTIONS.map((o) => (
              <Toggle
                key={o}
                selected={design === o}
                onClick={() =>
                  setValue("websiteDesignStatus", design === o ? undefined : o)
                }
              >
                {DESIGN_STATUS_LABELS[o]}
              </Toggle>
            ))}
          </div>
        </div>
        <div>
          <FieldLabel>Content status</FieldLabel>
          <div className="grid grid-cols-1 gap-2">
            {CONTENT_STATUS_OPTIONS.map((o) => (
              <Toggle
                key={o}
                selected={content === o}
                onClick={() =>
                  setValue("websiteContentStatus", content === o ? undefined : o)
                }
              >
                {CONTENT_STATUS_LABELS[o]}
              </Toggle>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Do you own the domain?</FieldLabel>
          <div className="grid grid-cols-2 gap-2">
            <Toggle
              selected={domainOwned === true}
              onClick={() =>
                setValue(
                  "websiteDomainOwned",
                  domainOwned === true ? undefined : true,
                )
              }
            >
              Yes
            </Toggle>
            <Toggle
              selected={domainOwned === false}
              onClick={() =>
                setValue(
                  "websiteDomainOwned",
                  domainOwned === false ? undefined : false,
                )
              }
            >
              No
            </Toggle>
          </div>
        </div>
        <div>
          <FieldLabel>Hosting preference</FieldLabel>
          <div className="grid grid-cols-1 gap-2">
            {HOSTING_PREFERENCE_OPTIONS.map((o) => (
              <Toggle
                key={o}
                selected={hosting === o}
                onClick={() =>
                  setValue(
                    "websiteHostingPreference",
                    hosting === o ? undefined : o,
                  )
                }
              >
                {HOSTING_LABELS[o]}
              </Toggle>
            ))}
          </div>
        </div>
      </div>
      <div>
        <FieldLabel>Integrations needed <Optional /></FieldLabel>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {WEBSITE_INTEGRATION_OPTIONS.map((o) => (
            <Toggle
              key={o}
              selected={integrations.includes(o)}
              onClick={() => toggleIntegration(o)}
            >
              {INTEGRATION_LABELS[o]}
            </Toggle>
          ))}
        </div>
      </div>
    </div>
  );
}

function MarketingBlock() {
  const { watch, setValue, register } = useFormContext<ProposalFormData>();
  const tools = watch("marketingTools") ?? [];
  const pain = watch("marketingPain") ?? [];
  const listSize = watch("marketingListSize");
  const emailVol = watch("marketingEmailVolume");
  const smsVol = watch("marketingSmsVolume");
  const reviewSources = watch("marketingReviewSources") ?? [];
  const complexity = watch("marketingAutomationComplexity");

  function toggleArr<T extends string>(
    key: keyof ProposalFormData,
    arr: readonly T[],
    v: T,
  ) {
    if (arr.includes(v)) {
      setValue(key, arr.filter((x) => x !== v) as never);
    } else {
      setValue(key, [...arr, v] as never);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <FieldLabel>Current marketing tools</FieldLabel>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {MARKETING_TOOLS_OPTIONS.map((o) => (
            <Toggle
              key={o}
              selected={tools.includes(o)}
              onClick={() => toggleArr("marketingTools", tools, o)}
            >
              {MK_TOOLS_LABELS[o]}
            </Toggle>
          ))}
        </div>
      </div>
      <div>
        <FieldLabel>Biggest pain points</FieldLabel>
        <div className="grid grid-cols-2 gap-2">
          {MARKETING_PAIN_OPTIONS.map((o) => (
            <Toggle
              key={o}
              selected={pain.includes(o)}
              onClick={() => toggleArr("marketingPain", pain, o)}
            >
              {MK_PAIN_LABELS[o]}
            </Toggle>
          ))}
        </div>
      </div>
      <div>
        <FieldLabel>List size <Optional /></FieldLabel>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {LIST_SIZE_OPTIONS.map((o) => (
            <Toggle
              key={o}
              selected={listSize === o}
              onClick={() =>
                setValue("marketingListSize", listSize === o ? undefined : o)
              }
            >
              {LIST_SIZE_LABELS[o]}
            </Toggle>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Email volume / month <Optional /></FieldLabel>
          <div className="grid grid-cols-1 gap-2">
            {EMAIL_VOLUME_OPTIONS.map((o) => (
              <Toggle
                key={o}
                selected={emailVol === o}
                onClick={() =>
                  setValue(
                    "marketingEmailVolume",
                    emailVol === o ? undefined : o,
                  )
                }
              >
                {EMAIL_VOL_LABELS[o]}
              </Toggle>
            ))}
          </div>
        </div>
        <div>
          <FieldLabel>SMS volume / month <Optional /></FieldLabel>
          <div className="grid grid-cols-1 gap-2">
            {SMS_VOLUME_OPTIONS.map((o) => (
              <Toggle
                key={o}
                selected={smsVol === o}
                onClick={() =>
                  setValue(
                    "marketingSmsVolume",
                    smsVol === o ? undefined : o,
                  )
                }
              >
                {SMS_VOL_LABELS[o]}
              </Toggle>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Team seats needed <Optional /></FieldLabel>
          <input
            type="number"
            min={1}
            placeholder="e.g. 3"
            className="w-full px-4 py-3 rounded-lg bg-graphite border border-wire text-cloud placeholder:text-dim focus:outline-none focus:ring-2 focus:ring-cyan/40 focus:border-cyan/60"
            {...register("marketingTeamSeats")}
          />
        </div>
        <div>
          <FieldLabel>Automation complexity <Optional /></FieldLabel>
          <div className="grid grid-cols-1 gap-2">
            {AUTOMATION_COMPLEXITY_OPTIONS.map((o) => (
              <Toggle
                key={o}
                selected={complexity === o}
                onClick={() =>
                  setValue(
                    "marketingAutomationComplexity",
                    complexity === o ? undefined : o,
                  )
                }
              >
                {AUTOMATION_COMPLEXITY_LABELS[o]}
              </Toggle>
            ))}
          </div>
        </div>
      </div>
      <div>
        <FieldLabel>Review sources you care about <Optional /></FieldLabel>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {REVIEW_SOURCE_OPTIONS.map((o) => (
            <Toggle
              key={o}
              selected={reviewSources.includes(o)}
              onClick={() =>
                toggleArr("marketingReviewSources", reviewSources, o)
              }
            >
              {REVIEW_LABELS[o]}
            </Toggle>
          ))}
        </div>
      </div>
    </div>
  );
}

function AutomationBlock() {
  const { register } = useFormContext<ProposalFormData>();
  return (
    <div className="flex flex-col gap-4">
      <div>
        <FieldLabel>What processes eat the most time?</FieldLabel>
        <textarea
          rows={3}
          placeholder="e.g. Following up with leads, scheduling appointments, data entry"
          className="w-full px-4 py-3 rounded-lg bg-graphite border border-wire text-cloud placeholder:text-dim focus:outline-none focus:ring-2 focus:ring-cyan/40 focus:border-cyan/60 resize-none"
          {...register("automationProcesses")}
        />
      </div>
      <div>
        <FieldLabel>What tools does your team use daily?</FieldLabel>
        <textarea
          rows={2}
          placeholder="e.g. Google Sheets, Slack, QuickBooks, Salesforce"
          className="w-full px-4 py-3 rounded-lg bg-graphite border border-wire text-cloud placeholder:text-dim focus:outline-none focus:ring-2 focus:ring-cyan/40 focus:border-cyan/60 resize-none"
          {...register("automationTools")}
        />
      </div>
    </div>
  );
}

function VoiceBlock() {
  const { watch, setValue } = useFormContext<ProposalFormData>();
  const useCase = watch("voiceUseCase");
  const vol = watch("voiceCallVolume");
  const langs = watch("voiceLanguages") ?? [];
  function toggleLang(l: (typeof LANGUAGE_OPTIONS)[number]) {
    if (langs.includes(l)) {
      setValue("voiceLanguages", langs.filter((x) => x !== l));
    } else {
      setValue("voiceLanguages", [...langs, l]);
    }
  }
  return (
    <div className="flex flex-col gap-4">
      <div>
        <FieldLabel>Primary use case</FieldLabel>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {VOICE_AGENT_USE_CASE_OPTIONS.map((o) => (
            <Toggle
              key={o}
              selected={useCase === o}
              onClick={() =>
                setValue("voiceUseCase", useCase === o ? undefined : o)
              }
            >
              {VOICE_USE_CASE_LABELS[o]}
            </Toggle>
          ))}
        </div>
      </div>
      <div>
        <FieldLabel>Expected call volume</FieldLabel>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {CALL_VOLUME_OPTIONS.map((o) => (
            <Toggle
              key={o}
              selected={vol === o}
              onClick={() =>
                setValue("voiceCallVolume", vol === o ? undefined : o)
              }
            >
              {CALL_VOLUME_LABELS[o]}
            </Toggle>
          ))}
        </div>
      </div>
      <div>
        <FieldLabel>Languages</FieldLabel>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {LANGUAGE_OPTIONS.map((o) => (
            <Toggle
              key={o}
              selected={langs.includes(o)}
              onClick={() => toggleLang(o)}
            >
              {LANGUAGE_LABELS[o]}
            </Toggle>
          ))}
        </div>
      </div>
    </div>
  );
}

function CustomAppBlock() {
  const { watch, setValue, register } = useFormContext<ProposalFormData>();
  const auth = watch("customAppAuth");
  return (
    <div className="flex flex-col gap-4">
      <div>
        <FieldLabel>In one sentence, what does it do?</FieldLabel>
        <textarea
          rows={2}
          placeholder="e.g. A portal where our customers upload loan docs and track approval status"
          className="w-full px-4 py-3 rounded-lg bg-graphite border border-wire text-cloud placeholder:text-dim focus:outline-none focus:ring-2 focus:ring-cyan/40 focus:border-cyan/60 resize-none"
          {...register("customAppDescription")}
        />
      </div>
      <div>
        <FieldLabel>Who are the user types?</FieldLabel>
        <input
          type="text"
          placeholder="e.g. admin, customer, partner"
          className="w-full px-4 py-3 rounded-lg bg-graphite border border-wire text-cloud placeholder:text-dim focus:outline-none focus:ring-2 focus:ring-cyan/40 focus:border-cyan/60"
          {...register("customAppUserTypes")}
        />
      </div>
      <div>
        <FieldLabel>Key features <Optional /></FieldLabel>
        <textarea
          rows={3}
          placeholder="e.g. document upload, status tracking, admin dashboard, Stripe checkout"
          className="w-full px-4 py-3 rounded-lg bg-graphite border border-wire text-cloud placeholder:text-dim focus:outline-none focus:ring-2 focus:ring-cyan/40 focus:border-cyan/60 resize-none"
          {...register("customAppKeyFeatures")}
        />
      </div>
      <div>
        <FieldLabel>Auth requirements <Optional /></FieldLabel>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {AUTH_OPTIONS.map((o) => (
            <Toggle
              key={o}
              selected={auth === o}
              onClick={() =>
                setValue("customAppAuth", auth === o ? undefined : o)
              }
            >
              {AUTH_LABELS[o]}
            </Toggle>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotSureBlock() {
  const { register } = useFormContext<ProposalFormData>();
  return (
    <div className="flex flex-col gap-4">
      <div>
        <FieldLabel>What is the biggest headache in your business right now?</FieldLabel>
        <textarea
          rows={3}
          placeholder="No wrong answers. Tell it like it is."
          className="w-full px-4 py-3 rounded-lg bg-graphite border border-wire text-cloud placeholder:text-dim focus:outline-none focus:ring-2 focus:ring-cyan/40 focus:border-cyan/60 resize-none"
          {...register("notSureHeadache")}
        />
      </div>
      <div>
        <FieldLabel>What would you automate if you could?</FieldLabel>
        <textarea
          rows={3}
          placeholder="Dream a little. What would free up the most time?"
          className="w-full px-4 py-3 rounded-lg bg-graphite border border-wire text-cloud placeholder:text-dim focus:outline-none focus:ring-2 focus:ring-cyan/40 focus:border-cyan/60 resize-none"
          {...register("notSureAutomate")}
        />
      </div>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

const SECTION_LABELS: Record<ServiceOption, string> = {
  "ai-assistant": "AI Assistant",
  website: "Website",
  marketing: "Marketing Automation",
  automation: "Workflow Automation",
  "voice-agent": "Voice Agent",
  "custom-app": "Custom App",
  "not-sure": "Help me figure it out",
};

const ORDERED: ServiceOption[] = [
  "ai-assistant",
  "website",
  "marketing",
  "automation",
  "voice-agent",
  "custom-app",
  "not-sure",
];

export default function ServiceDeepDiscovery({
  services,
}: {
  services: ServiceOption[];
}) {
  const active = ORDERED.filter((s) => services.includes(s));
  if (active.length === 0) {
    return <p className="text-slate text-sm">No services selected. Go back to Step 1.</p>;
  }
  return (
    <div className="flex flex-col gap-8">
      {active.map((service) => (
        <div key={service}>
          {active.length > 1 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-wire" />
              <span className="text-xs font-semibold uppercase tracking-widest text-dim px-2">
                {SECTION_LABELS[service]}
              </span>
              <div className="h-px flex-1 bg-wire" />
            </div>
          )}
          {service === "ai-assistant" && <AiBlock />}
          {service === "website" && <WebsiteBlock />}
          {service === "marketing" && <MarketingBlock />}
          {service === "automation" && <AutomationBlock />}
          {service === "voice-agent" && <VoiceBlock />}
          {service === "custom-app" && <CustomAppBlock />}
          {service === "not-sure" && <NotSureBlock />}
        </div>
      ))}
    </div>
  );
}
