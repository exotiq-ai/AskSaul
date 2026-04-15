import { z } from "zod";

// ─── Step 1: Services ────────────────────────────────────────────────────────

export const SERVICE_OPTIONS = [
  "ai-assistant",
  "website",
  "marketing",
  "automation",
  "voice-agent",
  "custom-app",
  "not-sure",
] as const;

export type ServiceOption = (typeof SERVICE_OPTIONS)[number];

export const step1Schema = z.object({
  services: z
    .array(z.enum(SERVICE_OPTIONS))
    .min(1, "Select at least one service"),
});

// ─── Step 2: Business Info ───────────────────────────────────────────────────

export const INDUSTRY_OPTIONS = [
  "Managed IT Services (MSPs)",
  "Property Management",
  "Home Services (HVAC, Plumbing, Pool, Roofing)",
  "Title Insurance",
  "Professional Services (Legal, Consulting, Accounting)",
  "Real Estate",
  "Sales-Led Startup",
  "PE Portfolio Company",
  "E-Commerce / Retail",
  "Marketing / Advertising",
  "Healthcare",
  "Restaurant / Food & Beverage",
  "Construction / Trades",
  "Finance / Accounting",
  "Technology",
  "Education",
  "Non-Profit",
  "Other",
] as const;

// Slug → label for ?industry= URL params and Supabase persistence
export const VERTICAL_SLUG_TO_INDUSTRY: Record<string, string> = {
  msp: "Managed IT Services (MSPs)",
  "property-mgmt": "Property Management",
  "home-services": "Home Services (HVAC, Plumbing, Pool, Roofing)",
  "title-insurance": "Title Insurance",
  "professional-services": "Professional Services (Legal, Consulting, Accounting)",
  "real-estate": "Real Estate",
  startup: "Sales-Led Startup",
  "pe-portfolio": "PE Portfolio Company",
  ecommerce: "E-Commerce / Retail",
};

// Reverse map — used server-side to normalize label → slug for DB
export const INDUSTRY_LABEL_TO_SLUG: Record<string, string> = Object.entries(
  VERTICAL_SLUG_TO_INDUSTRY,
).reduce<Record<string, string>>((acc, [slug, label]) => {
  acc[label] = slug;
  return acc;
}, {});

// Which industries trigger vertical-specific follow-up questions in Step 3
export const VERTICAL_SLUGS_WITH_QUESTIONS = [
  "msp",
  "property-mgmt",
  "home-services",
  "title-insurance",
  "professional-services",
  "real-estate",
  "startup",
  "pe-portfolio",
] as const;
export type VerticalSlug = (typeof VERTICAL_SLUGS_WITH_QUESTIONS)[number];

export const TEAM_SIZE_OPTIONS = ["1", "2-5", "6-20", "20+"] as const;

export const REVENUE_RANGE_OPTIONS = [
  "under-10k",
  "10k-50k",
  "50k-250k",
  "250k-plus",
] as const;

export const MONTHLY_SPEND_OPTIONS = [
  "under-1k",
  "1k-2.5k",
  "2.5k-5k",
  "5k-10k",
  "10k-25k",
  "25k-plus",
  "not-sure",
] as const;

export const ROLE_IN_COMPANY_OPTIONS = [
  "founder",
  "ceo",
  "marketing-lead",
  "ops",
  "sales-lead",
  "engineering-lead",
  "assistant",
  "other",
] as const;

export const DECISION_MAKER_OPTIONS = ["yes", "shared", "no"] as const;

export const step2Schema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessWebsite: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        try {
          new URL(val.startsWith("http") ? val : `https://${val}`);
          return true;
        } catch {
          return false;
        }
      },
      { message: "Enter a valid URL or leave blank" },
    ),
  industry: z.string().min(1, "Industry is required"),
  teamSize: z.enum(TEAM_SIZE_OPTIONS),
  revenueRange: z.enum(REVENUE_RANGE_OPTIONS).optional(),
  monthlySpend: z.enum(MONTHLY_SPEND_OPTIONS).optional(),
  roleInCompany: z.enum(ROLE_IN_COMPANY_OPTIONS).optional(),
  decisionMaker: z.enum(DECISION_MAKER_OPTIONS).optional(),
});

// ─── Step 3: Stack + vertical depth ─────────────────────────────────────────

export const CURRENT_TOOLS_OPTIONS = [
  "apollo",
  "hubspot",
  "salesforce",
  "instantly",
  "mailchimp",
  "linkedin-automation",
  "calendly",
  "gohighlevel",
  "podium",
  "connectwise",
  "autotask",
  "none",
  "other",
] as const;

export const COMPLIANCE_OPTIONS = [
  "hipaa",
  "soc2",
  "pci",
  "gdpr",
  "ccpa",
  "none",
  "other",
] as const;

// Vertical-specific enums
export const MSP_PSA_OPTIONS = [
  "connectwise",
  "autotask",
  "halopsa",
  "syncro",
  "none",
  "other",
] as const;
export const TICKET_VOLUME_OPTIONS = [
  "under-100",
  "100-500",
  "500-1k",
  "1k-5k",
  "5k-plus",
] as const;

export const PORTFOLIO_TYPE_OPTIONS = [
  "single-family",
  "multifamily",
  "mixed",
  "commercial",
  "vacation-rental",
] as const;

export const HOME_SERVICE_TRADE_OPTIONS = [
  "hvac",
  "plumbing",
  "pool",
  "roofing",
  "electrical",
  "landscaping",
  "other",
] as const;
export const JOB_VOLUME_OPTIONS = [
  "under-50",
  "50-200",
  "200-500",
  "500-1k",
  "1k-plus",
] as const;

export const STARTUP_STAGE_OPTIONS = [
  "pre-seed",
  "seed",
  "series-a",
  "series-b-plus",
  "bootstrapped",
  "profitable",
] as const;

export const step3Schema = z.object({
  currentTools: z.array(z.enum(CURRENT_TOOLS_OPTIONS)).optional(),
  complianceNeeds: z.array(z.enum(COMPLIANCE_OPTIONS)).optional(),

  // ─ Vertical: MSP ─
  mspPsaSystem: z.enum(MSP_PSA_OPTIONS).optional(),
  mspTicketVolume: z.enum(TICKET_VOLUME_OPTIONS).optional(),
  // Numeric fields accepted as string from <input type="number"> and coerced
  // server-side in lib/payload.ts. Keeps Zod's output type simple and avoids
  // resolver-level type drift between preprocess branches.
  mspClientCount: z.string().trim().optional(),
  mspRecurringRevenuePct: z.string().trim().optional(),

  // ─ Vertical: Property Management ─
  propertyDoorCount: z.string().trim().optional(),
  propertyPortfolioType: z.enum(PORTFOLIO_TYPE_OPTIONS).optional(),
  propertyTenantPortalNeeded: z.boolean().optional(),

  // ─ Vertical: Home Services ─
  homeServiceTrades: z.array(z.enum(HOME_SERVICE_TRADE_OPTIONS)).optional(),
  homeServiceJobVolume: z.enum(JOB_VOLUME_OPTIONS).optional(),
  homeServiceDispatchTool: z.string().trim().max(100).optional(),

  // ─ Vertical: Title Insurance ─
  titleDealsPerMonth: z.string().trim().optional(),
  titleOfficeCount: z.string().trim().optional(),

  // ─ Vertical: Professional Services ─
  profPracticeArea: z.string().trim().max(120).optional(),
  profBillableHoursTracked: z.boolean().optional(),
  profClientPortalNeeded: z.boolean().optional(),

  // ─ Vertical: Real Estate ─
  realEstateTeamType: z
    .enum(["brokerage", "team", "solo-agent", "developer"])
    .optional(),
  realEstateAgentCount: z.string().trim().optional(),
  realEstateMlsIntegrationNeeded: z.boolean().optional(),

  // ─ Vertical: Startup ─
  startupStage: z.enum(STARTUP_STAGE_OPTIONS).optional(),
  startupRunwayMonths: z.string().trim().optional(),
  startupKeyMetric: z.string().trim().max(120).optional(),

  // ─ Vertical: PE Portfolio ─
  pePortfolioCompanyCount: z.string().trim().optional(),
  peUnifiedReportingRequired: z.boolean().optional(),
});

// ─── Step 4: Service-specific deep discovery ────────────────────────────────
// Every field is optional at the Zod layer. We enforce "at least something for
// selected services" in the form UX, not the schema, so partially-filled
// submissions don't 422 at the API boundary.

// AI Assistant
export const AI_USER_COUNT_OPTIONS = [
  "just-me",
  "small-team",
  "customers",
] as const;
export const AI_PLATFORM_OPTIONS = [
  "telegram",
  "whatsapp",
  "discord",
  "slack",
  "website-chat",
  "not-sure",
] as const;
export const AI_HELP_OPTIONS = [
  "customer-support",
  "sales",
  "internal-productivity",
  "research",
  "all",
] as const;
export const AI_TIER_PREFERENCE_OPTIONS = [
  "starter",
  "team",
  "pro",
  "developer",
  "not-sure",
] as const;
export const AI_MESSAGE_VOLUME_OPTIONS = [
  "under-1k",
  "1k-10k",
  "10k-100k",
  "100k-plus",
  "not-sure",
] as const;
export const AI_ADDON_OPTIONS = [
  "additional-channel",
  "custom-skill",
  "managed-care",
  "security-audit",
  "vps-provisioning",
] as const;
export const VPS_PREFERENCE_OPTIONS = [
  "we-provision",
  "i-have-vps",
  "not-sure",
] as const;

// Website
export const WEBSITE_EXISTING_OPTIONS = [
  "yes-redesign",
  "yes-fresh",
  "no",
] as const;
export const WEBSITE_PAGES_OPTIONS = ["1-5", "5-10", "10-20", "20+"] as const;
export const ECOMMERCE_OPTIONS = ["yes", "no", "maybe"] as const;
export const ECOMMERCE_PLATFORM_OPTIONS = [
  "shopify",
  "woocommerce",
  "custom",
  "not-sure",
] as const;
export const CMS_OPTIONS = [
  "nextjs-headless",
  "wordpress",
  "webflow",
  "sanity",
  "contentful",
  "not-sure",
] as const;
export const DESIGN_STATUS_OPTIONS = [
  "has-figma",
  "needs-design",
  "redesign-existing",
  "partial",
] as const;
export const CONTENT_STATUS_OPTIONS = [
  "will-provide",
  "need-copywriting",
  "partial",
] as const;
export const HOSTING_PREFERENCE_OPTIONS = [
  "we-host",
  "client-host",
  "dont-know",
] as const;
export const WEBSITE_INTEGRATION_OPTIONS = [
  "stripe",
  "calendly",
  "hubspot",
  "salesforce",
  "mailchimp",
  "google-analytics",
  "meta-pixel",
  "zapier",
  "custom-api",
  "none",
] as const;

// Marketing
export const MARKETING_TOOLS_OPTIONS = [
  "mailchimp",
  "hubspot",
  "activecampaign",
  "gohighlevel",
  "spreadsheets",
  "nothing",
  "other",
] as const;
export const MARKETING_PAIN_OPTIONS = [
  "lead-capture",
  "follow-up",
  "email-sequences",
  "review-management",
  "all",
] as const;
export const LIST_SIZE_OPTIONS = [
  "under-1k",
  "1k-10k",
  "10k-50k",
  "50k-plus",
  "not-sure",
] as const;
export const EMAIL_VOLUME_OPTIONS = [
  "under-10k",
  "10k-50k",
  "50k-250k",
  "250k-plus",
  "not-sure",
] as const;
export const SMS_VOLUME_OPTIONS = [
  "none",
  "under-1k",
  "1k-10k",
  "10k-plus",
  "not-sure",
] as const;
export const REVIEW_SOURCE_OPTIONS = [
  "google",
  "facebook",
  "yelp",
  "trustpilot",
  "industry-specific",
  "not-sure",
] as const;
export const AUTOMATION_COMPLEXITY_OPTIONS = [
  "simple-drip",
  "behavioral-triggers",
  "multi-stage-nurture",
  "not-sure",
] as const;

// Voice Agent
export const VOICE_AGENT_USE_CASE_OPTIONS = [
  "after-hours-intake",
  "appointment-booking",
  "lead-qualification",
  "customer-support",
  "other",
] as const;
export const CALL_VOLUME_OPTIONS = [
  "under-100",
  "100-500",
  "500-2k",
  "2k-plus",
  "not-sure",
] as const;
export const LANGUAGE_OPTIONS = [
  "english",
  "spanish",
  "french",
  "other",
] as const;

// Custom App
export const AUTH_OPTIONS = [
  "email-password",
  "sso-required",
  "magic-link",
  "oauth-google-microsoft",
  "not-sure",
] as const;

export const step4Schema = z.object({
  // ─ AI Assistant ─
  aiUserCount: z.enum(AI_USER_COUNT_OPTIONS).optional(),
  aiPlatform: z.array(z.enum(AI_PLATFORM_OPTIONS)).optional(),
  aiHelp: z.array(z.enum(AI_HELP_OPTIONS)).optional(),
  aiTierPreference: z.enum(AI_TIER_PREFERENCE_OPTIONS).optional(),
  aiMessageVolume: z.enum(AI_MESSAGE_VOLUME_OPTIONS).optional(),
  aiAddons: z.array(z.enum(AI_ADDON_OPTIONS)).optional(),
  aiVpsPreference: z.enum(VPS_PREFERENCE_OPTIONS).optional(),

  // ─ Website ─
  websiteExisting: z.enum(WEBSITE_EXISTING_OPTIONS).optional(),
  websiteExistingUrl: z.string().trim().max(500).optional(),
  websitePages: z.enum(WEBSITE_PAGES_OPTIONS).optional(),
  websiteEcommerce: z.enum(ECOMMERCE_OPTIONS).optional(),
  websiteEcommercePlatform: z.enum(ECOMMERCE_PLATFORM_OPTIONS).optional(),
  websiteCms: z.enum(CMS_OPTIONS).optional(),
  websiteDesignStatus: z.enum(DESIGN_STATUS_OPTIONS).optional(),
  websiteContentStatus: z.enum(CONTENT_STATUS_OPTIONS).optional(),
  websiteDomainOwned: z.boolean().optional(),
  websiteHostingPreference: z.enum(HOSTING_PREFERENCE_OPTIONS).optional(),
  websiteIntegrations: z.array(z.enum(WEBSITE_INTEGRATION_OPTIONS)).optional(),

  // ─ Marketing ─
  marketingTools: z.array(z.enum(MARKETING_TOOLS_OPTIONS)).optional(),
  marketingPain: z.array(z.enum(MARKETING_PAIN_OPTIONS)).optional(),
  marketingListSize: z.enum(LIST_SIZE_OPTIONS).optional(),
  marketingEmailVolume: z.enum(EMAIL_VOLUME_OPTIONS).optional(),
  marketingSmsVolume: z.enum(SMS_VOLUME_OPTIONS).optional(),
  marketingTeamSeats: z.string().trim().optional(),
  marketingReviewSources: z.array(z.enum(REVIEW_SOURCE_OPTIONS)).optional(),
  marketingAutomationComplexity: z
    .enum(AUTOMATION_COMPLEXITY_OPTIONS)
    .optional(),

  // ─ Automation ─
  automationProcesses: z.string().max(2000).optional(),
  automationTools: z.string().max(1000).optional(),

  // ─ Voice Agent ─
  voiceUseCase: z.enum(VOICE_AGENT_USE_CASE_OPTIONS).optional(),
  voiceCallVolume: z.enum(CALL_VOLUME_OPTIONS).optional(),
  voiceLanguages: z.array(z.enum(LANGUAGE_OPTIONS)).optional(),

  // ─ Custom App ─
  customAppDescription: z.string().max(2000).optional(),
  customAppUserTypes: z.string().max(500).optional(),
  customAppKeyFeatures: z.string().max(2000).optional(),
  customAppAuth: z.enum(AUTH_OPTIONS).optional(),

  // ─ Not Sure ─
  notSureHeadache: z.string().max(2000).optional(),
  notSureAutomate: z.string().max(2000).optional(),
});

// ─── Step 5: Timeline + Success + Contact ───────────────────────────────────

export const PREFERRED_CONTACT_OPTIONS = ["email", "phone", "text"] as const;
export const TIMELINE_OPTIONS = [
  "asap",
  "1-2-weeks",
  "1-2-months",
  "exploring",
] as const;
export const BUDGET_OPTIONS = [
  "under-2k",
  "2k-5k",
  "5k-10k",
  "10k-25k",
  "25k-plus",
] as const;

export const step5Schema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().max(120).optional(),
  email: z.string().trim().email("Valid email is required"),
  phone: z
    .string()
    .trim()
    .min(7, "Phone number looks too short")
    .max(30),
  preferredContact: z.enum(PREFERRED_CONTACT_OPTIONS),
  timeline: z.enum(TIMELINE_OPTIONS),
  hardDeadline: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        return /^\d{4}-\d{2}-\d{2}$/.test(val) && !isNaN(Date.parse(val));
      },
      { message: "Use YYYY-MM-DD or leave blank" },
    ),
  budget: z.enum(BUDGET_OPTIONS).optional(),
  successMetrics: z.string().max(2000).optional(),
  // SMS consent is now OPT-IN, not a submission gate
  smsConsent: z.boolean().optional(),
  marketingSmsOptIn: z.boolean().optional(),
  notes: z.string().max(4000).optional(),
});

// ─── Full Proposal Schema ───────────────────────────────────────────────────

export const proposalSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema)
  .merge(step5Schema);

export type ProposalFormData = z.infer<typeof proposalSchema>;

// ─── Contact Form (unchanged except SMS consent) ────────────────────────────

export const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  smsConsent: z.boolean().optional(),
  marketingSmsOptIn: z.boolean().optional(),
  message: z.string().min(10, "Please tell us a bit more"),
  referralSource: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// ─── Chat Widget ────────────────────────────────────────────────────────────

export const chatLeadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  chatTranscript: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    }),
  ),
  initialIntent: z
    .enum(["website", "ai-setup", "pricing", "browsing"])
    .optional(),
});

export type ChatLeadData = z.infer<typeof chatLeadSchema>;
