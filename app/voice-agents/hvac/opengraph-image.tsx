import { OG_SIZE, renderOg } from "@/lib/og";

export const alt = "AI receptionist for Front Range HVAC companies";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOg({ eyebrow: "Front Range HVAC", title: "Every no-heat call gets answered." });
}
