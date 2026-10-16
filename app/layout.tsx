import type { Metadata } from "next";
import { Syne, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/chat/ChatWidget";
import AnalyticsScripts from "@/components/analytics/AnalyticsScripts";
import ConversionTracker from "@/components/analytics/ConversionTracker";
import StructuredData from "@/components/seo/StructuredData";
import { DEFAULT_OG_IMAGE, PAGES, SITE_NAME, SITE_URL } from "@/lib/seo";

const syne = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: PAGES["/"].title,
    template: "%s | AskSaul.ai",
  },
  description: PAGES["/"].description,
  applicationName: "AskSaul.ai",
  category: "technology",
  keywords: [
    "AI receptionist",
    "AI receptionist for HVAC",
    "AI receptionist for roofing",
    "missed call answering service",
    "after-hours answering service Denver",
    "AI voice agent",
    "local SEO Front Range",
    "AI search optimization",
    "AI automation for small business",
    "web development Denver",
  ],
  authors: [{ name: "Gregory Ringler", url: `${SITE_URL}/about` }],
  creator: "Gregory Ringler",
  publisher: "Ask Saul Inc.",
  formatDetection: { telephone: true, email: true, address: false },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: PAGES["/"].social,
    description: PAGES["/"].description,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGES["/"].social,
    description: PAGES["/"].description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  // No site-wide canonical: each page declares its own (lib/seo.ts). A canonical
  // here was inherited by every page and pointed them all at the homepage.
  alternates: {
    types: { "application/rss+xml": "/blog/feed.xml" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${jakartaSans.variable} ${jetbrainsMono.variable} h-full`}
      style={{ backgroundColor: "#0A0A0F" }}
    >
      <body className="min-h-full flex flex-col bg-obsidian text-cloud antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-cyan focus:text-obsidian focus:rounded-lg focus:font-semibold focus:text-sm"
        >
          Skip to main content
        </a>
        <StructuredData />
        <AnalyticsScripts />
        <ConversionTracker />
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
