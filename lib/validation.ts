import { z } from "zod";

// ─── Step 1: Services ───────────────────────────────────────────────────────

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

// Slug-to-label map for query-param preselection from /industries and homepage CTAs
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

export const step2Schema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  industry: z.string().min(1, "Industry is required"),
  teamSize: z.enum(TEAM_SIZE_OPTIONS),
  revenueRange: z.enum(REVENUE_RANGE_OPTIONS).optional(),
  monthlySpend: z.enum(MONTHLY_SPEND_OPTIONS).optional(),
});

// ─── Step 3: Dynamic Questions ───────────────────────────────────────────────

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

export const WEBSITE_EXISTING_OPTIONS = [
  "yes-redesign",
  "yes-fresh",
  "no",
] as const;

export const WEBSITE_PAGES_OPTIONS = ["1-5", "5-10", "10-20", "20+"] as const;

export const ECOMMERCE_OPTIONS = ["yes", "no", "maybe"] as const;

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

export const step3Schema = z.object({
  // AI assistant questions
  aiUserCount: z.enum(AI_USER_COUNT_OPTIONS).optional(),
  aiPlatform: z.array(z.enum(AI_PLATFORM_OPTIONS)).optional(),
  aiHelp: z.array(z.enum(AI_HELP_OPTIONS)).optional(),
  // Website questions
  websiteExisting: z.enum(WEBSITE_EXISTING_OPTIONS).optional(),
  websitePages: z.enum(WEBSITE_PAGES_OPTIONS).optional(),
  websiteEcommerce: z.enum(ECOMMERCE_OPTIONS).optional(),
  // Marketing questions
  marketingTools: z.array(z.enum(MARKETING_TOOLS_OPTIONS)).optional(),
  marketingPain: z.array(z.enum(MARKETING_PAIN_OPTIONS)).optional(),
  // Automation questions
  automationProcesses: z.string().optional(),
  automationTools: z.string().optional(),
  // Not sure questions
  notSureHeadache: z.string().optional(),
  notSureAutomate: z.string().optional(),
  // Common: current tools stack
  currentTools: z.array(z.enum(CURRENT_TOOLS_OPTIONS)).optional(),
});

// ─── Step 4: Contact & Preferences ──────────────────────────────────────────

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

export const step4Schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  smsConsent: z
    .boolean()
    .refine((v) => v === true, { message: "SMS consent is required to continue" }),
  marketingSmsOptIn: z.boolean().optional(),
  preferredContact: z.enum(PREFERRED_CONTACT_OPTIONS),
  timeline: z.enum(TIMELINE_OPTIONS),
  budget: z.enum(BUDGET_OPTIONS).optional(),
  notes: z.string().optional(),
});

// ─── Full Proposal Schema ────────────────────────────────────────────────────

export const proposalSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema);

export type ProposalFormData = z.infer<typeof proposalSchema>;

// ─── Contact Form ────────────────────────────────────────────────────────────

export const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  smsConsent: z
    .boolean()
    .refine((v) => v === true, { message: "SMS consent is required to continue" }),
  marketingSmsOptIn: z.boolean().optional(),
  message: z.string().min(10, "Please tell us a bit more"),
  referralSource: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// ─── Chat Widget ─────────────────────────────────────────────────────────────

export const chatLeadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  chatTranscript: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    })
  ),
  initialIntent: z
    .enum(["website", "ai-setup", "pricing", "browsing"])
    .optional(),
});

export type ChatLeadData = z.infer<typeof chatLeadSchema>;
