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
export interface ConfirmationEmailProps {
  firstName: string;
  businessName: string;
  services: string[];
  industry: string;
  timeline: string;
  estimatedValueRange?: string;
  siteUrl: string;
}

export const subject = (props: ConfirmationEmailProps) =>
  `Got it, ${props.firstName}. Saul is on it.`;

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
  maxWidth: "560px",
  padding: "32px",
};
const heading = {
  color: brand.cloud,
  fontFamily: displayStack,
  fontSize: "28px",
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
const card = {
  backgroundColor: brand.graphite,
  border: `1px solid ${brand.wire}`,
  borderRadius: "8px",
  padding: "16px 20px",
  margin: "20px 0",
};
const cardLabel = {
  color: brand.cyan,
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.08em",
  margin: "0 0 8px",
  textTransform: "uppercase" as const,
};
const bullet = {
  color: brand.slate,
  fontSize: "14px",
  lineHeight: 1.6,
  margin: "4px 0",
};
const button = {
  backgroundColor: brand.cyan,
  borderRadius: "8px",
  color: brand.obsidian,
  fontSize: "15px",
  fontWeight: 600,
  padding: "12px 24px",
  textDecoration: "none",
};
const hr = { borderColor: brand.wire, margin: "24px 0" };

// ─── Component ──────────────────────────────────────────────────────────────
export default function ConfirmationEmail({
  firstName,
  businessName,
  services,
  industry,
  timeline,
  estimatedValueRange,
  siteUrl,
}: ConfirmationEmailProps) {
  const previewText = `We got your submission for ${businessName}. Saul is reviewing and will have a quote in 24 hours.`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Got it, {firstName}. Saul is on it.</Heading>

          <Text style={paragraph}>
            Thanks for the detail on {businessName}. It came through clean and
            Saul is already digging into the specifics.
          </Text>

          <Text style={paragraph}>
            Here is what happens next. Saul reviews everything you submitted,
            sanity-checks it against similar builds we have shipped, and puts
            together a scoped quote. You should see that quote land in your
            inbox within 24 hours, signed off by Gregory.
          </Text>

          <Section style={card}>
            <Text style={cardLabel}>What Saul has on you so far</Text>
            <Text style={bullet}>
              <strong style={{ color: brand.cloud }}>Services:</strong>{" "}
              {services.length ? services.join(", ") : "None selected"}
            </Text>
            <Text style={bullet}>
              <strong style={{ color: brand.cloud }}>Industry:</strong>{" "}
              {industry}
            </Text>
            <Text style={bullet}>
              <strong style={{ color: brand.cloud }}>Timeline:</strong>{" "}
              {timeline}
            </Text>
            {estimatedValueRange ? (
              <Text style={bullet}>
                <strong style={{ color: brand.cloud }}>
                  Estimated range:
                </strong>{" "}
                {estimatedValueRange}
              </Text>
            ) : null}
          </Section>

          <Text style={paragraph}>
            If something above looks wrong, or you want to flag context Saul
            should know before the quote lands, just reply to this email.
            Gregory reads every reply.
          </Text>

          <Section style={{ margin: "28px 0 16px", textAlign: "center" as const }}>
            <Button style={button} href={`${siteUrl}/contact`}>
              Book a call
            </Button>
          </Section>

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
