import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

const BARS = [30, 55, 80, 45, 95, 65, 100, 50, 85, 40, 70, 95, 55, 75, 35, 90, 60, 45, 80, 30, 65, 90];

/** Shared branded social card: eyebrow, headline, and a waveform. */
export function renderOg({ eyebrow, title, footer = "asksaul.ai" }: { eyebrow: string; title: string; footer?: string }) {
  const size = title.length > 70 ? 54 : title.length > 45 ? 64 : 76;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "radial-gradient(circle at 20% 0%, rgba(0,212,170,0.22), transparent 55%), #0A0A0F",
          fontFamily: "system-ui, sans-serif",
          color: "#F3F5FA",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 800, letterSpacing: "-1px" }}>
            <span>Ask</span>
            <span style={{ color: "#00D4AA" }}>Saul</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#00D4AA",
              border: "2px solid rgba(0,212,170,0.4)",
              borderRadius: 999,
              padding: "10px 24px",
            }}
          >
            {eyebrow}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: size, fontWeight: 800, lineHeight: 1.05, letterSpacing: "-2px", maxWidth: 1000 }}>
          {title}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, height: 56 }}>
            {BARS.map((h, i) => (
              <div key={i} style={{ width: 7, height: `${h}%`, borderRadius: 4, background: "linear-gradient(#4AC6E8, #00D4AA)" }} />
            ))}
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#9399AA" }}>{footer}</div>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
