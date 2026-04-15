import { marked } from "marked";
import type { Deliverable } from "./schemas.js";

marked.setOptions({ gfm: true, breaks: false });

export interface RenderDraftParams {
  businessName: string;
  contactFirstName: string;
  scopeSummary: string;
  deliverables: Deliverable[];
  priceUsd: number;
  priceModel: "fixed" | "retainer" | "hybrid";
  timelineWeeks: number;
  terms?: string;
}

export interface RenderedDraft {
  markdown: string;
  html: string;
}

function formatPrice(cents: number, model: "fixed" | "retainer" | "hybrid") {
  const usd = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents);
  if (model === "retainer") return `${usd} / month`;
  if (model === "hybrid") return `${usd} (hybrid: setup + retainer)`;
  return `${usd} fixed`;
}

export function renderDraft(p: RenderDraftParams): RenderedDraft {
  const deliverablesMd = p.deliverables
    .map(
      (d) =>
        `- **${d.title}**${d.description ? ` — ${d.description}` : ""}`
    )
    .join("\n");

  const markdown = [
    `# Proposal for ${p.businessName}`,
    ``,
    `Hi ${p.contactFirstName},`,
    ``,
    `Thanks for reaching out to AskSaul. Here's a tailored proposal based on what you shared.`,
    ``,
    `## Scope`,
    ``,
    p.scopeSummary,
    ``,
    `## Deliverables`,
    ``,
    deliverablesMd,
    ``,
    `## Investment`,
    ``,
    `**${formatPrice(p.priceUsd, p.priceModel)}**`,
    ``,
    `## Timeline`,
    ``,
    `Approximately **${p.timelineWeeks} week${p.timelineWeeks === 1 ? "" : "s"}** from kickoff.`,
    ``,
    ...(p.terms ? [`## Terms`, ``, p.terms, ``] : []),
    `---`,
    ``,
    `Reply to this email and I'll get you on the calendar to lock scope and kick off.`,
    ``,
    `— Gregory, AskSaul`,
  ].join("\n");

  const body = marked.parse(markdown, { async: false }) as string;
  const html = wrapHtml(body, p.businessName);
  return { markdown, html };
}

function wrapHtml(body: string, businessName: string): string {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>AskSaul Proposal — ${escapeHtml(businessName)}</title>
  </head>
  <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;line-height:1.55;color:#111;max-width:640px;margin:32px auto;padding:0 20px;">
    ${body}
  </body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
