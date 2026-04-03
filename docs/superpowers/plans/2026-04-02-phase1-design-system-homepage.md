# AskSaul Phase 1: Design System & Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Phase 1 of AskSaul.ai — design system, root layout, reusable UI components, layout components, and the full homepage.

**Architecture:** Tailwind 4 CSS-variable design tokens in globals.css; Next.js App Router with server components by default, 'use client' only where Framer Motion or interactivity requires it; fontsource for Clash Display (not on Google Fonts), next/font/google for Plus Jakarta Sans + JetBrains Mono.

**Tech Stack:** Next.js 16.2.2 (App Router), React 19, TypeScript, Tailwind CSS 4, Framer Motion 12, Lucide React 1.7, @fontsource/clash-display

---

## File Map

**Modified:**
- `app/globals.css` — Tailwind 4 @theme tokens, font imports, base styles
- `app/layout.tsx` — Root layout: fonts, metadata, dark bg
- `app/page.tsx` — Homepage assembly

**Created:**
- `lib/constants.ts` — Brand colors, service data, metrics, nav links
- `components/ui/Button.tsx` — primary/secondary/ghost variants
- `components/ui/Card.tsx` — glass-morphism card
- `components/ui/Input.tsx` — dark themed input
- `components/ui/Badge.tsx` — tag/label component
- `components/ui/AnimatedSection.tsx` — fade-up scroll animation (client)
- `components/ui/Accordion.tsx` — expand/collapse FAQ (client)
- `components/layout/Navbar.tsx` — sticky glass nav with dropdown (client)
- `components/layout/MobileNav.tsx` — slide-in overlay (client)
- `components/layout/Footer.tsx` — 4-column footer
- `components/home/Hero.tsx` — dark hero with dot pattern
- `components/home/ProblemStatement.tsx` — 3 pain points
- `components/home/ServiceLanes.tsx` — 3 lane cards
- `components/home/SaulDemo.tsx` — demo teaser
- `components/home/PortfolioPreview.tsx` — 4 portfolio cards with screenshots
- `components/home/SocialProof.tsx` — metrics bar
- `components/home/FinalCTA.tsx` — bottom CTA

---

## Task 1: Install @fontsource/clash-display

**Files:**
- Modify: `package.json`

- [ ] Run install:
```bash
npm install @fontsource/clash-display
```
Expected: Added to node_modules, package.json updated with `"@fontsource/clash-display": "^..."`.

---

## Task 2: Design System — globals.css

**Files:**
- Modify: `app/globals.css`

- [ ] Replace globals.css with Tailwind 4 @theme tokens + base styles:

```css
@import "tailwindcss";
@import "@fontsource/clash-display/400.css";
@import "@fontsource/clash-display/500.css";
@import "@fontsource/clash-display/600.css";
@import "@fontsource/clash-display/700.css";

@theme inline {
  /* Colors */
  --color-obsidian: #0A0A0F;
  --color-carbon: #12121A;
  --color-graphite: #1A1A24;
  --color-cyan: #00D4AA;
  --color-ice: #4AC6E8;
  --color-cyan-glow: rgba(0, 212, 170, 0.15);
  --color-cloud: #E8E8ED;
  --color-slate: #8888A0;
  --color-dim: #555566;
  --color-wire: #2A2A38;
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-error: #EF4444;

  /* Fonts */
  --font-display: "Clash Display", sans-serif;
  --font-body: var(--font-jakarta), sans-serif;
  --font-mono: var(--font-jetbrains), monospace;

  /* Spacing (8px grid) */
  --spacing: 0.25rem; /* base unit = 4px, tailwind default. 8px = 2 units */
}

html {
  background-color: #0A0A0F;
  color-scheme: dark;
}

body {
  background-color: #0A0A0F;
  color: #E8E8ED;
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Dot pattern utility */
.dot-pattern {
  background-image: radial-gradient(circle, rgba(0, 212, 170, 0.04) 1px, transparent 1px);
  background-size: 24px 24px;
}

/* Accent glow utility */
.glow-cyan {
  box-shadow: 0 0 20px rgba(0, 212, 170, 0.2), 0 0 40px rgba(0, 212, 170, 0.08);
}

.glow-cyan-sm {
  box-shadow: 0 0 10px rgba(0, 212, 170, 0.15);
}
```

- [ ] Commit:
```bash
git add app/globals.css
git commit -m "feat: add design system tokens to globals.css"
```

---

## Task 3: Root Layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] Replace layout.tsx:

```tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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
      className={`${jakartaSans.variable} ${jetbrainsMono.variable} h-full`}
      style={{ backgroundColor: "#0A0A0F" }}
    >
      <body className="min-h-full flex flex-col bg-obsidian text-cloud antialiased">
        {children}
      </body>
    </html>
  );
}
```

- [ ] Commit:
```bash
git add app/layout.tsx
git commit -m "feat: root layout with fonts and AskSaul metadata"
```

---

## Task 4: Constants

**Files:**
- Create: `lib/constants.ts`

- [ ] Create lib/constants.ts:

```ts
export const BRAND = {
  name: "AskSaul",
  domain: "asksaul.ai",
  tagline: "Your competitors are automating. You are still doing it manually.",
  email: "1.gregory.ringler@gmail.com",
  phone: "970.343.9634",
  location: "Denver, CO",
};

export const NAV_LINKS = [
  { label: "Services", href: "/services", hasDropdown: true },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

export const SERVICE_LANES = [
  {
    id: "ai",
    title: "AI & Automation",
    tagline: "Make Saul work for your business",
    description:
      "Self-hosted AI assistants, chatbots, workflow automation, and CRM intelligence. Your data stays yours.",
    href: "/ai-automation",
    icon: "Bot",
    features: ["OpenClaw deployments", "AI chatbots", "Workflow automation", "CRM intelligence"],
  },
  {
    id: "web",
    title: "Websites & Apps",
    tagline: "A site that actually converts",
    description:
      "Custom websites and web apps built mobile-first, SEO-optimized, and engineered to turn visitors into leads.",
    href: "/web-development",
    icon: "Code2",
    features: ["Custom websites", "Web applications", "SEO optimization", "Redesigns"],
  },
  {
    id: "marketing",
    title: "Marketing Engine",
    tagline: "Your entire marketing stack, handled",
    description:
      "Full GoHighLevel white-label setup. CRM, email/SMS sequences, funnels, pipelines, reputation management.",
    href: "/marketing-engine",
    icon: "TrendingUp",
    features: ["GHL white-label", "Email + SMS sequences", "Lead gen funnels", "Pipeline management"],
  },
];

export const METRICS = [
  { value: "1,120+", label: "commits shipped" },
  { value: "5", label: "production platforms built" },
  { value: "Solo", label: "founder, zero outsourced dev" },
  { value: "8 months", label: "idea to full platform" },
];

export const PORTFOLIO_PROJECTS = [
  {
    id: "driveexotiq",
    title: "DriveExotiq.com",
    description: "Consumer rental marketplace. Conversion-optimized with AI-powered pricing and full search and booking flow.",
    url: "https://driveexotiq.com",
    images: ["/images/portfolio/driveexotiq-hero.jpg", "/images/portfolio/driveexotiq-marketplace.jpg"],
    tags: ["Next.js", "Marketplace", "AI Pricing"],
  },
  {
    id: "exotiq",
    title: "Exotiq.ai",
    description: "Marketing site and brand hub. Gulf livery aesthetic, FleetCopilot demo, and AI-optimized blog.",
    url: "https://exotiq.ai",
    images: ["/images/portfolio/exotiq-fleetcopilot.jpg", "/images/portfolio/exotiq-blog-header.jpg"],
    tags: ["Next.js", "AI", "Brand Hub"],
  },
  {
    id: "polaris",
    title: "Polaris Estate",
    description: "AI-powered luxury real estate platform designed for ultra-high-net-worth clients.",
    url: "#",
    images: [],
    tags: ["React", "Real Estate", "AI"],
    comingSoon: true,
  },
  {
    id: "lous-hvac",
    title: "Lou's HVAC",
    description: "Full business website with SEO optimization, service pages, review integration, and bilingual support.",
    url: "#",
    images: [],
    tags: ["Next.js", "SEO", "Local Business"],
    comingSoon: true,
  },
];
```

- [ ] Commit:
```bash
git add lib/constants.ts
git commit -m "feat: brand constants and service data"
```

---

## Task 5: UI Components

**Files:**
- Create: `components/ui/Button.tsx`
- Create: `components/ui/Card.tsx`
- Create: `components/ui/Input.tsx`
- Create: `components/ui/Badge.tsx`
- Create: `components/ui/AnimatedSection.tsx`
- Create: `components/ui/Accordion.tsx`

- [ ] Create Button.tsx:

```tsx
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/60 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

    const variants = {
      primary:
        "bg-cyan text-obsidian rounded-lg hover:bg-cyan/90 hover:shadow-[0_0_20px_rgba(0,212,170,0.3)] active:scale-[0.98]",
      secondary:
        "bg-ice/10 text-ice border border-ice/30 rounded-lg hover:bg-ice/20 hover:border-ice/60 active:scale-[0.98]",
      ghost:
        "text-cloud border border-wire rounded-lg hover:border-cyan/40 hover:text-cyan hover:bg-cyan/5 active:scale-[0.98]",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm rounded-md",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
```

- [ ] Create Card.tsx:

```tsx
import { type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export default function Card({ glow = false, className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`
        bg-carbon/80 backdrop-blur-sm border border-wire rounded-xl
        ${glow ? "hover:border-cyan/30 hover:shadow-[0_0_30px_rgba(0,212,170,0.08)] transition-all duration-300" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
```

- [ ] Create Input.tsx:

```tsx
import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-slate">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`
            w-full bg-graphite border border-wire rounded-lg px-4 py-3
            text-cloud placeholder:text-dim
            focus:outline-none focus:border-cyan/60 focus:ring-1 focus:ring-cyan/30
            transition-colors duration-200
            ${error ? "border-error/60 focus:border-error/80 focus:ring-error/20" : ""}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-sm text-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
```

- [ ] Create Badge.tsx:

```tsx
interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "cyan" | "ice" | "muted";
  className?: string;
}

export default function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const variants = {
    default: "bg-wire/60 text-slate border border-wire",
    cyan: "bg-cyan/10 text-cyan border border-cyan/30",
    ice: "bg-ice/10 text-ice border border-ice/30",
    muted: "bg-graphite text-dim border border-wire/50",
  };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
```

- [ ] Create AnimatedSection.tsx:

```tsx
"use client";

import { useRef, useEffect, useState } from "react";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  once = true,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
```

- [ ] Create Accordion.tsx:

```tsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export default function Accordion({ items, className = "" }: AccordionProps) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className={`flex flex-col divide-y divide-wire ${className}`}>
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between py-4 text-left text-cloud hover:text-cyan transition-colors duration-200"
            aria-expanded={open === i}
          >
            <span className="font-medium pr-4">{item.question}</span>
            <ChevronDown
              className={`shrink-0 w-5 h-5 transition-transform duration-300 ${open === i ? "rotate-180 text-cyan" : "text-slate"}`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${open === i ? "max-h-96 pb-4" : "max-h-0"}`}
          >
            <p className="text-slate leading-relaxed">{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] Commit:
```bash
git add components/ui/
git commit -m "feat: add UI component library (Button, Card, Input, Badge, AnimatedSection, Accordion)"
```

---

## Task 6: Layout Components

**Files:**
- Create: `components/layout/Navbar.tsx`
- Create: `components/layout/MobileNav.tsx`
- Create: `components/layout/Footer.tsx`

See implementation in execution for full code of each component. These are interactive (use client) and handle navigation state.

- [ ] Commit after all three:
```bash
git add components/layout/
git commit -m "feat: add Navbar, MobileNav, Footer layout components"
```

---

## Task 7: Homepage Components

**Files:**
- Create: `components/home/Hero.tsx`
- Create: `components/home/ProblemStatement.tsx`
- Create: `components/home/ServiceLanes.tsx`
- Create: `components/home/SaulDemo.tsx`
- Create: `components/home/PortfolioPreview.tsx`
- Create: `components/home/SocialProof.tsx`
- Create: `components/home/FinalCTA.tsx`

- [ ] Commit after all:
```bash
git add components/home/
git commit -m "feat: add all homepage section components"
```

---

## Task 8: Homepage Assembly

**Files:**
- Modify: `app/page.tsx`

- [ ] Replace with homepage assembly importing all home components.

- [ ] Commit:
```bash
git add app/page.tsx
git commit -m "feat: assemble homepage from section components"
```

---

## Task 9: Build Verification

- [ ] Run build:
```bash
npm run build
```
Expected: Compiled successfully with no TypeScript errors.

- [ ] Fix any errors found, re-run until clean.

- [ ] Final commit after any fixes.
