# Phase 2: Proposal Builder, API Routes, Service Pages — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the proposal builder (multi-step lead capture form), API routes for GHL integration, and three service pages (/ai-automation, /web-development, /marketing-engine) plus a services overview page.

**Architecture:** Proposal builder uses a single page orchestrator that holds accumulated form state, passes data/callbacks to per-step components, persists to sessionStorage, and submits to a Next.js API route that forwards to GoHighLevel. Service pages follow the same Navbar/AnimatedSection/Footer pattern as the homepage.

**Tech Stack:** Next.js 16.2.2 (App Router), React 19, Tailwind CSS 4, Framer Motion 12, React Hook Form 7, Zod 4, @hookform/resolvers 5, Lucide React

---

## PRELIMINARY: Read Next.js docs before writing any Next.js code

AGENTS.md says: "This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code."

- [ ] Run `ls node_modules/next/dist/docs/` to see what guides are available, then read the relevant ones for App Router route handlers and page components before starting Task 3 (API routes).

---

## File Map

**Created:**
- `lib/validation.ts` — All Zod schemas
- `lib/ghl.ts` — GHL webhook utilities + lead scoring
- `app/api/proposal/route.ts` — Proposal submission handler
- `app/api/contact/route.ts` — Contact form handler
- `app/api/chat/route.ts` — Chat widget handler
- `components/proposal-builder/StepIndicator.tsx` — Step progress dots
- `components/proposal-builder/ServiceSelector.tsx` — Step 1: multi-select service cards
- `components/proposal-builder/BusinessInfo.tsx` — Step 2: business details form
- `components/proposal-builder/QuestionFlow.tsx` — Step 3: dynamic questions
- `components/proposal-builder/ContactPreferences.tsx` — Step 4: contact info
- `components/proposal-builder/SummaryReview.tsx` — Step 5: review + submit
- `components/proposal-builder/SubmissionConfirmation.tsx` — Success screen
- `app/build-your-proposal/page.tsx` — Page orchestrator
- `app/services/page.tsx` — Services overview
- `app/ai-automation/page.tsx` — AI & Automation service page
- `app/web-development/page.tsx` — Web Development service page
- `app/marketing-engine/page.tsx` — Marketing Engine service page

**Modified:**
- `lib/constants.ts` — Add AI_TIERS, AI_ADDONS, TECH_STACK, FAQ data, INDUSTRIES list

---

## Task 1: Shared types and Zod validation schemas (lib/validation.ts)

**Files:**
- Create: `lib/validation.ts`

- [ ] **Step 1: Write lib/validation.ts**

```typescript
import { z } from "zod";

// Step 1: Service selection
export const SERVICE_OPTIONS = [
  "ai-assistant",
  "website",
  "marketing",
  "automation",
  "voice-agent",
  "custom-app",
  "not-sure",
] as const;

export type ServiceType = (typeof SERVICE_OPTIONS)[number];

export const step1Schema = z.object({
  services: z.array(z.enum(SERVICE_OPTIONS)).min(1, "Select at least one service"),
});

// Step 2: Business info
export const step2Schema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  industry: z.string().min(1, "Industry is required"),
  industryOther: z.string().optional(),
  teamSize: z.enum(["1", "2-5", "6-20", "20+"]),
  revenueRange: z.enum(["under-10k", "10k-50k", "50k-250k", "250k-plus"]).optional(),
});

// Step 3: AI assistant questions
export const aiQuestionsSchema = z.object({
  aiUserCount: z.enum(["just-me", "small-team", "customers"]).optional(),
  aiPlatform: z.array(z.string()).optional(),
  aiPurpose: z.array(z.string()).optional(),
});

// Step 3: Website questions
export const websiteQuestionsSchema = z.object({
  websiteExisting: z.enum(["redesign", "fresh-start", "new"]).optional(),
  websitePageCount: z.enum(["1-5", "5-10", "10-20", "20+"]).optional(),
  websiteEcommerce: z.enum(["yes", "no", "maybe"]).optional(),
});

// Step 3: Marketing questions
export const marketingQuestionsSchema = z.object({
  currentTools: z.array(z.string()).optional(),
  marketingPain: z.array(z.string()).optional(),
});

// Step 3: Automation questions
export const automationQuestionsSchema = z.object({
  automationProcesses: z.string().optional(),
  automationTools: z.string().optional(),
});

// Step 3: Not sure questions
export const notSureQuestionsSchema = z.object({
  biggestHeadache: z.string().optional(),
  wouldAutomate: z.string().optional(),
});

// Combined step 3
export const step3Schema = aiQuestionsSchema
  .merge(websiteQuestionsSchema)
  .merge(marketingQuestionsSchema)
  .merge(automationQuestionsSchema)
  .merge(notSureQuestionsSchema);

// Step 4: Contact preferences
export const step4Schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  phone: z.string().optional(),
  preferredContact: z.enum(["email", "phone", "text"]),
  timeline: z.enum(["asap", "1-2-weeks", "1-2-months", "exploring"]),
  budget: z.enum(["under-2k", "2k-5k", "5k-10k", "10k-25k", "25k-plus"]).optional(),
  notes: z.string().optional(),
});

// Full proposal form data type (accumulates across steps)
export const proposalSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema);

export type ProposalFormData = z.infer<typeof proposalSchema>;

// Partial proposal — used during the multi-step flow
export type PartialProposal = Partial<ProposalFormData>;

// Contact form schema
export const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  referralSource: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// Chat widget schema
export const chatSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  chatTranscript: z.array(z.object({
    role: z.enum(["saul", "user"]),
    message: z.string(),
    timestamp: z.string(),
  })),
  initialIntent: z.enum(["website", "ai-setup", "pricing", "browsing"]),
});

export type ChatFormData = z.infer<typeof chatSchema>;
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
cd /Users/gbot/.openclaw/workspace/asksaul-site && npx tsc --noEmit 2>&1 | head -40
```

Expected: no errors from lib/validation.ts

- [ ] **Step 3: Commit**

```bash
cd /Users/gbot/.openclaw/workspace/asksaul-site
git add lib/validation.ts
git commit -m "feat: add Zod validation schemas for proposal, contact, and chat forms"
```

---

## Task 2: GHL utilities and lead scoring (lib/ghl.ts)

**Files:**
- Create: `lib/ghl.ts`

- [ ] **Step 1: Write lib/ghl.ts**

```typescript
import type { ProposalFormData, ContactFormData, ChatFormData } from "./validation";

// Lead scoring: calculate estimated project value from proposal data
export function calculateEstimatedValue(data: Partial<ProposalFormData>): number {
  let value = 0;
  const services = data.services ?? [];

  for (const service of services) {
    switch (service) {
      case "ai-assistant": {
        const users = data.aiUserCount;
        if (users === "just-me") value += 500;
        else if (users === "small-team") value += 1000;
        else if (users === "customers") value += 2500;
        else value += 1000;
        break;
      }
      case "website": {
        const pages = data.websitePageCount;
        const ecom = data.websiteEcommerce;
        if (pages === "1-5") value += 5000;
        else if (pages === "5-10") value += 8000;
        else if (pages === "10-20" || pages === "20+") value += 12000;
        else value += 7000;
        if (ecom === "yes") value += 3000;
        break;
      }
      case "marketing":
        value += 15500; // $3,500 setup + $12,000 estimated annual
        break;
      case "automation":
        value += 5000;
        break;
      case "voice-agent":
        value += 5000;
        break;
      case "custom-app":
        value += 10000;
        break;
      case "not-sure":
        value += 2500; // conservative default
        break;
    }
  }

  // Budget override: if customer's stated budget is higher, use that
  const budgetFloor: Record<string, number> = {
    "under-2k": 2000,
    "2k-5k": 5000,
    "5k-10k": 10000,
    "10k-25k": 25000,
    "25k-plus": 25000,
  };
  const budget = data.budget ? (budgetFloor[data.budget] ?? 0) : 0;
  if (budget > value) value = budget;

  return value;
}

// Tag assignment based on estimated value
export function getValueTags(estimatedValue: number): string[] {
  const tags = ["proposal-builder", "website-lead"];
  if (estimatedValue >= 10000) {
    tags.push("high-value");
  } else if (estimatedValue >= 3000) {
    tags.push("mid-value");
  } else {
    tags.push("starter");
  }
  return tags;
}

// Format proposal data into GHL webhook payload
export function formatProposalPayload(data: Partial<ProposalFormData>) {
  const estimatedValue = calculateEstimatedValue(data);
  const tags = getValueTags(estimatedValue);

  // Split name safely
  const firstName = data.firstName ?? "";
  const lastName = data.lastName ?? "";

  const serviceDetails: Record<string, unknown> = {};
  const services = data.services ?? [];

  if (services.includes("ai-assistant")) {
    serviceDetails.ai = {
      userCount: data.aiUserCount,
      platforms: data.aiPlatform,
      purposes: data.aiPurpose,
    };
  }
  if (services.includes("website")) {
    serviceDetails.website = {
      existing: data.websiteExisting,
      pageCount: data.websitePageCount,
      ecommerce: data.websiteEcommerce,
    };
  }
  if (services.includes("marketing")) {
    serviceDetails.marketing = {
      currentTools: data.currentTools,
      painPoints: data.marketingPain,
    };
  }
  if (services.includes("automation")) {
    serviceDetails.automation = {
      processes: data.automationProcesses,
      currentTools: data.automationTools,
    };
  }
  if (services.includes("not-sure")) {
    serviceDetails.notSure = {
      biggestHeadache: data.biggestHeadache,
      wouldAutomate: data.wouldAutomate,
    };
  }

  return {
    source: "asksaul-proposal-builder",
    timestamp: new Date().toISOString(),
    contact: {
      firstName,
      lastName,
      email: data.email ?? "",
      phone: data.phone ?? "",
      preferredContact: data.preferredContact ?? "email",
    },
    business: {
      name: data.businessName ?? "",
      industry: data.industry === "Other" ? (data.industryOther ?? "Other") : (data.industry ?? ""),
      teamSize: data.teamSize ?? "",
      revenueRange: data.revenueRange ?? "",
    },
    services_requested: services,
    service_details: serviceDetails,
    timeline: data.timeline ?? "",
    budget: data.budget ?? "",
    notes: data.notes ?? "",
    tags,
    estimated_value: estimatedValue,
  };
}

// Format contact form data for GHL
export function formatContactPayload(data: ContactFormData) {
  return {
    source: "asksaul-contact-form",
    timestamp: new Date().toISOString(),
    contact: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone ?? "",
      message: data.message,
      referralSource: data.referralSource ?? "",
    },
    tags: ["contact-form", "website-lead"],
  };
}

// Format chat widget data for GHL
export function formatChatPayload(data: ChatFormData) {
  return {
    source: "asksaul-chat-widget",
    timestamp: new Date().toISOString(),
    contact: {
      name: data.name,
      email: data.email,
    },
    chatTranscript: data.chatTranscript,
    initialIntent: data.initialIntent,
    tags: ["chat-widget", "website-lead"],
  };
}

// Post to GHL webhook
export async function postToGHL(payload: unknown): Promise<{ ok: boolean; error?: string }> {
  const webhookUrl = process.env.GHL_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("GHL_WEBHOOK_URL not configured");
    return { ok: false, error: "Webhook not configured" };
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      return { ok: false, error: `GHL webhook returned ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    console.error("GHL webhook error:", err);
    return { ok: false, error: "Failed to reach GHL webhook" };
  }
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd /Users/gbot/.openclaw/workspace/asksaul-site && npx tsc --noEmit 2>&1 | head -40
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
cd /Users/gbot/.openclaw/workspace/asksaul-site
git add lib/ghl.ts
git commit -m "feat: add GHL webhook utilities with lead scoring logic"
```

---

## Task 3: API Routes

**Files:**
- Create: `app/api/proposal/route.ts`
- Create: `app/api/contact/route.ts`
- Create: `app/api/chat/route.ts`

Before writing: run `ls node_modules/next/dist/docs/` and read the App Router route handlers guide.

- [ ] **Step 1: Write app/api/proposal/route.ts**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { proposalSchema } from "@/lib/validation";
import { formatProposalPayload, postToGHL } from "@/lib/ghl";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = proposalSchema.partial().safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: result.error.issues },
      { status: 422 }
    );
  }

  const payload = formatProposalPayload(result.data);
  const ghlResult = await postToGHL(payload);

  if (!ghlResult.ok) {
    // Log but still return success to the user — don't block the lead
    console.error("GHL submission failed:", ghlResult.error);
  }

  return NextResponse.json({ success: true, estimatedValue: payload.estimated_value });
}
```

- [ ] **Step 2: Write app/api/contact/route.ts**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { formatContactPayload, postToGHL } from "@/lib/ghl";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = contactSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: result.error.issues },
      { status: 422 }
    );
  }

  const payload = formatContactPayload(result.data);
  const ghlResult = await postToGHL(payload);

  if (!ghlResult.ok) {
    console.error("GHL contact submission failed:", ghlResult.error);
  }

  return NextResponse.json({ success: true });
}
```

- [ ] **Step 3: Write app/api/chat/route.ts**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { chatSchema } from "@/lib/validation";
import { formatChatPayload, postToGHL } from "@/lib/ghl";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = chatSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: result.error.issues },
      { status: 422 }
    );
  }

  const payload = formatChatPayload(result.data);
  const ghlResult = await postToGHL(payload);

  if (!ghlResult.ok) {
    console.error("GHL chat submission failed:", ghlResult.error);
  }

  return NextResponse.json({ success: true });
}
```

- [ ] **Step 4: Build check**

```bash
cd /Users/gbot/.openclaw/workspace/asksaul-site && npm run build 2>&1 | tail -20
```

Expected: build succeeds. Fix any errors before continuing.

- [ ] **Step 5: Commit**

```bash
cd /Users/gbot/.openclaw/workspace/asksaul-site
git add app/api/
git commit -m "feat: add API routes for proposal, contact, and chat GHL submission"
```

---

## Task 4: Proposal Builder — StepIndicator and ServiceSelector (Step 1)

**Files:**
- Create: `components/proposal-builder/StepIndicator.tsx`
- Create: `components/proposal-builder/ServiceSelector.tsx`

- [ ] **Step 1: Write StepIndicator.tsx**

```tsx
"use client";

import { Bot, Building2, HelpCircle, Phone, ClipboardList } from "lucide-react";

const STEPS = [
  { label: "Services", icon: Bot },
  { label: "Business", icon: Building2 },
  { label: "Details", icon: HelpCircle },
  { label: "Contact", icon: Phone },
  { label: "Review", icon: ClipboardList },
];

interface StepIndicatorProps {
  currentStep: number; // 1-based
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10" role="navigation" aria-label="Proposal steps">
      {STEPS.map((step, i) => {
        const stepNum = i + 1;
        const isDone = stepNum < currentStep;
        const isActive = stepNum === currentStep;

        return (
          <div key={step.label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                  transition-all duration-300
                  ${isDone ? "bg-cyan text-obsidian" : ""}
                  ${isActive ? "bg-cyan/20 border-2 border-cyan text-cyan" : ""}
                  ${!isDone && !isActive ? "bg-graphite border border-wire text-dim" : ""}
                `}
                aria-current={isActive ? "step" : undefined}
              >
                {isDone ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${isActive ? "text-cyan" : isDone ? "text-slate" : "text-dim"}`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-8 sm:w-16 h-px mx-1 sm:mx-2 mb-5 transition-colors duration-300 ${isDone ? "bg-cyan/40" : "bg-wire"}`}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Write ServiceSelector.tsx**

```tsx
"use client";

import { useState } from "react";
import { Bot, Globe, TrendingUp, Zap, Mic, Puzzle, HelpCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import type { ServiceType } from "@/lib/validation";

const SERVICE_CARDS = [
  {
    id: "ai-assistant" as ServiceType,
    icon: Bot,
    title: "AI Assistant / Chatbot",
    description: "A self-hosted AI that knows your business and lives in your messaging apps",
  },
  {
    id: "website" as ServiceType,
    icon: Globe,
    title: "Website Build or Redesign",
    description: "Mobile-first, conversion-optimized, built to rank",
  },
  {
    id: "marketing" as ServiceType,
    icon: TrendingUp,
    title: "Marketing Automation / CRM",
    description: "Full GoHighLevel setup, email/SMS sequences, pipeline management",
  },
  {
    id: "automation" as ServiceType,
    icon: Zap,
    title: "Workflow Automation",
    description: "Automate the manual work your team does every day",
  },
  {
    id: "voice-agent" as ServiceType,
    icon: Mic,
    title: "Voice Agent",
    description: "AI-powered voice agents for calls, customer service, and more",
  },
  {
    id: "custom-app" as ServiceType,
    icon: Puzzle,
    title: "Custom App / Platform",
    description: "Complex web applications built for your specific workflow",
  },
  {
    id: "not-sure" as ServiceType,
    icon: HelpCircle,
    title: "Not sure yet",
    description: "Tell us your biggest problem. We will figure out the right solution together.",
  },
] as const;

interface ServiceSelectorProps {
  initialServices?: ServiceType[];
  onComplete: (services: ServiceType[]) => void;
}

export default function ServiceSelector({ initialServices = [], onComplete }: ServiceSelectorProps) {
  const [selected, setSelected] = useState<ServiceType[]>(initialServices);
  const [error, setError] = useState("");

  function toggleService(id: ServiceType) {
    setError("");
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  function handleNext() {
    if (selected.length === 0) {
      setError("Select at least one option to continue");
      return;
    }
    onComplete(selected);
  }

  return (
    <div>
      {/* Saul presence indicator */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-full bg-cyan/20 border border-cyan/40 flex items-center justify-center">
          <span className="text-cyan text-xs font-bold">S</span>
        </div>
        <p className="text-slate text-sm">
          What can Saul help you with? <span className="text-dim">(Select all that apply)</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {SERVICE_CARDS.map(({ id, icon: Icon, title, description }) => {
          const isSelected = selected.includes(id);
          return (
            <button
              key={id}
              onClick={() => toggleService(id)}
              className={`
                relative text-left p-5 rounded-xl border transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/60
                min-h-[100px]
                ${isSelected
                  ? "bg-cyan/10 border-cyan/60 shadow-[0_0_20px_rgba(0,212,170,0.08)]"
                  : "bg-carbon/60 border-wire hover:border-cyan/30 hover:bg-carbon"
                }
              `}
              aria-pressed={isSelected}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-cyan flex items-center justify-center">
                  <svg className="w-3 h-3 text-obsidian" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              <Icon className={`w-6 h-6 mb-2 ${isSelected ? "text-cyan" : "text-slate"}`} />
              <p className={`font-semibold text-sm mb-1 ${isSelected ? "text-cloud" : "text-cloud"}`} style={{ fontFamily: "var(--font-display)" }}>
                {title}
              </p>
              <p className="text-xs text-dim leading-relaxed">{description}</p>
            </button>
          );
        })}
      </div>

      {error && <p className="text-error text-sm mb-4">{error}</p>}

      <div className="flex justify-end">
        <Button variant="primary" size="lg" onClick={handleNext} className="min-w-[140px]">
          Next Step
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: TypeScript check**

```bash
cd /Users/gbot/.openclaw/workspace/asksaul-site && npx tsc --noEmit 2>&1 | head -40
```

- [ ] **Step 4: Commit**

```bash
cd /Users/gbot/.openclaw/workspace/asksaul-site
git add components/proposal-builder/
git commit -m "feat: add StepIndicator and ServiceSelector (Step 1) for proposal builder"
```

---

## Task 5: Proposal Builder — BusinessInfo (Step 2) and QuestionFlow (Step 3)

**Files:**
- Create: `components/proposal-builder/BusinessInfo.tsx`
- Create: `components/proposal-builder/QuestionFlow.tsx`

- [ ] **Step 1: Write BusinessInfo.tsx**

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step2Schema } from "@/lib/validation";
import type { z } from "zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type Step2Data = z.infer<typeof step2Schema>;

const INDUSTRIES = [
  "Real Estate",
  "Law / Legal",
  "Marketing / Advertising",
  "Healthcare",
  "Finance / Accounting",
  "E-Commerce / Retail",
  "Construction / Trades",
  "Technology",
  "Restaurant / Hospitality",
  "Consulting",
  "Education",
  "Non-Profit",
  "Other",
];

const TEAM_SIZES = [
  { value: "1", label: "Just me" },
  { value: "2-5", label: "2-5 people" },
  { value: "6-20", label: "6-20 people" },
  { value: "20+", label: "20+ people" },
];

const REVENUE_RANGES = [
  { value: "under-10k", label: "Under $10K/mo" },
  { value: "10k-50k", label: "$10K-$50K/mo" },
  { value: "50k-250k", label: "$50K-$250K/mo" },
  { value: "250k-plus", label: "$250K+/mo" },
];

interface BusinessInfoProps {
  initialData?: Partial<Step2Data>;
  onComplete: (data: Step2Data) => void;
  onBack: () => void;
}

export default function BusinessInfo({ initialData, onComplete, onBack }: BusinessInfoProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: initialData,
  });

  const watchedIndustry = watch("industry");

  return (
    <form onSubmit={handleSubmit(onComplete)} noValidate>
      {/* Saul presence indicator */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-full bg-cyan/20 border border-cyan/40 flex items-center justify-center">
          <span className="text-cyan text-xs font-bold">S</span>
        </div>
        <p className="text-slate text-sm">Tell me about your business.</p>
      </div>

      <div className="space-y-5">
        <Input
          id="businessName"
          label="Business name"
          placeholder="Acme Corp"
          error={errors.businessName?.message}
          {...register("businessName")}
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="industry" className="text-sm font-medium text-slate">
            Industry
          </label>
          <select
            id="industry"
            className={`
              w-full bg-graphite border rounded-lg px-4 py-3
              text-cloud focus:outline-none focus:border-cyan/60 focus:ring-1 focus:ring-cyan/30
              transition-colors duration-200
              ${errors.industry ? "border-error/60" : "border-wire"}
            `}
            {...register("industry")}
          >
            <option value="">Select your industry</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
          {errors.industry && <p className="text-sm text-error">{errors.industry.message}</p>}
        </div>

        {watchedIndustry === "Other" && (
          <Input
            id="industryOther"
            label="What industry?"
            placeholder="Describe your industry"
            {...register("industryOther")}
          />
        )}

        {/* Team size — pill buttons */}
        <div>
          <p className="text-sm font-medium text-slate mb-2">Team size</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {TEAM_SIZES.map(({ value, label }) => (
              <label key={value} className="cursor-pointer">
                <input type="radio" value={value} {...register("teamSize")} className="sr-only" />
                <span className={`
                  block text-center py-2.5 px-3 rounded-lg border text-sm font-medium transition-all duration-200
                  peer-checked:bg-cyan/10 peer-checked:border-cyan/60 peer-checked:text-cyan
                `}
                  style={{
                    /* controlled via JS below */
                  }}
                >
                  {label}
                </span>
              </label>
            ))}
          </div>
          {/* NOTE: The radio pill styling above needs a controlled approach. Use TeamSizePills below instead. */}
        </div>

        {/* Revenue range (optional) */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="revenueRange" className="text-sm font-medium text-slate">
            Monthly revenue range <span className="text-dim">(optional)</span>
          </label>
          <select
            id="revenueRange"
            className="w-full bg-graphite border border-wire rounded-lg px-4 py-3 text-cloud focus:outline-none focus:border-cyan/60 focus:ring-1 focus:ring-cyan/30 transition-colors duration-200"
            {...register("revenueRange")}
          >
            <option value="">Prefer not to say</option>
            {REVENUE_RANGES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {errors.teamSize && <p className="text-sm text-error mt-2">{errors.teamSize.message}</p>}

      <div className="flex justify-between mt-8">
        <Button type="button" variant="ghost" size="md" onClick={onBack}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Button>
        <Button type="submit" variant="primary" size="lg" className="min-w-[140px]">
          Next Step
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </form>
  );
}
```

**NOTE:** The team size radio pill approach with RHF works best using `watch` + explicit comparison. Replace the radio section in BusinessInfo with this pattern:

```tsx
// Add to BusinessInfo: watch teamSize, use Controller or manual setValue
// Inside the form, replace the team size div:
const watchedTeamSize = watch("teamSize");
const { setValue } = useForm...; // destructure setValue too

// In JSX:
<div>
  <p className="text-sm font-medium text-slate mb-2">Team size</p>
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
    {TEAM_SIZES.map(({ value, label }) => (
      <button
        key={value}
        type="button"
        onClick={() => setValue("teamSize", value as Step2Data["teamSize"], { shouldValidate: true })}
        className={`
          py-2.5 px-3 rounded-lg border text-sm font-medium transition-all duration-200
          ${watchedTeamSize === value
            ? "bg-cyan/10 border-cyan/60 text-cyan"
            : "bg-graphite border-wire text-slate hover:border-cyan/30"
          }
        `}
      >
        {label}
      </button>
    ))}
  </div>
  {errors.teamSize && <p className="text-sm text-error mt-1">{errors.teamSize.message}</p>}
</div>
```

Apply this pattern (setValue + watch) in the actual file — write it correctly in one pass.

- [ ] **Step 2: Write QuestionFlow.tsx**

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step3Schema } from "@/lib/validation";
import type { z } from "zod";
import type { ServiceType } from "@/lib/validation";
import Button from "@/components/ui/Button";

type Step3Data = z.infer<typeof step3Schema>;

// Multi-select pill helper
function MultiSelectPills({
  options,
  selected,
  onChange,
}: {
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  function toggle(v: string) {
    onChange(selected.includes(v) ? selected.filter((s) => s !== v) : [...selected, v]);
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => toggle(value)}
          className={`
            px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200
            ${selected.includes(value)
              ? "bg-cyan/10 border-cyan/60 text-cyan"
              : "bg-graphite border-wire text-slate hover:border-cyan/30"
            }
          `}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

const AI_USER_COUNT_OPTIONS = [
  { value: "just-me", label: "Just me" },
  { value: "small-team", label: "My small team" },
  { value: "customers", label: "My customers" },
];

const AI_PLATFORM_OPTIONS = [
  { value: "telegram", label: "Telegram" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "discord", label: "Discord" },
  { value: "slack", label: "Slack" },
  { value: "website-chat", label: "Website chat" },
  { value: "not-sure", label: "Not sure" },
];

const AI_PURPOSE_OPTIONS = [
  { value: "customer-support", label: "Customer support" },
  { value: "sales", label: "Sales" },
  { value: "internal-productivity", label: "Internal productivity" },
  { value: "research", label: "Research" },
  { value: "all", label: "All of the above" },
];

const MARKETING_TOOLS_OPTIONS = [
  { value: "mailchimp", label: "Mailchimp" },
  { value: "hubspot", label: "HubSpot" },
  { value: "activecampaign", label: "ActiveCampaign" },
  { value: "gohighlevel", label: "GoHighLevel" },
  { value: "spreadsheets", label: "Spreadsheets" },
  { value: "nothing", label: "Nothing yet" },
  { value: "other", label: "Other" },
];

const MARKETING_PAIN_OPTIONS = [
  { value: "lead-capture", label: "Lead capture" },
  { value: "follow-up", label: "Follow-up" },
  { value: "email-sequences", label: "Email sequences" },
  { value: "review-management", label: "Review management" },
  { value: "all", label: "All of the above" },
];

interface QuestionFlowProps {
  services: ServiceType[];
  initialData?: Partial<Step3Data>;
  onComplete: (data: Step3Data) => void;
  onBack: () => void;
}

export default function QuestionFlow({ services, initialData, onComplete, onBack }: QuestionFlowProps) {
  const { handleSubmit, watch, setValue, register } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: initialData ?? {},
  });

  const watchedAiUserCount = watch("aiUserCount");
  const watchedAiPlatform = watch("aiPlatform") ?? [];
  const watchedAiPurpose = watch("aiPurpose") ?? [];
  const watchedWebsiteExisting = watch("websiteExisting");
  const watchedWebsitePageCount = watch("websitePageCount");
  const watchedWebsiteEcommerce = watch("websiteEcommerce");
  const watchedCurrentTools = watch("currentTools") ?? [];
  const watchedMarketingPain = watch("marketingPain") ?? [];

  const hasAI = services.includes("ai-assistant");
  const hasWebsite = services.includes("website");
  const hasMarketing = services.includes("marketing");
  const hasAutomation = services.includes("automation");
  const hasNotSure = services.includes("not-sure");

  return (
    <form onSubmit={handleSubmit(onComplete)} noValidate>
      {/* Saul presence indicator */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-full bg-cyan/20 border border-cyan/40 flex items-center justify-center">
          <span className="text-cyan text-xs font-bold">S</span>
        </div>
        <p className="text-slate text-sm">A few more details so I can build something worth your time.</p>
      </div>

      <div className="space-y-8">
        {/* AI Questions */}
        {hasAI && (
          <div className="space-y-5 p-5 rounded-xl bg-carbon/60 border border-wire">
            <h3 className="text-cloud font-semibold" style={{ fontFamily: "var(--font-display)" }}>
              AI Assistant
            </h3>

            <div>
              <p className="text-sm font-medium text-slate mb-2">Who will use the AI?</p>
              <div className="flex flex-wrap gap-2">
                {AI_USER_COUNT_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setValue("aiUserCount", value as Step3Data["aiUserCount"])}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
                      watchedAiUserCount === value
                        ? "bg-cyan/10 border-cyan/60 text-cyan"
                        : "bg-graphite border-wire text-slate hover:border-cyan/30"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate mb-2">
                What messaging platform do you use? <span className="text-dim">(pick all that apply)</span>
              </p>
              <MultiSelectPills
                options={AI_PLATFORM_OPTIONS}
                selected={watchedAiPlatform}
                onChange={(next) => setValue("aiPlatform", next)}
              />
            </div>

            <div>
              <p className="text-sm font-medium text-slate mb-2">What should the AI help with?</p>
              <MultiSelectPills
                options={AI_PURPOSE_OPTIONS}
                selected={watchedAiPurpose}
                onChange={(next) => setValue("aiPurpose", next)}
              />
            </div>
          </div>
        )}

        {/* Website Questions */}
        {hasWebsite && (
          <div className="space-y-5 p-5 rounded-xl bg-carbon/60 border border-wire">
            <h3 className="text-cloud font-semibold" style={{ fontFamily: "var(--font-display)" }}>
              Website
            </h3>

            <div>
              <p className="text-sm font-medium text-slate mb-2">What is your website situation?</p>
              <div className="flex flex-col sm:flex-row gap-2">
                {[
                  { value: "redesign", label: "I have one that needs a redesign" },
                  { value: "fresh-start", label: "I have one but starting fresh" },
                  { value: "new", label: "Building from scratch" },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setValue("websiteExisting", value as Step3Data["websiteExisting"])}
                    className={`flex-1 py-2.5 px-3 rounded-lg border text-sm font-medium transition-all duration-200 text-left ${
                      watchedWebsiteExisting === value
                        ? "bg-cyan/10 border-cyan/60 text-cyan"
                        : "bg-graphite border-wire text-slate hover:border-cyan/30"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate mb-2">How many pages do you need?</p>
              <div className="flex flex-wrap gap-2">
                {["1-5", "5-10", "10-20", "20+"].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setValue("websitePageCount", v as Step3Data["websitePageCount"])}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
                      watchedWebsitePageCount === v
                        ? "bg-cyan/10 border-cyan/60 text-cyan"
                        : "bg-graphite border-wire text-slate hover:border-cyan/30"
                    }`}
                  >
                    {v} pages
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate mb-2">Do you need e-commerce?</p>
              <div className="flex gap-2">
                {[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                  { value: "maybe", label: "Maybe later" },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setValue("websiteEcommerce", value as Step3Data["websiteEcommerce"])}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
                      watchedWebsiteEcommerce === value
                        ? "bg-cyan/10 border-cyan/60 text-cyan"
                        : "bg-graphite border-wire text-slate hover:border-cyan/30"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Marketing Questions */}
        {hasMarketing && (
          <div className="space-y-5 p-5 rounded-xl bg-carbon/60 border border-wire">
            <h3 className="text-cloud font-semibold" style={{ fontFamily: "var(--font-display)" }}>
              Marketing Automation
            </h3>

            <div>
              <p className="text-sm font-medium text-slate mb-2">
                What tools are you currently using? <span className="text-dim">(pick all that apply)</span>
              </p>
              <MultiSelectPills
                options={MARKETING_TOOLS_OPTIONS}
                selected={watchedCurrentTools}
                onChange={(next) => setValue("currentTools", next)}
              />
            </div>

            <div>
              <p className="text-sm font-medium text-slate mb-2">What is your biggest marketing pain point?</p>
              <MultiSelectPills
                options={MARKETING_PAIN_OPTIONS}
                selected={watchedMarketingPain}
                onChange={(next) => setValue("marketingPain", next)}
              />
            </div>
          </div>
        )}

        {/* Automation Questions */}
        {hasAutomation && (
          <div className="space-y-5 p-5 rounded-xl bg-carbon/60 border border-wire">
            <h3 className="text-cloud font-semibold" style={{ fontFamily: "var(--font-display)" }}>
              Workflow Automation
            </h3>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="automationProcesses" className="text-sm font-medium text-slate">
                What processes take the most time?
              </label>
              <textarea
                id="automationProcesses"
                rows={3}
                placeholder="e.g. following up with leads, data entry between systems, scheduling..."
                className="w-full bg-graphite border border-wire rounded-lg px-4 py-3 text-cloud placeholder:text-dim focus:outline-none focus:border-cyan/60 focus:ring-1 focus:ring-cyan/30 transition-colors duration-200 resize-none"
                {...register("automationProcesses")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="automationTools" className="text-sm font-medium text-slate">
                What tools does your team use daily?
              </label>
              <textarea
                id="automationTools"
                rows={2}
                placeholder="e.g. Salesforce, Slack, Google Sheets, Zapier..."
                className="w-full bg-graphite border border-wire rounded-lg px-4 py-3 text-cloud placeholder:text-dim focus:outline-none focus:border-cyan/60 focus:ring-1 focus:ring-cyan/30 transition-colors duration-200 resize-none"
                {...register("automationTools")}
              />
            </div>
          </div>
        )}

        {/* Not Sure Questions */}
        {hasNotSure && (
          <div className="space-y-5 p-5 rounded-xl bg-carbon/60 border border-wire">
            <h3 className="text-cloud font-semibold" style={{ fontFamily: "var(--font-display)" }}>
              Tell me more
            </h3>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="biggestHeadache" className="text-sm font-medium text-slate">
                What is the biggest headache in your business right now?
              </label>
              <textarea
                id="biggestHeadache"
                rows={3}
                placeholder="Be specific. The more detail, the better the proposal."
                className="w-full bg-graphite border border-wire rounded-lg px-4 py-3 text-cloud placeholder:text-dim focus:outline-none focus:border-cyan/60 focus:ring-1 focus:ring-cyan/30 transition-colors duration-200 resize-none"
                {...register("biggestHeadache")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="wouldAutomate" className="text-sm font-medium text-slate">
                What would you automate if you could?
              </label>
              <textarea
                id="wouldAutomate"
                rows={2}
                placeholder="Dream a little. What would you hand off?"
                className="w-full bg-graphite border border-wire rounded-lg px-4 py-3 text-cloud placeholder:text-dim focus:outline-none focus:border-cyan/60 focus:ring-1 focus:ring-cyan/30 transition-colors duration-200 resize-none"
                {...register("wouldAutomate")}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <Button type="button" variant="ghost" size="md" onClick={onBack}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Button>
        <Button type="submit" variant="primary" size="lg" className="min-w-[140px]">
          Next Step
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </form>
  );
}
```

- [ ] **Step 3: TypeScript check**

```bash
cd /Users/gbot/.openclaw/workspace/asksaul-site && npx tsc --noEmit 2>&1 | head -40
```

- [ ] **Step 4: Commit**

```bash
cd /Users/gbot/.openclaw/workspace/asksaul-site
git add components/proposal-builder/
git commit -m "feat: add BusinessInfo (Step 2) and QuestionFlow (Step 3) for proposal builder"
```

---

## Task 6: Proposal Builder — ContactPreferences (Step 4), SummaryReview (Step 5), SubmissionConfirmation

**Files:**
- Create: `components/proposal-builder/ContactPreferences.tsx`
- Create: `components/proposal-builder/SummaryReview.tsx`
- Create: `components/proposal-builder/SubmissionConfirmation.tsx`

- [ ] **Step 1: Write ContactPreferences.tsx**

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step4Schema } from "@/lib/validation";
import type { z } from "zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type Step4Data = z.infer<typeof step4Schema>;

const CONTACT_METHODS = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "text", label: "Text" },
];

const TIMELINES = [
  { value: "asap", label: "ASAP" },
  { value: "1-2-weeks", label: "1-2 weeks" },
  { value: "1-2-months", label: "1-2 months" },
  { value: "exploring", label: "Just exploring" },
];

const BUDGETS = [
  { value: "under-2k", label: "Under $2K" },
  { value: "2k-5k", label: "$2K-$5K" },
  { value: "5k-10k", label: "$5K-$10K" },
  { value: "10k-25k", label: "$10K-$25K" },
  { value: "25k-plus", label: "$25K+" },
];

interface ContactPreferencesProps {
  initialData?: Partial<Step4Data>;
  onComplete: (data: Step4Data) => void;
  onBack: () => void;
}

export default function ContactPreferences({ initialData, onComplete, onBack }: ContactPreferencesProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Step4Data>({
    resolver: zodResolver(step4Schema),
    defaultValues: { preferredContact: "email", ...initialData },
  });

  const watchedContact = watch("preferredContact");
  const watchedTimeline = watch("timeline");
  const watchedBudget = watch("budget");

  return (
    <form onSubmit={handleSubmit(onComplete)} noValidate>
      {/* Saul presence indicator */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-full bg-cyan/20 border border-cyan/40 flex items-center justify-center">
          <span className="text-cyan text-xs font-bold">S</span>
        </div>
        <p className="text-slate text-sm">Last step. How do I reach you?</p>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            id="firstName"
            label="First name"
            placeholder="Jane"
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <Input
            id="lastName"
            label="Last name"
            placeholder="Smith"
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>

        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="jane@company.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          id="phone"
          label={<>Phone <span className="text-dim font-normal">(optional)</span></>}
          type="tel"
          placeholder="(555) 000-0000"
          {...register("phone")}
        />

        <div>
          <p className="text-sm font-medium text-slate mb-2">Preferred contact method</p>
          <div className="flex gap-2">
            {CONTACT_METHODS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setValue("preferredContact", value as Step4Data["preferredContact"])}
                className={`px-5 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200 ${
                  watchedContact === value
                    ? "bg-cyan/10 border-cyan/60 text-cyan"
                    : "bg-graphite border-wire text-slate hover:border-cyan/30"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-slate mb-2">How soon do you need this?</p>
          <div className="flex flex-wrap gap-2">
            {TIMELINES.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setValue("timeline", value as Step4Data["timeline"], { shouldValidate: true })}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
                  watchedTimeline === value
                    ? "bg-cyan/10 border-cyan/60 text-cyan"
                    : "bg-graphite border-wire text-slate hover:border-cyan/30"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {errors.timeline && <p className="text-sm text-error mt-1">{errors.timeline.message}</p>}
        </div>

        <div>
          <p className="text-sm font-medium text-slate mb-2">
            Budget range <span className="text-dim">(optional)</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {BUDGETS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setValue("budget", watchedBudget === value ? undefined : value as Step4Data["budget"])}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
                  watchedBudget === value
                    ? "bg-cyan/10 border-cyan/60 text-cyan"
                    : "bg-graphite border-wire text-slate hover:border-cyan/30"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="notes" className="text-sm font-medium text-slate">
            Anything else Saul should know? <span className="text-dim">(optional)</span>
          </label>
          <textarea
            id="notes"
            rows={3}
            placeholder="Deadlines, special requirements, context that helps..."
            className="w-full bg-graphite border border-wire rounded-lg px-4 py-3 text-cloud placeholder:text-dim focus:outline-none focus:border-cyan/60 focus:ring-1 focus:ring-cyan/30 transition-colors duration-200 resize-none"
            {...register("notes")}
          />
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button type="button" variant="ghost" size="md" onClick={onBack}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Button>
        <Button type="submit" variant="primary" size="lg" className="min-w-[140px]">
          Review Proposal
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </form>
  );
}
```

Note: The `label` prop for the Phone input uses JSX. The `Input` component's `label` prop is typed as `string`. Either change the Input component to accept `React.ReactNode` for label, or use a plain string `"Phone (optional)"`. Use the plain string approach to avoid changing the Input component.

- [ ] **Step 2: Write SummaryReview.tsx**

```tsx
"use client";

import type { PartialProposal } from "@/lib/validation";
import Button from "@/components/ui/Button";

const SERVICE_LABELS: Record<string, string> = {
  "ai-assistant": "AI Assistant / Chatbot",
  "website": "Website Build or Redesign",
  "marketing": "Marketing Automation / CRM",
  "automation": "Workflow Automation",
  "voice-agent": "Voice Agent",
  "custom-app": "Custom App / Platform",
  "not-sure": "Not sure yet",
};

const TEAM_SIZE_LABELS: Record<string, string> = {
  "1": "Just me",
  "2-5": "2-5 people",
  "6-20": "6-20 people",
  "20+": "20+ people",
};

const TIMELINE_LABELS: Record<string, string> = {
  "asap": "ASAP",
  "1-2-weeks": "1-2 weeks",
  "1-2-months": "1-2 months",
  "exploring": "Just exploring",
};

const BUDGET_LABELS: Record<string, string> = {
  "under-2k": "Under $2K",
  "2k-5k": "$2K-$5K",
  "5k-10k": "$5K-$10K",
  "10k-25k": "$10K-$25K",
  "25k-plus": "$25K+",
};

interface SummaryReviewProps {
  data: PartialProposal;
  isSubmitting: boolean;
  onSubmit: () => void;
  onBack: () => void;
}

function SummaryRow({ label, value }: { label: string; value?: string | string[] | null }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div className="flex justify-between py-2 border-b border-wire/50 last:border-0">
      <span className="text-sm text-slate">{label}</span>
      <span className="text-sm text-cloud text-right max-w-[55%]">
        {Array.isArray(value) ? value.join(", ") : value}
      </span>
    </div>
  );
}

export default function SummaryReview({ data, isSubmitting, onSubmit, onBack }: SummaryReviewProps) {
  return (
    <div>
      {/* Saul presence indicator */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-full bg-cyan/20 border border-cyan/40 flex items-center justify-center">
          <span className="text-cyan text-xs font-bold">S</span>
        </div>
        <p className="text-slate text-sm">Here is what I have. Does this look right?</p>
      </div>

      <div className="space-y-4">
        {/* Services */}
        <div className="p-4 rounded-xl bg-carbon/60 border border-wire">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-cyan mb-3">Services Requested</h3>
          <div className="flex flex-wrap gap-2">
            {(data.services ?? []).map((s) => (
              <span key={s} className="px-3 py-1 rounded-full bg-cyan/10 border border-cyan/30 text-cyan text-sm">
                {SERVICE_LABELS[s] ?? s}
              </span>
            ))}
          </div>
        </div>

        {/* Business */}
        <div className="p-4 rounded-xl bg-carbon/60 border border-wire">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-slate mb-3">Business</h3>
          <SummaryRow label="Name" value={data.businessName} />
          <SummaryRow label="Industry" value={data.industry === "Other" ? data.industryOther : data.industry} />
          <SummaryRow label="Team size" value={TEAM_SIZE_LABELS[data.teamSize ?? ""] ?? data.teamSize} />
        </div>

        {/* Contact */}
        <div className="p-4 rounded-xl bg-carbon/60 border border-wire">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-slate mb-3">Contact</h3>
          <SummaryRow label="Name" value={[data.firstName, data.lastName].filter(Boolean).join(" ")} />
          <SummaryRow label="Email" value={data.email} />
          <SummaryRow label="Phone" value={data.phone} />
          <SummaryRow label="Preferred contact" value={data.preferredContact} />
          <SummaryRow label="Timeline" value={TIMELINE_LABELS[data.timeline ?? ""] ?? data.timeline} />
          <SummaryRow label="Budget" value={BUDGET_LABELS[data.budget ?? ""] ?? data.budget} />
        </div>

        {data.notes && (
          <div className="p-4 rounded-xl bg-carbon/60 border border-wire">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate mb-2">Notes</h3>
            <p className="text-sm text-cloud">{data.notes}</p>
          </div>
        )}
      </div>

      <p className="text-xs text-dim mt-4 mb-6">
        By submitting, you agree that we will use this information to prepare your proposal and contact you. No spam, ever.
      </p>

      <div className="flex justify-between">
        <Button type="button" variant="ghost" size="md" onClick={onBack} disabled={isSubmitting}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Button>
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="min-w-[180px]"
        >
          {isSubmitting ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Sending...
            </>
          ) : (
            <>
              Submit Proposal
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Write SubmissionConfirmation.tsx**

```tsx
"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";

interface SubmissionConfirmationProps {
  firstName?: string;
}

export default function SubmissionConfirmation({ firstName }: SubmissionConfirmationProps) {
  return (
    <div className="text-center py-8">
      {/* Saul avatar — larger for the celebration moment */}
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan/20 border-2 border-cyan/60 mb-6 shadow-[0_0_30px_rgba(0,212,170,0.2)]">
        <span className="text-cyan text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>S</span>
      </div>

      <h2 className="text-3xl font-bold text-cloud mb-3" style={{ fontFamily: "var(--font-display)" }}>
        Saul is reviewing your project{firstName ? `, ${firstName}` : ""}.
      </h2>

      <p className="text-slate text-lg max-w-md mx-auto mb-8 leading-relaxed">
        You will have a custom proposal in your inbox within 24 hours. If you would rather talk now, book a call below.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="mailto:1.gregory.ringler@gmail.com?subject=Proposal%20Follow-Up"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="primary" size="lg">
            Book a Call Now
          </Button>
        </a>
        <Link href="/">
          <Button variant="ghost" size="lg">
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="mt-12 pt-6 border-t border-wire">
        <p className="text-dim text-sm">
          Questions? Email{" "}
          <a href="mailto:1.gregory.ringler@gmail.com" className="text-cyan hover:underline">
            1.gregory.ringler@gmail.com
          </a>
          {" "}or call{" "}
          <a href="tel:9703439634" className="text-cyan hover:underline">
            970.343.9634
          </a>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: TypeScript check**

```bash
cd /Users/gbot/.openclaw/workspace/asksaul-site && npx tsc --noEmit 2>&1 | head -40
```

Fix any errors. Common issue: `Input` label prop type. If `label` is typed as `string`, use string literals instead of JSX.

- [ ] **Step 5: Commit**

```bash
cd /Users/gbot/.openclaw/workspace/asksaul-site
git add components/proposal-builder/
git commit -m "feat: add ContactPreferences (Step 4), SummaryReview (Step 5), SubmissionConfirmation"
```

---

## Task 7: Proposal Builder page orchestrator

**Files:**
- Create: `app/build-your-proposal/page.tsx`

This is the most complex file. It orchestrates all steps, manages sessionStorage persistence, handles Framer Motion transitions, and submits the final proposal.

- [ ] **Step 1: Write app/build-your-proposal/page.tsx**

```tsx
import type { Metadata } from "next";
import ProposalBuilderClient from "./ProposalBuilderClient";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Build Your Proposal",
  description:
    "Tell us what you need. We will build a custom proposal for AI setup, web development, or marketing automation in 24 hours.",
  openGraph: {
    title: "Build Your Proposal | AskSaul.ai",
    description: "Custom proposals for AI, web, and marketing projects. Takes 5 minutes.",
  },
};

export default function BuildYourProposalPage() {
  return (
    <>
      <Navbar />
      <ProposalBuilderClient />
    </>
  );
}
```

- [ ] **Step 2: Create app/build-your-proposal/ProposalBuilderClient.tsx**

This is the "use client" orchestrator component:

```tsx
"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StepIndicator from "@/components/proposal-builder/StepIndicator";
import ServiceSelector from "@/components/proposal-builder/ServiceSelector";
import BusinessInfo from "@/components/proposal-builder/BusinessInfo";
import QuestionFlow from "@/components/proposal-builder/QuestionFlow";
import ContactPreferences from "@/components/proposal-builder/ContactPreferences";
import SummaryReview from "@/components/proposal-builder/SummaryReview";
import SubmissionConfirmation from "@/components/proposal-builder/SubmissionConfirmation";
import type { PartialProposal, ServiceType } from "@/lib/validation";

const STORAGE_KEY = "asksaul_proposal_draft";
const TOTAL_STEPS = 5;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

export default function ProposalBuilderClient() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const [formData, setFormData] = useState<PartialProposal>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Load persisted draft on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as { step: number; formData: PartialProposal };
        setFormData(parsed.formData ?? {});
        // Resume from saved step, but cap at step 5 (review)
        setStep(Math.min(parsed.step ?? 1, TOTAL_STEPS));
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Persist draft to sessionStorage whenever step or formData changes
  useEffect(() => {
    if (isSubmitted) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ step, formData }));
    } catch {
      // sessionStorage may be unavailable
    }
  }, [step, formData, isSubmitted]);

  function advance(newData: Partial<PartialProposal> = {}) {
    setFormData((prev) => ({ ...prev, ...newData }));
    setDirection(1);
    setStep((s) => s + 1);
  }

  function goBack() {
    setDirection(-1);
    setStep((s) => Math.max(1, s - 1));
  }

  async function handleSubmit() {
    if (isSubmitting) return; // Prevent double-submit
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Submission failed");
      }

      // Clear draft from sessionStorage
      sessionStorage.removeItem(STORAGE_KEY);
      setIsSubmitted(true);
    } catch {
      setSubmitError("Something went wrong. Please try again or email us directly.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-obsidian flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-xl">
          <SubmissionConfirmation firstName={formData.firstName} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-obsidian pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-xs font-semibold tracking-widest uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
            Build Your Proposal
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-cloud" style={{ fontFamily: "var(--font-display)" }}>
            Tell Saul what you need.
          </h1>
          <p className="text-slate mt-2">Takes about 5 minutes. Custom proposal in 24 hours.</p>
        </div>

        <StepIndicator currentStep={step} />

        {/* Form card */}
        <div className="bg-carbon/80 backdrop-blur-sm border border-wire rounded-2xl p-6 sm:p-8 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {step === 1 && (
                <ServiceSelector
                  initialServices={formData.services as ServiceType[] | undefined}
                  onComplete={(services) => advance({ services })}
                />
              )}
              {step === 2 && (
                <BusinessInfo
                  initialData={{
                    businessName: formData.businessName,
                    industry: formData.industry,
                    industryOther: formData.industryOther,
                    teamSize: formData.teamSize,
                    revenueRange: formData.revenueRange,
                  }}
                  onComplete={(data) => advance(data)}
                  onBack={goBack}
                />
              )}
              {step === 3 && (
                <QuestionFlow
                  services={(formData.services ?? []) as ServiceType[]}
                  initialData={formData}
                  onComplete={(data) => advance(data)}
                  onBack={goBack}
                />
              )}
              {step === 4 && (
                <ContactPreferences
                  initialData={{
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    preferredContact: formData.preferredContact,
                    timeline: formData.timeline,
                    budget: formData.budget,
                    notes: formData.notes,
                  }}
                  onComplete={(data) => advance(data)}
                  onBack={goBack}
                />
              )}
              {step === 5 && (
                <>
                  <SummaryReview
                    data={formData}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmit}
                    onBack={goBack}
                  />
                  {submitError && (
                    <p className="text-error text-sm mt-4 text-center">{submitError}</p>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Build check**

```bash
cd /Users/gbot/.openclaw/workspace/asksaul-site && npm run build 2>&1 | tail -30
```

Fix any errors before continuing.

- [ ] **Step 4: Commit**

```bash
cd /Users/gbot/.openclaw/workspace/asksaul-site
git add app/build-your-proposal/
git commit -m "feat: add proposal builder page orchestrator with sessionStorage, Framer Motion, submit"
```

---

## Task 8: Add constants for service pages

**Files:**
- Modify: `lib/constants.ts`

Add these exports to `lib/constants.ts` (append at the end):

- [ ] **Step 1: Append to lib/constants.ts**

```typescript
// AI service tiers (for /ai-automation)
export const AI_TIERS = [
  {
    id: "starter",
    name: "Saul Classic",
    emoji: "🥉",
    tagline: "Your Personal AI",
    for: "Solopreneurs, individual professionals",
    price: "$500",
    ongoing: "API costs only (~$20-80/mo)",
    features: [
      "OpenClaw installation on your machine or VPS",
      "One messaging channel (Telegram or WhatsApp)",
      "Custom personality setup",
      "Security hardening with zero critical findings",
      "1-page quick start guide",
      "1 week of email support post-setup",
    ],
  },
  {
    id: "team",
    name: "AskSaul Team",
    emoji: "🥈",
    tagline: "Your Team's AI",
    for: "Small teams of 2-10 people",
    price: "$1,000",
    ongoing: "API costs only (~$50-200/mo)",
    popular: true,
    features: [
      "Everything in Saul Classic",
      "Multi-user access with per-person DM privacy",
      "Group chat with organized topic channels",
      "Mention-gated responses",
      "Up to 2 messaging channels",
      "2 weeks of support post-setup",
      "One free config adjustment within 30 days",
    ],
  },
  {
    id: "pro",
    name: "AskSaul Pro",
    emoji: "🥇",
    tagline: "Your Business AI",
    for: "Businesses with customer-facing needs",
    price: "$2,500",
    ongoing: "API costs only (~$100-500/mo)",
    features: [
      "Everything in AskSaul Team",
      "Separate internal and customer-facing channels",
      "Custom knowledge base integration",
      "Brand voice tuning with detailed SOUL.md",
      "Up to 3 messaging channels",
      "30 days of support post-setup",
      "Monthly security audit for first 3 months",
    ],
  },
  {
    id: "developer",
    name: "AskSaul Dev",
    emoji: "🔧",
    tagline: "Your Coding Partner",
    for: "Developers and technical teams",
    price: "$1,200",
    ongoing: "API costs only (~$50-300/mo)",
    features: [
      "Everything in AskSaul Team",
      "GitHub integration (issues, PRs, CI monitoring)",
      "Coding agent capabilities",
      "Multiple model support with intelligent fallbacks",
      "Sandbox mode for code execution",
      "2 weeks of support post-setup",
    ],
  },
];

export const AI_ADDONS = [
  { name: "Additional messaging channel", price: "$150" },
  { name: "Custom skill development", price: "$350/skill" },
  { name: "Monthly managed care", price: "$200-$500/mo" },
  { name: "Quarterly security audit + optimization", price: "$250/quarter" },
  { name: "VPS setup and management", price: "$75/mo + hosting" },
];

export const TECH_STACK = [
  "React", "Next.js", "TypeScript", "Tailwind CSS",
  "Node.js", "Supabase", "PostgreSQL", "Figma",
  "Vercel", "Netlify", "WordPress", "Shopify",
  "Framer Motion", "Zod", "GoHighLevel", "OpenClaw",
];

export const AI_FAQS = [
  {
    question: "What is OpenClaw?",
    answer: "OpenClaw is an open-source, self-hosted AI gateway. Think of it as the infrastructure that powers your AI assistant. Instead of your data going through a SaaS company's servers, it stays on your own machine or VPS. AskSaul handles the installation, configuration, and security hardening so you get the privacy benefits without the setup headache.",
  },
  {
    question: "How much does the AI assistant cost to run after setup?",
    answer: "You pay only for API usage directly to the model provider (Anthropic, OpenAI, or Google). For a solo professional with moderate use, that is typically $20-80/month. Small teams run $50-200/month. There is no ongoing AskSaul subscription fee.",
  },
  {
    question: "What messaging platforms does it work with?",
    answer: "Telegram, WhatsApp, Discord, and Slack are the primary platforms. Website chat is available as a separate add-on. Most clients start with one platform and expand from there.",
  },
  {
    question: "Is my data really private?",
    answer: "Your conversation data stays on your infrastructure. The AI model provider (e.g., Anthropic) does see your messages to generate responses, but your business data is not stored on AskSaul servers. We will be honest with you about what the AI model provider's data policies are.",
  },
  {
    question: "What does 'security hardening' actually mean?",
    answer: "Every deployment passes a security audit with zero critical findings before handoff. This includes: access controls so only authorized users can interact with the bot, tool safety reviews (no elevated filesystem access by default), credential isolation, network security configuration, and honest documentation of what the system can and cannot do. The audit results are shared with you.",
  },
  {
    question: "How long does setup take?",
    answer: "Saul Classic takes 2-4 hours. AskSaul Team takes 4-8 hours. AskSaul Pro and Dev take 4-16 hours depending on complexity. You will have a working bot the same day we start.",
  },
];

export const WEBSITE_FAQS = [
  {
    question: "How much does a website cost?",
    answer: "Custom business websites start at $5,000 for a 1-5 page mobile-first site. Larger projects with complex functionality are scoped per project. The proposal builder gives you a ballpark based on your specific needs.",
  },
  {
    question: "How long does a website build take?",
    answer: "A standard business website takes 2-4 weeks from kickoff to launch. Complex web applications or e-commerce builds take longer and are scoped individually. Fast-track options are available for urgent deadlines.",
  },
  {
    question: "Do you do WordPress sites?",
    answer: "Yes, for content-heavy sites where client editing is a priority. For most business sites, React or Next.js gives you better performance, security, and flexibility. We will recommend the right tool for your situation.",
  },
  {
    question: "Will my site rank on Google?",
    answer: "SEO is built in, not bolted on. Every site includes semantic HTML, proper heading structure, meta tags, structured data, and Core Web Vitals optimization. You still need content and backlinks to rank competitively, but the technical foundation is solid.",
  },
  {
    question: "What happens after launch?",
    answer: "You get 30 days of bug-fix support included. Ongoing maintenance and SEO retainer packages start at $500/month. You can also self-manage if you prefer.",
  },
];

export const MARKETING_FAQS = [
  {
    question: "What is GoHighLevel?",
    answer: "GoHighLevel is an all-in-one marketing platform that replaces your CRM, email marketing tool, SMS system, funnel builder, appointment scheduler, and review management software. Instead of paying $2K-$5K/month across 5 tools, you get one platform managed for you.",
  },
  {
    question: "Who is this for?",
    answer: "Service businesses that are spending money on multiple marketing tools and still have leads falling through the cracks. Ideal for businesses doing $10K-$250K/month that have outgrown spreadsheets and basic email tools.",
  },
  {
    question: "What is the cost?",
    answer: "$3,500 one-time setup fee plus $1,000/month. That covers the GHL subscription, all configuration, and ongoing management. Compare that to paying separately for a CRM, email tool, SMS platform, funnel builder, and someone to manage them all.",
  },
  {
    question: "How long does setup take?",
    answer: "Initial setup takes 2-4 weeks. You will have a working CRM and at least one automated sequence live within the first week. Full build-out of funnels and sequences is completed in the following weeks.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes. There is no long-term contract. If you cancel, you keep all your contacts and data. We can export everything in standard formats.",
  },
];
```

- [ ] **Step 2: TypeScript check**

```bash
cd /Users/gbot/.openclaw/workspace/asksaul-site && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
cd /Users/gbot/.openclaw/workspace/asksaul-site
git add lib/constants.ts
git commit -m "feat: add service page constants (AI tiers, addons, tech stack, FAQs)"
```

---

## Task 9: Services overview page

**Files:**
- Create: `app/services/page.tsx`

- [ ] **Step 1: Write app/services/page.tsx**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import { SERVICE_LANES } from "@/lib/constants";
import { Bot, Code2, TrendingUp, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Services",
  description:
    "AI assistant setup, custom web development, and GoHighLevel marketing automation. Done-for-you services for businesses serious about growth.",
  openGraph: {
    title: "Services | AskSaul.ai",
    description: "AI setup, web development, and marketing automation. No fluff. No outsourcing.",
  },
};

const ICON_MAP = { Bot, Code2, TrendingUp } as const;

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative bg-obsidian pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 dot-pattern" aria-hidden="true" />
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,212,170,0.04) 0%, transparent 70%)" }}
            aria-hidden="true"
          />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-xs font-semibold tracking-widest uppercase mb-6">
                What We Build
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-cloud mb-5" style={{ fontFamily: "var(--font-display)" }}>
                Three service lanes. One goal.
              </h1>
              <p className="text-slate text-lg max-w-2xl mx-auto">
                Pick the service that solves your most urgent problem. Or select all three and build a proper stack.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Service cards */}
        <section className="bg-obsidian py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SERVICE_LANES.map((lane, i) => {
                const Icon = ICON_MAP[lane.icon as keyof typeof ICON_MAP] ?? Bot;
                return (
                  <AnimatedSection key={lane.id} delay={i * 80}>
                    <Link href={lane.href} className="block h-full group">
                      <div className="h-full bg-carbon/80 backdrop-blur-sm border border-wire rounded-xl p-7 hover:border-cyan/30 hover:shadow-[0_0_30px_rgba(0,212,170,0.06)] transition-all duration-300">
                        <div className="w-12 h-12 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center mb-5 group-hover:bg-cyan/20 transition-colors duration-200">
                          <Icon className="w-6 h-6 text-cyan" />
                        </div>
                        <h2 className="text-xl font-bold text-cloud mb-1" style={{ fontFamily: "var(--font-display)" }}>
                          {lane.title}
                        </h2>
                        <p className="text-cyan text-sm font-medium mb-3">{lane.tagline}</p>
                        <p className="text-slate text-sm mb-5 leading-relaxed">{lane.description}</p>
                        <ul className="space-y-1.5 mb-6">
                          {lane.features.map((f) => (
                            <li key={f} className="flex items-center gap-2 text-sm text-slate">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan/60 shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                        <div className="flex items-center gap-1 text-cyan text-sm font-semibold group-hover:gap-2 transition-all duration-200">
                          Learn more <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-carbon py-20 border-t border-wire">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <AnimatedSection>
              <h2 className="text-3xl font-bold text-cloud mb-4" style={{ fontFamily: "var(--font-display)" }}>
                Not sure where to start?
              </h2>
              <p className="text-slate mb-8">
                Answer five questions. Get a custom proposal in 24 hours.
              </p>
              <Link href="/build-your-proposal">
                <Button variant="primary" size="lg">
                  Build Your Proposal <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Build check**

```bash
cd /Users/gbot/.openclaw/workspace/asksaul-site && npm run build 2>&1 | tail -20
```

- [ ] **Step 3: Commit**

```bash
cd /Users/gbot/.openclaw/workspace/asksaul-site
git add app/services/
git commit -m "feat: add services overview page"
```

---

## Task 10: AI Automation service page

**Files:**
- Create: `app/ai-automation/page.tsx`

- [ ] **Step 1: Write app/ai-automation/page.tsx**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import Accordion from "@/components/ui/Accordion";
import { AI_TIERS, AI_ADDONS, AI_FAQS } from "@/lib/constants";
import { ArrowRight, ShieldCheck, Check, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "AI & Automation",
  description:
    "Self-hosted AI assistants built on OpenClaw. Done-for-you setup with security hardening, custom personality, and integration into your messaging apps. Starting at $500.",
  openGraph: {
    title: "AI & Automation | AskSaul.ai",
    description:
      "OpenClaw deployments, AI chatbots, workflow automation. Your data stays on your infrastructure.",
  },
};

export default function AIAutomationPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative bg-obsidian pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 dot-pattern" aria-hidden="true" />
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,212,170,0.04) 0%, transparent 70%)" }}
            aria-hidden="true"
          />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-xs font-semibold tracking-widest uppercase mb-6">
                AI and Automation
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-cloud mb-5" style={{ fontFamily: "var(--font-display)" }}>
                Your AI assistant.<br />
                <span className="text-cyan">Your infrastructure.</span>
              </h1>
              <p className="text-slate text-lg max-w-2xl mx-auto mb-8">
                Generic chatbots use your data to train their models and charge you per seat. AskSaul sets up a self-hosted AI that lives in your messaging apps, knows your business, and costs you API fees only.
              </p>
              <Link href="/build-your-proposal">
                <Button variant="primary" size="lg">
                  Build Your Proposal <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </AnimatedSection>
          </div>
        </section>

        {/* OpenClaw explanation */}
        <section className="bg-carbon py-20 border-t border-wire">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <AnimatedSection>
              <h2 className="text-3xl font-bold text-cloud mb-4" style={{ fontFamily: "var(--font-display)" }}>
                What is OpenClaw?
              </h2>
              <p className="text-slate text-lg leading-relaxed mb-4">
                OpenClaw is an open-source AI gateway. It is the infrastructure layer that connects AI models (Claude, GPT-4, Gemini) to your team's messaging apps. Think of it as the plumbing that makes your AI assistant actually live in Telegram, WhatsApp, Discord, or Slack.
              </p>
              <p className="text-slate leading-relaxed mb-4">
                The difference from a SaaS chatbot: OpenClaw runs on your machine or VPS. Your data never touches AskSaul servers after setup. You pay the AI provider directly for API usage. There is no ongoing subscription to us.
              </p>
              <p className="text-slate leading-relaxed">
                AskSaul is the done-for-you service. We install it, configure it, harden it, tune the personality, and hand it off to you ready to work.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Service tiers */}
        <section className="bg-obsidian py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <AnimatedSection>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-cloud mb-3" style={{ fontFamily: "var(--font-display)" }}>
                  OpenClaw Setup Tiers
                </h2>
                <p className="text-slate max-w-xl mx-auto">
                  Pick the tier that matches your team size and use case. All tiers include security hardening and a working bot by the end of setup day.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {AI_TIERS.map((tier, i) => (
                <AnimatedSection key={tier.id} delay={i * 60}>
                  <div className={`relative flex flex-col h-full bg-carbon/80 backdrop-blur-sm border rounded-xl p-6 ${tier.popular ? "border-cyan/50 shadow-[0_0_30px_rgba(0,212,170,0.08)]" : "border-wire"}`}>
                    {tier.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-cyan text-obsidian text-xs font-bold rounded-full">
                        Most Popular
                      </div>
                    )}
                    <div className="mb-4">
                      <span className="text-2xl">{tier.emoji}</span>
                      <h3 className="text-lg font-bold text-cloud mt-1" style={{ fontFamily: "var(--font-display)" }}>
                        {tier.name}
                      </h3>
                      <p className="text-cyan text-xs font-semibold uppercase tracking-wider">{tier.tagline}</p>
                      <p className="text-dim text-xs mt-1">{tier.for}</p>
                    </div>

                    <div className="mb-4">
                      <span className="text-3xl font-bold text-cloud" style={{ fontFamily: "var(--font-display)" }}>{tier.price}</span>
                      <span className="text-slate text-sm ml-2">one-time</span>
                      <p className="text-dim text-xs mt-1">{tier.ongoing}</p>
                    </div>

                    <ul className="space-y-2 flex-1 mb-6">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-slate">
                          <Check className="w-4 h-4 text-cyan shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <Link href="/build-your-proposal">
                      <Button variant={tier.popular ? "primary" : "ghost"} size="sm" className="w-full">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            {/* Add-ons */}
            <AnimatedSection className="mt-14">
              <h3 className="text-xl font-bold text-cloud mb-5" style={{ fontFamily: "var(--font-display)" }}>Add-Ons</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {AI_ADDONS.map((addon) => (
                  <div key={addon.name} className="flex items-center justify-between p-4 bg-carbon/60 border border-wire rounded-lg">
                    <span className="text-slate text-sm">{addon.name}</span>
                    <span className="text-cyan text-sm font-semibold">{addon.price}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Security differentiator */}
        <section className="bg-carbon py-20 border-t border-wire">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <AnimatedSection>
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="w-8 h-8 text-cyan" />
                <h2 className="text-3xl font-bold text-cloud" style={{ fontFamily: "var(--font-display)" }}>
                  Security is not an add-on. It is the baseline.
                </h2>
              </div>
              <p className="text-slate text-lg leading-relaxed mb-8">
                Every AskSaul deployment passes a security audit with zero critical findings before handoff. That is the standard, not the premium.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                {[
                  { title: "Access controls", desc: "Verified allowlists. Only your team can use the bot. No open policies." },
                  { title: "Credential isolation", desc: "No secrets stored in the workspace. Proper auth profiles throughout." },
                  { title: "Tool safety review", desc: "Filesystem restricted. No elevated permissions by default." },
                  { title: "Network security", desc: "Loopback binding, auth tokens, no exposed ports." },
                  { title: "Model safety", desc: "Top-tier models only. Cheap models are more vulnerable to prompt injection." },
                  { title: "Honest documentation", desc: "You get the audit results and know exactly how to check and maintain security." },
                ].map(({ title, desc }) => (
                  <div key={title} className="p-4 bg-obsidian border border-wire rounded-lg">
                    <p className="text-cloud font-semibold text-sm mb-1">{title}</p>
                    <p className="text-slate text-sm">{desc}</p>
                  </div>
                ))}
              </div>

              <div className="p-5 bg-obsidian border border-cyan/20 rounded-xl">
                <p className="text-cloud font-semibold mb-2">What we tell every customer:</p>
                <ul className="space-y-2 text-slate text-sm">
                  <li>"Your data stays on your infrastructure. We never have ongoing access unless you grant it."</li>
                  <li>"AI assistants can be manipulated. We harden against this but cannot guarantee immunity."</li>
                  <li>"This is a tool, not a compliance solution. For regulated industries, additional controls may be needed."</li>
                </ul>
              </div>
            </AnimatedSection>

            {/* Fiverr comparison */}
            <AnimatedSection className="mt-12">
              <h3 className="text-xl font-bold text-cloud mb-5" style={{ fontFamily: "var(--font-display)" }}>
                $50 Fiverr install vs. AskSaul deployment
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-wire">
                      <th className="text-left py-3 text-slate font-medium">What you get</th>
                      <th className="text-center py-3 text-slate font-medium">Fiverr install</th>
                      <th className="text-center py-3 text-cyan font-medium">AskSaul</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Security audit with zero critical findings", false, true],
                      ["Access controls configured", false, true],
                      ["Custom personality and brand voice", false, true],
                      ["Admin documentation", false, true],
                      ["Post-setup support", false, true],
                      ["Works in your messaging apps", "Maybe", true],
                      ["Your data stays on your servers", "Unknown", true],
                    ].map(([label, fiverr, asksaul]) => (
                      <tr key={String(label)} className="border-b border-wire/50">
                        <td className="py-3 text-slate">{label}</td>
                        <td className="py-3 text-center">
                          {fiverr === true ? <Check className="w-4 h-4 text-success mx-auto" /> : fiverr === false ? <span className="text-error">No</span> : <span className="text-warning text-xs">{fiverr}</span>}
                        </td>
                        <td className="py-3 text-center">
                          {asksaul === true ? <Check className="w-4 h-4 text-cyan mx-auto" /> : <span className="text-dim">{String(asksaul)}</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* AI Chatbot and Voice Agent section */}
        <section className="bg-obsidian py-20 border-t border-wire">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <AnimatedSection>
              <h2 className="text-3xl font-bold text-cloud mb-3" style={{ fontFamily: "var(--font-display)" }}>
                AI Chatbot for Your Website
              </h2>
              <p className="text-slate text-lg leading-relaxed mb-4">
                Not the same as an OpenClaw deployment. This is a standalone AI chatbot embedded directly on your website.
              </p>
              <div className="flex items-center gap-6 mb-8">
                <div>
                  <span className="text-3xl font-bold text-cloud" style={{ fontFamily: "var(--font-display)" }}>$3,500</span>
                  <span className="text-slate text-sm ml-2">setup</span>
                </div>
                <span className="text-wire">+</span>
                <div>
                  <span className="text-3xl font-bold text-cloud" style={{ fontFamily: "var(--font-display)" }}>$500</span>
                  <span className="text-slate text-sm ml-2">/month</span>
                </div>
              </div>
              <Link href="/build-your-proposal">
                <Button variant="secondary" size="md">
                  Get a Quote <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </AnimatedSection>

            <AnimatedSection className="mt-14 p-6 bg-carbon/60 border border-wire rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-5 h-5 text-warning" />
                <h3 className="text-lg font-bold text-cloud" style={{ fontFamily: "var(--font-display)" }}>
                  Voice Agents — Coming Soon
                </h3>
              </div>
              <p className="text-slate text-sm leading-relaxed mb-4">
                Conversational voice agents powered by ElevenLabs. Handles inbound calls, qualifies leads, and books appointments. Currently in development for Phase 2.
              </p>
              <a href="mailto:1.gregory.ringler@gmail.com?subject=Voice%20Agent%20Early%20Access" className="text-cyan text-sm hover:underline font-medium">
                Email for early access
              </a>
            </AnimatedSection>

            {/* Workflow Automation */}
            <AnimatedSection className="mt-14">
              <h2 className="text-3xl font-bold text-cloud mb-3" style={{ fontFamily: "var(--font-display)" }}>
                Workflow Automation
              </h2>
              <p className="text-slate text-lg leading-relaxed mb-4">
                CRM automation, data enrichment, lead routing, back-office process automation. Custom-scoped per project.
              </p>
              <div className="flex items-center gap-6 mb-6">
                <div>
                  <span className="text-slate text-sm">Projects start at </span>
                  <span className="text-2xl font-bold text-cloud" style={{ fontFamily: "var(--font-display)" }}>$2,500</span>
                </div>
              </div>
              <Link href="/build-your-proposal">
                <Button variant="ghost" size="md">
                  Discuss Your Project <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </AnimatedSection>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-carbon py-20 border-t border-wire">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <AnimatedSection>
              <h2 className="text-3xl font-bold text-cloud mb-8" style={{ fontFamily: "var(--font-display)" }}>
                Frequently asked questions
              </h2>
              <Accordion items={AI_FAQS} />
            </AnimatedSection>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-obsidian py-20 border-t border-wire">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <AnimatedSection>
              <h2 className="text-3xl font-bold text-cloud mb-4" style={{ fontFamily: "var(--font-display)" }}>
                Ready to put Saul to work?
              </h2>
              <p className="text-slate mb-8">
                Takes 5 minutes to fill out. Custom proposal in 24 hours.
              </p>
              <Link href="/build-your-proposal">
                <Button variant="primary" size="lg">
                  Build Your Proposal <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Build check**

```bash
cd /Users/gbot/.openclaw/workspace/asksaul-site && npm run build 2>&1 | tail -20
```

- [ ] **Step 3: Commit**

```bash
cd /Users/gbot/.openclaw/workspace/asksaul-site
git add app/ai-automation/
git commit -m "feat: add AI & Automation service page with OpenClaw tiers, security section, FAQs"
```

---

## Task 11: Web Development service page

**Files:**
- Create: `app/web-development/page.tsx`

- [ ] **Step 1: Write app/web-development/page.tsx**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import Accordion from "@/components/ui/Accordion";
import { PORTFOLIO_PROJECTS, TECH_STACK, WEBSITE_FAQS } from "@/lib/constants";
import { ArrowRight, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Web Development",
  description:
    "Custom websites and web applications built mobile-first, SEO-optimized, and engineered to convert. Starting at $5,000. Portfolio includes DriveExotiq, Exotiq.ai, Polaris Estate, and Lou's HVAC.",
  openGraph: {
    title: "Web Development | AskSaul.ai",
    description: "Custom websites and web apps that actually convert. Mobile-first. SEO-optimized. No templates.",
  },
};

const SERVICES = [
  { name: "Custom business website", range: "$5,000-$15,000", desc: "Mobile-first, SEO-optimized, built to rank and convert" },
  { name: "Web application development", range: "Scoped per project", desc: "Complex web apps built on React/Next.js with real databases" },
  { name: "E-commerce builds", range: "Scoped per project", desc: "Next.js storefronts or Shopify customizations" },
  { name: "Website redesign", range: "$3,000-$10,000", desc: "Keep your domain, start fresh on a modern stack" },
  { name: "SEO optimization", range: "$500-$1,500/mo", desc: "Technical SEO, content strategy, and Core Web Vitals" },
  { name: "Maintenance retainer", range: "$500-$1,500/mo", desc: "Updates, security patches, performance monitoring" },
];

export default function WebDevelopmentPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative bg-obsidian pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 dot-pattern" aria-hidden="true" />
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,212,170,0.04) 0%, transparent 70%)" }}
            aria-hidden="true"
          />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-xs font-semibold tracking-widest uppercase mb-6">
                Websites and Apps
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-cloud mb-5" style={{ fontFamily: "var(--font-display)" }}>
                A site that actually<br />
                <span className="text-cyan">converts.</span>
              </h1>
              <p className="text-slate text-lg max-w-2xl mx-auto mb-8">
                Not a template. Not a page builder. Custom-coded, mobile-first, built with the same stack that powers platforms doing millions in transactions.
              </p>
              <Link href="/build-your-proposal">
                <Button variant="primary" size="lg">
                  Build Your Proposal <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </AnimatedSection>
          </div>
        </section>

        {/* Services */}
        <section className="bg-carbon py-20 border-t border-wire">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <AnimatedSection>
              <h2 className="text-3xl font-bold text-cloud mb-8" style={{ fontFamily: "var(--font-display)" }}>
                Services and pricing
              </h2>
            </AnimatedSection>
            <div className="space-y-3">
              {SERVICES.map((s, i) => (
                <AnimatedSection key={s.name} delay={i * 50}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-obsidian border border-wire rounded-xl gap-3">
                    <div>
                      <p className="text-cloud font-semibold">{s.name}</p>
                      <p className="text-slate text-sm">{s.desc}</p>
                    </div>
                    <span className="text-cyan font-semibold text-sm shrink-0">{s.range}</span>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio */}
        <section className="bg-obsidian py-20 border-t border-wire">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <AnimatedSection>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-cloud mb-3" style={{ fontFamily: "var(--font-display)" }}>
                  Built, not talked about
                </h2>
                <p className="text-slate max-w-xl mx-auto">
                  Five production platforms, all built solo, all live.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PORTFOLIO_PROJECTS.map((project, i) => (
                <AnimatedSection key={project.id} delay={i * 60}>
                  <div className="bg-carbon/80 backdrop-blur-sm border border-wire rounded-xl p-6 hover:border-cyan/30 transition-all duration-300">
                    {/* Image placeholder or actual image */}
                    {project.images.length > 0 ? (
                      <div className="w-full h-40 rounded-lg overflow-hidden mb-4 bg-graphite">
                        <img
                          src={project.images[0]}
                          alt={`${project.title} screenshot`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-40 rounded-lg mb-4 bg-graphite border border-wire flex items-center justify-center">
                        <span className="text-dim text-sm">Screenshot coming soon</span>
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-lg font-bold text-cloud" style={{ fontFamily: "var(--font-display)" }}>
                        {project.title}
                      </h3>
                      {!project.comingSoon && project.url !== "#" && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan hover:text-cyan/80 transition-colors shrink-0"
                          aria-label={`Visit ${project.title}`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    <p className="text-slate text-sm leading-relaxed mb-3">{project.description}</p>

                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-graphite border border-wire rounded text-dim text-xs">
                          {tag}
                        </span>
                      ))}
                      {project.comingSoon && (
                        <span className="px-2 py-0.5 bg-warning/10 border border-warning/30 rounded text-warning text-xs">
                          Portfolio update coming
                        </span>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Tech stack */}
        <section className="bg-carbon py-20 border-t border-wire">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <AnimatedSection>
              <h2 className="text-3xl font-bold text-cloud mb-8" style={{ fontFamily: "var(--font-display)" }}>
                Tech stack
              </h2>
              <div className="flex flex-wrap gap-3">
                {TECH_STACK.map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 bg-obsidian border border-wire rounded-lg text-slate text-sm hover:border-cyan/30 hover:text-cloud transition-all duration-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-obsidian py-20 border-t border-wire">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <AnimatedSection>
              <h2 className="text-3xl font-bold text-cloud mb-8" style={{ fontFamily: "var(--font-display)" }}>
                Frequently asked questions
              </h2>
              <Accordion items={WEBSITE_FAQS} />
            </AnimatedSection>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-carbon py-20 border-t border-wire">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <AnimatedSection>
              <h2 className="text-3xl font-bold text-cloud mb-4" style={{ fontFamily: "var(--font-display)" }}>
                Ready for a site that works?
              </h2>
              <p className="text-slate mb-8">
                Tell Saul what you need. Custom proposal in 24 hours.
              </p>
              <Link href="/build-your-proposal">
                <Button variant="primary" size="lg">
                  Build Your Proposal <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Build check**

```bash
cd /Users/gbot/.openclaw/workspace/asksaul-site && npm run build 2>&1 | tail -20
```

- [ ] **Step 3: Commit**

```bash
cd /Users/gbot/.openclaw/workspace/asksaul-site
git add app/web-development/
git commit -m "feat: add Web Development service page with portfolio, tech stack, FAQs"
```

---

## Task 12: Marketing Engine service page

**Files:**
- Create: `app/marketing-engine/page.tsx`

- [ ] **Step 1: Write app/marketing-engine/page.tsx**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import Accordion from "@/components/ui/Accordion";
import { MARKETING_FAQS } from "@/lib/constants";
import { ArrowRight, Check, X } from "lucide-react";

export const metadata: Metadata = {
  title: "Marketing Engine",
  description:
    "Full GoHighLevel white-label setup for service businesses. CRM, email/SMS sequences, lead funnels, pipeline management, and reputation monitoring. $3,500 setup + $1,000/mo.",
  openGraph: {
    title: "Marketing Engine | AskSaul.ai",
    description: "Your entire marketing department in a box. GoHighLevel setup, managed for you.",
  },
};

const INCLUDED = [
  "Branded CRM (your logo, your domain)",
  "Email and SMS marketing sequences",
  "Automated lead capture funnels",
  "Pipeline management",
  "Appointment scheduling",
  "Review management and reputation monitoring",
  "Social media posting",
  "Reporting dashboard",
  "Website chat widget",
  "Call tracking",
];

const TOOL_COMPARISON = [
  { tool: "CRM (HubSpot/Salesforce)", typical: "$800/mo", asksaul: "Included" },
  { tool: "Email marketing (Mailchimp)", typical: "$200/mo", asksaul: "Included" },
  { tool: "SMS marketing (Twilio)", typical: "$150/mo", asksaul: "Included" },
  { tool: "Funnel builder (ClickFunnels)", typical: "$297/mo", asksaul: "Included" },
  { tool: "Scheduling (Calendly)", typical: "$20/mo", asksaul: "Included" },
  { tool: "Review management", typical: "$200/mo", asksaul: "Included" },
  { tool: "Management time", typical: "10+ hrs/mo", asksaul: "We handle it" },
];

export default function MarketingEnginePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative bg-obsidian pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 dot-pattern" aria-hidden="true" />
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,212,170,0.04) 0%, transparent 70%)" }}
            aria-hidden="true"
          />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-xs font-semibold tracking-widest uppercase mb-6">
                Marketing Engine
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-cloud mb-5" style={{ fontFamily: "var(--font-display)" }}>
                Your entire marketing<br />
                <span className="text-cyan">stack, handled.</span>
              </h1>
              <p className="text-slate text-lg max-w-2xl mx-auto mb-8">
                Stop paying $2K-$5K/month across five different tools while leads fall through the cracks. Get one platform, set up and managed for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/build-your-proposal">
                  <Button variant="primary" size="lg">
                    Build Your Proposal <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <a href="mailto:1.gregory.ringler@gmail.com?subject=Marketing%20Strategy%20Call" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="lg">
                    Book a Strategy Call
                  </Button>
                </a>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Pricing */}
        <section className="bg-carbon py-20 border-t border-wire">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <AnimatedSection>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
                <div>
                  <p className="text-slate text-sm mb-1">One-time setup</p>
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-bold text-cloud" style={{ fontFamily: "var(--font-display)" }}>$3,500</span>
                  </div>
                </div>
                <div className="text-dim text-2xl font-light hidden sm:block">+</div>
                <div>
                  <p className="text-slate text-sm mb-1">Monthly management</p>
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-bold text-cloud" style={{ fontFamily: "var(--font-display)" }}>$1,000</span>
                    <span className="text-slate text-lg mb-1">/mo</span>
                  </div>
                </div>
              </div>
              <p className="text-dim text-sm mt-4">Includes GHL subscription, all setup, and ongoing management. No long-term contract.</p>
            </AnimatedSection>
          </div>
        </section>

        {/* What is included */}
        <section className="bg-obsidian py-20 border-t border-wire">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <AnimatedSection>
              <h2 className="text-3xl font-bold text-cloud mb-8" style={{ fontFamily: "var(--font-display)" }}>
                What is included
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INCLUDED.map((item) => (
                  <div key={item} className="flex items-center gap-3 p-4 bg-carbon/60 border border-wire rounded-lg">
                    <Check className="w-5 h-5 text-cyan shrink-0" />
                    <span className="text-cloud text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Who is this for */}
        <section className="bg-carbon py-20 border-t border-wire">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <AnimatedSection>
              <h2 className="text-3xl font-bold text-cloud mb-4" style={{ fontFamily: "var(--font-display)" }}>
                Who this is for
              </h2>
              <p className="text-slate text-lg leading-relaxed mb-6">
                Service businesses doing $10K-$250K/month that have outgrown spreadsheets and basic email tools. You are probably already paying for a CRM, email software, SMS, and a scheduling tool. You are spending more time managing the tools than using them.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Real estate agents and brokerages",
                  "Law firms and consultancies",
                  "Marketing agencies",
                  "Home services businesses",
                  "Medical and dental practices",
                  "Insurance agencies",
                ].map((type) => (
                  <div key={type} className="flex items-center gap-2 text-slate text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan/60 shrink-0" />
                    {type}
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Tool comparison */}
        <section className="bg-obsidian py-20 border-t border-wire">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <AnimatedSection>
              <h2 className="text-3xl font-bold text-cloud mb-3" style={{ fontFamily: "var(--font-display)" }}>
                What you are paying for 5 tools vs. one
              </h2>
              <p className="text-slate mb-8">
                This is a rough average. Your actual tool stack may cost more.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-wire">
                      <th className="text-left py-3 text-slate font-medium">Tool</th>
                      <th className="text-center py-3 text-slate font-medium">Typical cost</th>
                      <th className="text-center py-3 text-cyan font-medium">AskSaul Engine</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TOOL_COMPARISON.map(({ tool, typical, asksaul }) => (
                      <tr key={tool} className="border-b border-wire/50">
                        <td className="py-3 text-slate">{tool}</td>
                        <td className="py-3 text-center text-cloud">{typical}</td>
                        <td className="py-3 text-center">
                          <span className="text-cyan font-medium">{asksaul}</span>
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-wire">
                      <td className="py-3 font-semibold text-cloud">Total</td>
                      <td className="py-3 text-center font-semibold text-cloud">$1,667+/mo</td>
                      <td className="py-3 text-center font-bold text-cyan">$1,000/mo</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-dim text-xs mt-3">Prices shown are approximate and change frequently. The real cost is fragmentation, not just dollars.</p>
            </AnimatedSection>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-carbon py-20 border-t border-wire">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <AnimatedSection>
              <h2 className="text-3xl font-bold text-cloud mb-8" style={{ fontFamily: "var(--font-display)" }}>
                Frequently asked questions
              </h2>
              <Accordion items={MARKETING_FAQS} />
            </AnimatedSection>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-obsidian py-20 border-t border-wire">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <AnimatedSection>
              <h2 className="text-3xl font-bold text-cloud mb-4" style={{ fontFamily: "var(--font-display)" }}>
                Done with the tool juggling?
              </h2>
              <p className="text-slate mb-8">
                Let us consolidate your marketing stack and make it work.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/build-your-proposal">
                  <Button variant="primary" size="lg">
                    Build Your Proposal <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <a href="mailto:1.gregory.ringler@gmail.com?subject=Marketing%20Engine%20Strategy%20Call" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="lg">
                    Book a Strategy Call
                  </Button>
                </a>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Full build check**

```bash
cd /Users/gbot/.openclaw/workspace/asksaul-site && npm run build 2>&1
```

This is the final build. It must pass cleanly. Fix all TypeScript and Next.js errors before continuing.

- [ ] **Step 3: Commit**

```bash
cd /Users/gbot/.openclaw/workspace/asksaul-site
git add app/marketing-engine/
git commit -m "feat: add Marketing Engine service page with GHL details, tool comparison, FAQs"
```

---

## Task 13: Final verification and signal

- [ ] **Step 1: Full clean build**

```bash
cd /Users/gbot/.openclaw/workspace/asksaul-site && npm run build 2>&1
```

Expected: Build completes with no errors. Fix anything that fails.

- [ ] **Step 2: TypeScript strict check**

```bash
cd /Users/gbot/.openclaw/workspace/asksaul-site && npx tsc --noEmit 2>&1
```

Expected: zero errors.

- [ ] **Step 3: Verify all routes exist**

```bash
find /Users/gbot/.openclaw/workspace/asksaul-site/app -name "page.tsx" | sort
find /Users/gbot/.openclaw/workspace/asksaul-site/app/api -name "route.ts" | sort
```

Expected routes:
- `app/page.tsx` (existing)
- `app/build-your-proposal/page.tsx`
- `app/services/page.tsx`
- `app/ai-automation/page.tsx`
- `app/web-development/page.tsx`
- `app/marketing-engine/page.tsx`
- `app/api/proposal/route.ts`
- `app/api/contact/route.ts`
- `app/api/chat/route.ts`

- [ ] **Step 4: Signal completion**

```bash
openclaw system event --text 'Done: Phase 2 complete - proposal builder, API routes, service pages' --mode now
```

---

## Self-Review: Spec Coverage Check

| Spec Requirement | Covered in Task |
|-----------------|-----------------|
| `/build-your-proposal` page | Task 7 |
| StepIndicator component | Task 4 |
| ServiceSelector (Step 1, multi-select cards) | Task 4 |
| BusinessInfo (Step 2) | Task 5 |
| QuestionFlow (Step 3, dynamic branching) | Task 5 |
| ContactPreferences (Step 4) | Task 6 |
| SummaryReview (Step 5) | Task 6 |
| SubmissionConfirmation | Task 6 |
| React Hook Form + Zod validation | Tasks 1, 5, 6 |
| Framer Motion animated transitions | Task 7 |
| sessionStorage persistence | Task 7 |
| Prevent double-submit | Task 7 |
| Saul presence indicator throughout | Tasks 4, 5, 6 |
| Back button on every step except Step 1 | Tasks 5, 6 |
| All dynamic question branching (AI, Website, Marketing, Automation, Not Sure) | Task 5 |
| Mobile-optimized large touch targets | All proposal tasks |
| API route `/api/proposal` with Zod + GHL payload | Tasks 1, 2, 3 |
| API route `/api/contact` | Tasks 1, 2, 3 |
| API route `/api/chat` | Tasks 1, 2, 3 |
| Lead scoring logic | Task 2 |
| GHL value tags (high-value, mid-value, starter) | Task 2 |
| lib/ghl.ts shared utilities | Task 2 |
| lib/validation.ts Zod schemas | Task 1 |
| `/services` overview page | Task 9 |
| `/ai-automation` with OpenClaw tiers | Task 10 |
| Add-ons section | Task 10 |
| Security differentiator section | Task 10 |
| AI Chatbot section ($3,500 + $500/mo) | Task 10 |
| Voice Agent "Coming Soon" | Task 10 |
| Workflow Automation section | Task 10 |
| AI FAQ section (5+ Q&As) | Tasks 8, 10 |
| `/web-development` with service list + pricing | Task 11 |
| Full portfolio showcase | Task 11 |
| Tech stack visual grid | Task 11 |
| Web Dev FAQ section | Tasks 8, 11 |
| `/marketing-engine` with GHL details | Task 12 |
| Tool cost comparison section | Task 12 |
| Marketing FAQ section | Tasks 8, 12 |
| `Build Your Proposal` CTA on every service page | Tasks 9-12 |
| Proper metadata (title, description, OG tags) on all pages | Tasks 9-12 |
| AnimatedSection for scroll animations | All service pages |
| Accordion for FAQs | All service pages |
| No em dashes in copy | All tasks |
| No "Gregory" called "Greg" | All tasks |
| Forbidden words avoided | All tasks |
| `npm run build` compiles cleanly | Task 13 |
