import { OG_SIZE, renderOg } from "@/lib/og";

export const alt = "Free Missed-Call and Visibility Audit for roofing and HVAC";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOg({ eyebrow: "Free audit", title: "See where your calls are leaking." });
}
