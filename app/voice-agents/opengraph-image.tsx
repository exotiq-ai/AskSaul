import { OG_SIZE, renderOg } from "@/lib/og";

export const alt = "AskSaul AI receptionist for Front Range roofing and HVAC";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOg({ eyebrow: "Front Range roofing + HVAC", title: "We make your phone ring. Saul makes sure it gets answered." });
}
