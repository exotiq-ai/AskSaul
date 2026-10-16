import { ImageResponse } from "next/og";

// 512px brand mark for structured data (Google needs a logo of at least 112px).
export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          background: "#0A0A0F",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          fontSize: 300,
          fontWeight: 800,
          color: "#00D4AA",
          borderRadius: 96,
        }}
      >
        S
      </div>
    ),
    { width: 512, height: 512 }
  );
}
