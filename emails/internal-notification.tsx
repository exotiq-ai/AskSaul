import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import type { ProposalFormData } from "../lib/validation";

// ─── Brand ──────────────────────────────────────────────────────────────────
const brand = {
  obsidian: "#0A0A0F",
  carbon: "#14141A",
  graphite: "#1F1F28",
  cloud: "#F5F5F7",
  slate: "#D4D4DC",
  dim: "#8A8A94",
  cyan: "#00D4AA",
  ice: "#7BD3EA",
  wire: "#2A2A34",
};

const fontStack =
  '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
const displayStack =
  'Syne, "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif';

// ─── Types ──────────────────────────────────────────────────────────────────
export interface InternalNotificationProps extends ProposalFormData {
  proposalId: string;
  createdAt: string;
  estimatedValueUsd: number;
  leadValueTag: string;
  tags: string[];
  adminUrl: string;
}

export const subject = (props: InternalNotificationProps) =>
  `New proposal: ${props.businessName} · ${props.services.join(", ")} · ~$${props.estimatedValueUsd.toLocaleString()}`;

// ─── Styles ─────────────────────────────────────────────────────────────────
const main = {
  backgroundColor: brand.obsidian,
  fontFamily: fontStack,
  margin: 0,
  padding: 0,
};
const container = {
  backgroundColor: brand.carbon,
  border: `1px solid ${brand.wire}`,
  borderRadius: "12px",
  margin: "24px auto",
  maxWidth: "640px",
  padding: "28px",
};
const h1 = {
  color: brand.cloud,
  fontFamily: displayStack,
  fontSize: "24px",
  fontWeight: 600,
  lineHeight: 1.2,
  margin: "0 0 8px",
};
const sub = {
  color: brand.dim,
  fontSize: "13px",
  margin: "0 0 20px",
};
const sectionHeader = {
  color: brand.cyan,
  fontFamily: displayStack,
  fontSize: "13px",
  fontWeight: 600,
  letterSpacing: "0.08em",
  margin: "0 0 10px",
  textTransform: "uppercase" as const,
};
const block = {
  backgroundColor: brand.graphite,
  border: `1px solid ${brand.wire}`,
  borderRadius: "8px",
  margin: "0 0 16px",
  padding: "16px 20px",
};
const row = {
  color: brand.slate,
  fontSize: "14px",
  lineHeight: 1.55,
  margin: "3px 0",
};
const key = { color: brand.dim, fontSize: "12px", textTransform: "uppercase" as const, letterSpacing: "0.05em" };
const valCloud = { color: brand.cloud, fontSize: "14px" };
const button = {
  backgroundColor: brand.cyan,
  borderRadius: "8px",
  color: brand.obsidian,
  fontSize: "14px",
  fontWeight: 600,
  padding: "12px 22px",
  textDecoration: "none",
};
const tag = {
  backgroundColor: brand.wire,
  borderRadius: "4px",
  color: brand.ice,
  display: "inline-block",
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.04em",
  margin: "0 4px 4px 0",
  padding: "2px 8px",
  textTransform: "uppercase" as const,
};
const hr = { borderColor: brand.wire, margin: "24px 0" };

// ─── Helpers ────────────────────────────────────────────────────────────────
const present = (v: unknown): v is string | number =>
  v !== undefined && v !== null && v !== "";

function Field({ label, value }: { label: string; value?: unknown }) {
  if (!present(value)) return null;
  const display =
    Array.isArray(value) && value.length
      ? value.join(", ")
      : typeof value === "boolean"
        ? value
          ? "Yes"
          : "No"
        : String(value);
  return (
    <Text style={row}>
      <span style={key}>{label}: </span>
      <span style={valCloud}>{display}</span>
    </Text>
  );
}

function Missing({ label }: { label: string }) {
  return (
    <Text style={row}>
      <span style={key}>{label}: </span>
      <span style={{ color: brand.dim, fontStyle: "italic" }}>not provided</span>
    </Text>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────
export default function InternalNotification(props: InternalNotificationProps) {
  const {
    proposalId,
    createdAt,
    estimatedValueUsd,
    leadValueTag,
    tags,
    adminUrl,
    services,
    firstName,
    lastName,
    email,
    phone,
    preferredContact,
    roleInCompany,
    decisionMaker,
    businessName,
    businessWebsite,
    industry,
    teamSize,
    revenueRange,
    monthlySpend,
    currentTools,
    complianceNeeds,
    timeline,
    hardDeadline,
    budget,
    successMetrics,
    notes,
  } = props;

  return (
    <Html>
      <Head />
      <Preview>{`${businessName} · ${services.join(", ")} · ~$${estimatedValueUsd.toLocaleString()} · ${leadValueTag}`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New proposal submitted</Heading>
          <Text style={sub}>
            {businessName} · {proposalId} · {createdAt}
          </Text>

          <Section style={{ margin: "0 0 20px" }}>
            <Button style={button} href={adminUrl}>
              Review in admin
            </Button>
          </Section>

          <Section style={block}>
            <Text style={sectionHeader}>Value & tags</Text>
            <Field label="Estimated value" value={`$${estimatedValueUsd.toLocaleString()}`} />
            <Field label="Lead tag" value={leadValueTag} />
            {tags.length ? (
              <Text style={row}>
                <span style={key}>Tags: </span>
                <br />
                {tags.map((t) => (
                  <span key={t} style={tag}>
                    {t}
                  </span>
                ))}
              </Text>
            ) : null}
          </Section>

          <Section style={block}>
            <Text style={sectionHeader}>Contact</Text>
            <Field label="Name" value={[firstName, lastName].filter(Boolean).join(" ")} />
            <Field label="Email" value={email} />
            <Field label="Phone" value={phone} />
            <Field label="Preferred contact" value={preferredContact} />
            <Field label="Role" value={roleInCompany} />
            <Field label="Decision maker" value={decisionMaker} />
          </Section>

          <Section style={block}>
            <Text style={sectionHeader}>Business</Text>
            <Field label="Name" value={businessName} />
            <Field label="Industry" value={industry} />
            <Field label="Team size" value={teamSize} />
            <Field label="Revenue range" value={revenueRange} />
            <Field label="Monthly spend" value={monthlySpend} />
            {present(businessWebsite) ? (
              <Field label="Website" value={businessWebsite} />
            ) : (
              <Missing label="Website" />
            )}
            <Field label="Current tools" value={currentTools} />
            <Field label="Compliance" value={complianceNeeds} />
          </Section>

          <Section style={block}>
            <Text style={sectionHeader}>Services requested</Text>
            {services.map((s) => (
              <ServiceDetails key={s} service={s} props={props} />
            ))}
          </Section>

          <VerticalSection props={props} />

          <Section style={block}>
            <Text style={sectionHeader}>Timeline & budget</Text>
            <Field label="Timeline" value={timeline} />
            <Field label="Hard deadline" value={hardDeadline} />
            <Field label="Budget" value={budget} />
          </Section>

          <Section style={block}>
            <Text style={sectionHeader}>Success & notes</Text>
            <Field label="Success metrics" value={successMetrics} />
            <Field label="Notes" value={notes} />
          </Section>

          <Hr style={hr} />

          <Text style={{ color: brand.dim, fontSize: "11px", whiteSpace: "pre-wrap" as const, fontFamily: "monospace" }}>
            {plainText(props)}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// ─── Service-specific details ───────────────────────────────────────────────
function ServiceDetails({
  service,
  props,
}: {
  service: string;
  props: InternalNotificationProps;
}) {
  return (
    <div style={{ margin: "10px 0 12px", paddingLeft: "10px", borderLeft: `2px solid ${brand.cyan}` }}>
      <Text style={{ ...row, color: brand.cloud, fontWeight: 600 }}>{service}</Text>
      {service === "ai-assistant" && (
        <>
          <Field label="Users" value={props.aiUserCount} />
          <Field label="Platforms" value={props.aiPlatform} />
          <Field label="Help with" value={props.aiHelp} />
          <Field label="Tier" value={props.aiTierPreference} />
          <Field label="Msg volume" value={props.aiMessageVolume} />
          <Field label="Addons" value={props.aiAddons} />
          <Field label="VPS" value={props.aiVpsPreference} />
        </>
      )}
      {service === "website" && (
        <>
          <Field label="Existing site" value={props.websiteExisting} />
          <Field label="Existing URL" value={props.websiteExistingUrl} />
          <Field label="Pages" value={props.websitePages} />
          <Field label="Ecommerce" value={props.websiteEcommerce} />
          <Field label="Ecom platform" value={props.websiteEcommercePlatform} />
          <Field label="CMS" value={props.websiteCms} />
          <Field label="Design" value={props.websiteDesignStatus} />
          <Field label="Content" value={props.websiteContentStatus} />
          <Field label="Domain owned" value={props.websiteDomainOwned} />
          <Field label="Hosting" value={props.websiteHostingPreference} />
          <Field label="Integrations" value={props.websiteIntegrations} />
        </>
      )}
      {service === "marketing" && (
        <>
          <Field label="Tools" value={props.marketingTools} />
          <Field label="Pain" value={props.marketingPain} />
          <Field label="List size" value={props.marketingListSize} />
          <Field label="Email volume" value={props.marketingEmailVolume} />
          <Field label="SMS volume" value={props.marketingSmsVolume} />
          <Field label="Team seats" value={props.marketingTeamSeats} />
          <Field label="Review sources" value={props.marketingReviewSources} />
          <Field label="Automation" value={props.marketingAutomationComplexity} />
        </>
      )}
      {service === "automation" && (
        <>
          <Field label="Processes" value={props.automationProcesses} />
          <Field label="Tools" value={props.automationTools} />
        </>
      )}
      {service === "voice-agent" && (
        <>
          <Field label="Use case" value={props.voiceUseCase} />
          <Field label="Call volume" value={props.voiceCallVolume} />
          <Field label="Languages" value={props.voiceLanguages} />
        </>
      )}
      {service === "custom-app" && (
        <>
          <Field label="Description" value={props.customAppDescription} />
          <Field label="User types" value={props.customAppUserTypes} />
          <Field label="Key features" value={props.customAppKeyFeatures} />
          <Field label="Auth" value={props.customAppAuth} />
        </>
      )}
      {service === "not-sure" && (
        <>
          <Field label="Headache" value={props.notSureHeadache} />
          <Field label="Would automate" value={props.notSureAutomate} />
        </>
      )}
    </div>
  );
}

// ─── Vertical section ───────────────────────────────────────────────────────
function VerticalSection({ props }: { props: InternalNotificationProps }) {
  const industry = props.industry;
  const hasVertical =
    industry.includes("MSP") ||
    industry.includes("Property") ||
    industry.includes("Home Services") ||
    industry.includes("Title") ||
    industry.includes("Professional") ||
    industry.includes("Real Estate") ||
    industry.includes("Startup") ||
    industry.includes("PE");

  if (!hasVertical) return null;

  return (
    <Section style={block}>
      <Text style={sectionHeader}>Vertical details</Text>
      {industry.includes("MSP") && (
        <>
          <Field label="PSA" value={props.mspPsaSystem} />
          <Field label="Ticket volume" value={props.mspTicketVolume} />
          <Field label="Clients" value={props.mspClientCount} />
          <Field label="MRR %" value={props.mspRecurringRevenuePct} />
        </>
      )}
      {industry.includes("Property") && (
        <>
          <Field label="Doors" value={props.propertyDoorCount} />
          <Field label="Portfolio" value={props.propertyPortfolioType} />
          <Field label="Tenant portal" value={props.propertyTenantPortalNeeded} />
        </>
      )}
      {industry.includes("Home Services") && (
        <>
          <Field label="Trades" value={props.homeServiceTrades} />
          <Field label="Jobs" value={props.homeServiceJobVolume} />
          <Field label="Dispatch tool" value={props.homeServiceDispatchTool} />
        </>
      )}
      {industry.includes("Title") && (
        <>
          <Field label="Deals/mo" value={props.titleDealsPerMonth} />
          <Field label="Offices" value={props.titleOfficeCount} />
        </>
      )}
      {industry.includes("Professional") && (
        <>
          <Field label="Practice area" value={props.profPracticeArea} />
          <Field label="Billable tracked" value={props.profBillableHoursTracked} />
          <Field label="Client portal" value={props.profClientPortalNeeded} />
        </>
      )}
      {industry.includes("Real Estate") && (
        <>
          <Field label="Team type" value={props.realEstateTeamType} />
          <Field label="Agents" value={props.realEstateAgentCount} />
          <Field label="MLS" value={props.realEstateMlsIntegrationNeeded} />
        </>
      )}
      {industry.includes("Startup") && (
        <>
          <Field label="Stage" value={props.startupStage} />
          <Field label="Runway (mo)" value={props.startupRunwayMonths} />
          <Field label="Key metric" value={props.startupKeyMetric} />
        </>
      )}
      {industry.includes("PE") && (
        <>
          <Field label="Portfolio count" value={props.pePortfolioCompanyCount} />
          <Field label="Unified reporting" value={props.peUnifiedReportingRequired} />
        </>
      )}
    </Section>
  );
}

// ─── Plain-text alt ─────────────────────────────────────────────────────────
function plainText(p: InternalNotificationProps): string {
  return [
    `NEW PROPOSAL — ${p.businessName} (${p.proposalId})`,
    `${p.createdAt}`,
    ``,
    `Contact: ${p.firstName} ${p.lastName ?? ""} <${p.email}> ${p.phone}`,
    `Prefer: ${p.preferredContact} · Role: ${p.roleInCompany ?? "-"} · Decision: ${p.decisionMaker ?? "-"}`,
    ``,
    `Business: ${p.businessName} · ${p.industry} · team ${p.teamSize}`,
    `Website: ${p.businessWebsite || "none"}`,
    ``,
    `Services: ${p.services.join(", ")}`,
    `Timeline: ${p.timeline}${p.hardDeadline ? ` (hard: ${p.hardDeadline})` : ""}`,
    `Budget: ${p.budget ?? "-"} · Est: $${p.estimatedValueUsd.toLocaleString()} (${p.leadValueTag})`,
    ``,
    `Tags: ${p.tags.join(", ")}`,
    `Admin: ${p.adminUrl}`,
  ].join("\n");
}
