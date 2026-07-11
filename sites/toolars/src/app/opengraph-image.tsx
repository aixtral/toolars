import { ImageResponse } from "next/og";

export const alt = "Toolars — All tools. One workspace.";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0f172a 0%, #134e4a 50%, #059669 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#10b981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 800
            }}
          >
            T
          </div>
          <span style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em" }}>Toolars</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            maxWidth: 900
          }}
        >
          <span>All tools.</span>
          <span>One workspace.</span>
        </div>
        <div style={{ fontSize: 28, color: "#94a3b8", marginTop: 24, maxWidth: 800, lineHeight: 1.4 }}>
          Calculators, AI tools, PDF utilities, and workflows — local-first, free to start.
        </div>
      </div>
    ),
    { ...size }
  );
}
