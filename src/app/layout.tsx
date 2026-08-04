import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BackdropFx } from "@/components/layout/backdrop-fx";
import { siteConfig } from "@/lib/site-config";

// A close, freely-licensed analog for the premium-grotesque body font used by
// the current design reference — same warm-geometric feel, not the same file.
const bodySans = Plus_Jakarta_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.platform} — ${siteConfig.name}`,
    template: `%s · ${siteConfig.platform}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.platform} — ${siteConfig.name}`,
    description: siteConfig.description,
    siteName: siteConfig.platform,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.platform} — ${siteConfig.name}`,
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bodySans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <BackdropFx />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
