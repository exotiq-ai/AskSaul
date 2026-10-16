import { OG_SIZE, renderOg } from "@/lib/og";

export const alt = "AskSaul.ai: AI receptionists, automation, and websites for small business";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOg({ eyebrow: "AI for small business", title: "AI that does the work your team keeps doing by hand." });
}
