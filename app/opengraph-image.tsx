import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AskSaul.ai | AI, Automation & Web Development";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #0A0A0F 0%, #12121A 50%, #0A0A0F 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Dot pattern overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(0,212,170,0.06) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            display: "flex",
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,212,170,0.08) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 72,
              fontWeight: 800,
              letterSpacing: "-2px",
            }}
          >
            <span style={{ color: "#E8E8ED" }}>Ask</span>
            <span style={{ color: "#00D4AA" }}>Saul</span>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: "#A0A0B8",
              maxWidth: 600,
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            AI Assistants · Custom Websites · Marketing Automation
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 16,
              fontSize: 16,
              color: "#707085",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            asksaul.ai
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
