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
export interface ProposalEmailProps {
  firstName: string;
  businessName: string;
  proposalHtml: string;
  proposalMarkdown: string;
  priceUsd: number;
  priceModel: string;
  timelineWeeks: number;
  acceptUrl?: string;
  siteUrl: string;
}

export const subject = (props: ProposalEmailProps) =>
  `${props.businessName}: proposal from AskSaul`;

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
  maxWidth: "620px",
  padding: "32px",
};
const heading = {
  color: brand.cloud,
  fontFamily: displayStack,
  fontSize: "26px",
  fontWeight: 600,
  lineHeight: 1.2,
  margin: "0 0 16px",
};
const paragraph = {
  color: brand.slate,
  fontSize: "15px",
  lineHeight: 1.6,
  margin: "0 0 16px",
};
const muted = { ...paragraph, color: brand.dim, fontSize: "13px" };
const priceBox = {
  backgroundColor: brand.graphite,
  border: `1px solid ${brand.wire}`,
  borderRadius: "8px",
  margin: "20px 0",
  padding: "20px 24px",
};
const priceLabel = {
  color: brand.cyan,
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.08em",
  margin: "0 0 6px",
  textTransform: "uppercase" as const,
};
const priceValue = {
  color: brand.cloud,
  fontFamily: displayStack,
  fontSize: "28px",
  fontWeight: 600,
  margin: "0 0 4px",
};
const priceMeta = { color: brand.dim, fontSize: "13px", margin: 0 };
const proposalBody = {
  backgroundColor: brand.obsidian,
  border: `1px solid ${brand.wire}`,
  borderRadius: "8px",
  color: brand.slate,
  fontSize: "14px",
  lineHeight: 1.65,
  margin: "20px 0",
  padding: "20px 24px",
};
const primary = {
  backgroundColor: brand.cyan,
  borderRadius: "8px",
  color: brand.obsidian,
  fontSize: "15px",
  fontWeight: 600,
  padding: "12px 24px",
  textDecoration: "none",
};
const secondary = {
  backgroundColor: "transparent",
  border: `1px solid ${brand.wire}`,
  borderRadius: "8px",
  color: brand.cloud,
  fontSize: "15px",
  fontWeight: 600,
  padding: "11px 23px",
  textDecoration: "none",
};
const hr = { borderColor: brand.wire, margin: "24px 0" };

// ─── Component ──────────────────────────────────────────────────────────────
export default function ProposalEmail({
  firstName,
  businessName,
  proposalHtml,
  priceUsd,
  priceModel,
  timelineWeeks,
  acceptUrl,
  siteUrl,
}: ProposalEmailProps) {
  const previewText = `Your AskSaul proposal for ${businessName}: $${priceUsd.toLocaleString()} ${priceModel}, ${timelineWeeks} weeks.`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>
            {firstName}, your {businessName} proposal
          </Heading>

          <Text style={paragraph}>
            Here is the scope Saul put together for {businessName}, reviewed and
            signed off by Gregory. The detail is below. The top-line is here.
          </Text>

          <Section style={priceBox}>
            <Text style={priceLabel}>Investment</Text>
            <Text style={priceValue}>
              ${priceUsd.toLocaleString()}
              <span style={{ color: brand.dim, fontSize: "15px", fontWeight: 400 }}>
                {" "}
                {priceModel}
              </span>
            </Text>
            <Text style={priceMeta}>Timeline: {timelineWeeks} weeks</Text>
          </Section>

          <Section
            style={proposalBody}
            dangerouslySetInnerHTML={{ __html: proposalHtml }}
          />

          <Section style={{ margin: "28px 0 8px", textAlign: "center" as const }}>
            {acceptUrl ? (
              <Button style={{ ...primary, marginRight: "10px" }} href={acceptUrl}>
                Accept proposal
              </Button>
            ) : null}
            <Button
              style={secondary}
              href={`mailto:hello@asksaul.ai?subject=Questions on ${encodeURIComponent(businessName)} proposal`}
            >
              Reply with questions
            </Button>
          </Section>

          <Text style={paragraph}>
            Nothing is locked in until you say the word. If a line item needs to
            shift, reply to this email and Gregory will revise.
          </Text>

          <Hr style={hr} />

          <Text style={muted}>
            Gregory Ringler
            <br />
            AskSaul, Denver CO
            <br />
            <Link href={siteUrl} style={{ color: brand.ice }}>
              {siteUrl.replace(/^https?:\/\//, "")}
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
