import { OG_SIZE, renderOg } from "@/lib/og";

export const alt = "AI receptionist for Front Range roofing companies";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOg({ eyebrow: "Front Range roofing", title: "Every storm call answered, even when you're on a roof." });
}
