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
          backgroundColor: "#ffffff",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "#3559c7",
            fontSize: 28,
            textTransform: "uppercase",
            letterSpacing: 4,
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: 999, backgroundColor: "#3559c7", display: "flex" }} />
          Engineering &amp; Cybersecurity
        </div>
        <div style={{ display: "flex", fontSize: 100, fontWeight: 600, color: "#09122a", marginTop: 28 }}>
          {siteConfig.name}
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "#848894", marginTop: 24, maxWidth: 960 }}>
          {siteConfig.description}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#3559c7", marginTop: 44 }}>{siteConfig.motto}</div>
      </div>
    ),
    { ...size },
  );
}
