import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const alt = `${siteConfig.platform} — ${siteConfig.name}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0a0b0d",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "#2dd4bf",
            fontSize: 28,
            textTransform: "uppercase",
            letterSpacing: 4,
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: 999, backgroundColor: "#2dd4bf", display: "flex" }} />
          Engineering &amp; Cybersecurity
        </div>
        <div style={{ display: "flex", fontSize: 100, fontWeight: 600, color: "#e8eaed", marginTop: 28 }}>
          {siteConfig.name}
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "#9aa0a6", marginTop: 24, maxWidth: 960 }}>
          {siteConfig.description}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#2dd4bf", marginTop: 44 }}>{siteConfig.motto}</div>
      </div>
    ),
    { ...size },
  );
}
