import type { ProposalFormData } from "./validation";
import {
  INDUSTRY_LABEL_TO_SLUG,
  VERTICAL_SLUGS_WITH_QUESTIONS,
  type VerticalSlug,
} from "./validation";
import {
  buildTags,
  calculateEstimatedValue,
  getLeadValueTag,
} from "./scoring";

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
}

/**
 * Coerce an HTML-form-input string into a number, returning undefined for
 * empty or non-numeric input. Numeric fields in Zod are typed as strings so
 * the form resolver stays simple; conversion happens here.
 */
function toInt(v: string | undefined | null): number | undefined {
  if (v === undefined || v === null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : undefined;
}

function toNum(v: string | undefined | null): number | undefined {
  if (v === undefined || v === null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * Collects every service-specific field into a single jsonb blob keyed by
 * service slug. Fields only appear if the corresponding service is selected
 * AND the field has a value — keeps the blob tight.
 */
function buildServiceDetails(data: ProposalFormData): Record<string, unknown> {
  const details: Record<string, unknown> = {};

  if (data.services.includes("ai-assistant")) {
    const ai: Record<string, unknown> = {};
    if (data.aiUserCount) ai.user_count_bucket = data.aiUserCount;
    if (data.aiPlatform?.length) ai.platforms = data.aiPlatform;
    if (data.aiHelp?.length) ai.use_cases = data.aiHelp;
    if (data.aiTierPreference) ai.tier_preference = data.aiTierPreference;
    if (data.aiMessageVolume) ai.monthly_message_volume = data.aiMessageVolume;
    if (data.aiAddons?.length) ai.addons_interest = data.aiAddons;
    if (data.aiVpsPreference) ai.vps_preference = data.aiVpsPreference;
    details["ai-assistant"] = ai;
  }

  if (data.services.includes("website")) {
    const web: Record<string, unknown> = {};
    if (data.websiteExisting) web.existing = data.websiteExisting;
    if (data.websiteExistingUrl) web.existing_url = data.websiteExistingUrl;
    if (data.websitePages) web.pages = data.websitePages;
    if (data.websiteEcommerce) web.ecommerce = data.websiteEcommerce;
    if (data.websiteEcommercePlatform)
      web.ecommerce_platform_preference = data.websiteEcommercePlatform;
    if (data.websiteCms) web.cms_preference = data.websiteCms;
    if (data.websiteDesignStatus) web.design_status = data.websiteDesignStatus;
    if (data.websiteContentStatus)
      web.content_status = data.websiteContentStatus;
    if (typeof data.websiteDomainOwned === "boolean")
      web.domain_owned = data.websiteDomainOwned;
    if (data.websiteHostingPreference)
      web.hosting_preference = data.websiteHostingPreference;
    if (data.websiteIntegrations?.length)
      web.integrations = data.websiteIntegrations;
    details["website"] = web;
  }

  if (data.services.includes("marketing")) {
    const mk: Record<string, unknown> = {};
    if (data.marketingTools?.length) mk.tools_current = data.marketingTools;
    if (data.marketingPain?.length) mk.pain_points = data.marketingPain;
    if (data.marketingListSize) mk.list_size_bucket = data.marketingListSize;
    if (data.marketingEmailVolume)
      mk.email_volume_monthly = data.marketingEmailVolume;
    if (data.marketingSmsVolume)
      mk.sms_volume_monthly = data.marketingSmsVolume;
    const seats = toInt(data.marketingTeamSeats);
    if (seats !== undefined) mk.team_seats_needed = seats;
    if (data.marketingReviewSources?.length)
      mk.review_sources = data.marketingReviewSources;
    if (data.marketingAutomationComplexity)
      mk.automation_complexity = data.marketingAutomationComplexity;
    details["marketing"] = mk;
  }

  if (data.services.includes("automation")) {
    const aut: Record<string, unknown> = {};
    if (data.automationProcesses) aut.processes_text = data.automationProcesses;
    if (data.automationTools) aut.tools_text = data.automationTools;
    details["automation"] = aut;
  }

  if (data.services.includes("voice-agent")) {
    const v: Record<string, unknown> = {};
    if (data.voiceUseCase) v.use_case = data.voiceUseCase;
    if (data.voiceCallVolume) v.expected_call_volume = data.voiceCallVolume;
    if (data.voiceLanguages?.length) v.languages = data.voiceLanguages;
    details["voice-agent"] = v;
  }

  if (data.services.includes("custom-app")) {
    const ca: Record<string, unknown> = {};
    if (data.customAppDescription)
      ca.one_line_description = data.customAppDescription;
    if (data.customAppUserTypes) ca.user_types = data.customAppUserTypes;
    if (data.customAppKeyFeatures) ca.key_features = data.customAppKeyFeatures;
    if (data.customAppAuth) ca.auth_requirements = data.customAppAuth;
    details["custom-app"] = ca;
  }

  if (data.services.includes("not-sure")) {
    const ns: Record<string, unknown> = {};
    if (data.notSureHeadache) ns.biggest_headache = data.notSureHeadache;
    if (data.notSureAutomate) ns.would_automate = data.notSureAutomate;
    details["not-sure"] = ns;
  }

  return details;
}

/**
 * Vertical-specific follow-up answers, keyed by vertical slug. Only the
 * detected vertical's block is populated.
 */
function buildVerticalDetails(
  data: ProposalFormData,
  industrySlug: string,
): Record<string, unknown> {
  const isVertical = (VERTICAL_SLUGS_WITH_QUESTIONS as readonly string[]).includes(
    industrySlug,
  );
  if (!isVertical) return {};

  const slug = industrySlug as VerticalSlug;
  const out: Record<string, unknown> = {};

  switch (slug) {
    case "msp": {
      const v: Record<string, unknown> = {};
      if (data.mspPsaSystem) v.psa_system = data.mspPsaSystem;
      if (data.mspTicketVolume) v.ticket_volume_bucket = data.mspTicketVolume;
      const clients = toInt(data.mspClientCount);
      if (clients !== undefined) v.client_count = clients;
      const pct = toNum(data.mspRecurringRevenuePct);
      if (pct !== undefined) v.recurring_revenue_percent = pct;
      out.msp = v;
      break;
    }
    case "property-mgmt": {
      const v: Record<string, unknown> = {};
      const doors = toInt(data.propertyDoorCount);
      if (doors !== undefined) v.door_count = doors;
      if (data.propertyPortfolioType)
        v.portfolio_type = data.propertyPortfolioType;
      if (typeof data.propertyTenantPortalNeeded === "boolean")
        v.tenant_portal_needed = data.propertyTenantPortalNeeded;
      out["property-mgmt"] = v;
      break;
    }
    case "home-services": {
      const v: Record<string, unknown> = {};
      if (data.homeServiceTrades?.length) v.trades = data.homeServiceTrades;
      if (data.homeServiceJobVolume)
        v.jobs_per_month_bucket = data.homeServiceJobVolume;
      if (data.homeServiceDispatchTool)
        v.dispatching_tool = data.homeServiceDispatchTool;
      out["home-services"] = v;
      break;
    }
    case "title-insurance": {
      const v: Record<string, unknown> = {};
      const deals = toInt(data.titleDealsPerMonth);
      if (deals !== undefined) v.deals_per_month = deals;
      const offices = toInt(data.titleOfficeCount);
      if (offices !== undefined) v.offices = offices;
      out["title-insurance"] = v;
      break;
    }
    case "professional-services": {
      const v: Record<string, unknown> = {};
      if (data.profPracticeArea) v.practice_area = data.profPracticeArea;
      if (typeof data.profBillableHoursTracked === "boolean")
        v.billable_hours_tracked = data.profBillableHoursTracked;
      if (typeof data.profClientPortalNeeded === "boolean")
        v.client_portal_needed = data.profClientPortalNeeded;
      out["professional-services"] = v;
      break;
    }
    case "real-estate": {
      const v: Record<string, unknown> = {};
      if (data.realEstateTeamType) v.team_type = data.realEstateTeamType;
      const agents = toInt(data.realEstateAgentCount);
      if (agents !== undefined) v.agent_count = agents;
      if (typeof data.realEstateMlsIntegrationNeeded === "boolean")
        v.mls_integration_needed = data.realEstateMlsIntegrationNeeded;
      out["real-estate"] = v;
      break;
    }
    case "startup": {
      const v: Record<string, unknown> = {};
      if (data.startupStage) v.stage = data.startupStage;
      const runway = toInt(data.startupRunwayMonths);
      if (runway !== undefined) v.runway_months = runway;
      if (data.startupKeyMetric) v.key_metric = data.startupKeyMetric;
      out.startup = v;
      break;
    }
    case "pe-portfolio": {
      const v: Record<string, unknown> = {};
      const co = toInt(data.pePortfolioCompanyCount);
      if (co !== undefined) v.portfolio_company_count = co;
      if (typeof data.peUnifiedReportingRequired === "boolean")
        v.unified_reporting_required = data.peUnifiedReportingRequired;
      out["pe-portfolio"] = v;
      break;
    }
  }

  return out;
}

/**
 * Normalizes the full form payload into the shape the `proposals` Supabase
 * table expects. One row per submission.
 */
export function buildSupabaseRow(
  data: ProposalFormData,
  utm: UtmParams = {},
) {
  const industrySlug = INDUSTRY_LABEL_TO_SLUG[data.industry] ?? "";
  const estimatedValue = calculateEstimatedValue(data);
  const leadValueTag = getLeadValueTag(estimatedValue);
  const tags = buildTags(data, leadValueTag);
  const serviceDetails = buildServiceDetails(data);
  const verticalDetails = buildVerticalDetails(data, industrySlug);

  return {
    status: "submitted" as const,
    source: "asksaul-proposal-builder",
    referrer: utm.referrer ?? null,
    utm_source: utm.utm_source ?? null,
    utm_medium: utm.utm_medium ?? null,
    utm_campaign: utm.utm_campaign ?? null,
    utm_content: utm.utm_content ?? null,
    utm_term: utm.utm_term ?? null,

    services: data.services,
    industry_slug: industrySlug || null,
    industry_label: data.industry,

    business_name: data.businessName,
    business_website: data.businessWebsite ?? null,
    team_size: data.teamSize,
    revenue_range: data.revenueRange ?? null,
    monthly_spend: data.monthlySpend ?? null,
    current_tools: data.currentTools ?? [],
    compliance_needs: data.complianceNeeds ?? [],
    role_in_company: data.roleInCompany ?? null,
    decision_maker: data.decisionMaker ?? "unspecified",

    contact_first_name: data.firstName,
    contact_last_name: data.lastName ?? null,
    contact_email: data.email,
    contact_phone: data.phone,
    preferred_contact: data.preferredContact,

    timeline: data.timeline,
    hard_deadline: data.hardDeadline || null,
    budget: data.budget ?? null,
    success_metrics: data.successMetrics ?? null,
    notes: data.notes ?? null,

    sms_consent: data.smsConsent ?? false,
    marketing_sms_opt_in: data.marketingSmsOptIn ?? false,

    estimated_value_usd: estimatedValue,
    lead_value_tag: leadValueTag,
    tags,

    service_details: serviceDetails,
    vertical_details: verticalDetails,

    ghl_sync_status: "pending" as const,
  };
}

/**
 * Thin legacy GHL webhook payload. Matches the previous shape so existing GHL
 * workflows keyed on the old keys keep working through the cutover.
 */
export function buildGhlWebhookPayload(
  data: ProposalFormData,
  proposalId: string,
) {
  const estimatedValue = calculateEstimatedValue(data);
  const leadValueTag = getLeadValueTag(estimatedValue);
  const tags = buildTags(data, leadValueTag);
  const serviceDetails = buildServiceDetails(data);
  const verticalDetails = buildVerticalDetails(
    data,
    INDUSTRY_LABEL_TO_SLUG[data.industry] ?? "",
  );

  return {
    source: "asksaul-proposal-builder",
    timestamp: new Date().toISOString(),
    proposal_id: proposalId,
    contact: {
      firstName: data.firstName,
      lastName: data.lastName ?? "",
      email: data.email,
      phone: data.phone,
      preferredContact: data.preferredContact,
      role: data.roleInCompany ?? "",
      decisionMaker: data.decisionMaker ?? "unspecified",
    },
    business: {
      name: data.businessName,
      website: data.businessWebsite ?? "",
      industry: data.industry,
      teamSize: data.teamSize,
      revenueRange: data.revenueRange ?? "",
      monthlySpend: data.monthlySpend ?? "",
      complianceNeeds: data.complianceNeeds ?? [],
      currentTools: data.currentTools ?? [],
    },
    services_requested: data.services,
    service_details: serviceDetails,
    vertical_details: verticalDetails,
    timeline: data.timeline,
    hard_deadline: data.hardDeadline ?? "",
    budget: data.budget ?? "",
    success_metrics: data.successMetrics ?? "",
    notes: data.notes ?? "",
    tags,
    estimated_value: estimatedValue,
  };
}
