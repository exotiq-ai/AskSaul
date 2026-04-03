import type { Metadata } from "next";
import { Syne, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/chat/ChatWidget";
import StructuredData from "@/components/seo/StructuredData";

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
  title: {
    default: "AskSaul.ai — AI, Automation & Web Development",
    template: "%s | AskSaul.ai",
  },
  description:
    "Done-for-you AI assistants, custom websites, and marketing automation for businesses that are done duct-taping their tech together. Based in Denver, CO.",
  keywords: [
    "AI automation",
    "OpenClaw setup",
    "AI assistant",
    "web development Denver",
    "marketing automation",
    "GoHighLevel",
    "custom AI chatbot",
  ],
  authors: [{ name: "Gregory Ringler" }],
  creator: "Gregory Ringler",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://asksaul.ai",
    siteName: "AskSaul.ai",
    title: "AskSaul.ai — AI, Automation & Web Development",
    description:
      "Done-for-you AI assistants, custom websites, and marketing automation. Your competitors are automating. You're still doing it manually.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AskSaul.ai — AI, Automation & Web Development",
    description:
      "Done-for-you AI assistants, custom websites, and marketing automation.",
  },
  robots: {
    index: true,
    follow: true,
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
        <StructuredData />
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
