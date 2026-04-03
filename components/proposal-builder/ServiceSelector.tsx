"use client";

import { Bot, Globe, Megaphone, Workflow, Mic, Layers, HelpCircle } from "lucide-react";
import type { ServiceOption } from "@/lib/validation";

const SERVICES: {
  id: ServiceOption;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: "ai-assistant",
    label: "AI Assistant / Chatbot",
    description: "A custom AI that lives in your messaging apps and works the way you do.",
    icon: Bot,
  },
  {
    id: "website",
    label: "Website Build or Redesign",
    description: "Mobile-first, SEO-optimized, built to convert visitors into leads.",
    icon: Globe,
  },
  {
    id: "marketing",
    label: "Marketing Automation / CRM",
    description: "Replace 5 disconnected tools with one system that actually follows up.",
    icon: Megaphone,
  },
  {
    id: "automation",
    label: "Workflow Automation",
    description: "Kill the copy-paste. Automate the processes eating your team's time.",
    icon: Workflow,
  },
  {
    id: "voice-agent",
    label: "Voice Agent",
    description: "AI that answers calls, qualifies leads, and books appointments.",
    icon: Mic,
  },
  {
    id: "custom-app",
    label: "Custom App / Platform",
    description: "A purpose-built web application for your specific business logic.",
    icon: Layers,
  },
  {
    id: "not-sure",
    label: "Not Sure Yet",
    description: "Help me figure out what would actually make a difference.",
    icon: HelpCircle,
  },
];

interface ServiceSelectorProps {
  selected: ServiceOption[];
  onChange: (selected: ServiceOption[]) => void;
  error?: string;
}

export default function ServiceSelector({ selected, onChange, error }: ServiceSelectorProps) {
  function toggle(id: ServiceOption) {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SERVICES.map((service) => {
          const Icon = service.icon;
          const isSelected = selected.includes(service.id);
          return (
            <button
              key={service.id}
              type="button"
              onClick={() => toggle(service.id)}
              className={`
                relative text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/60
                ${
                  isSelected
                    ? "border-cyan bg-cyan/10 shadow-[0_0_20px_rgba(0,212,170,0.1)]"
                    : "border-wire bg-carbon/60 hover:border-cyan/30 hover:bg-carbon"
                }
              `}
              aria-pressed={isSelected}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 p-2 rounded-lg shrink-0 ${
                    isSelected ? "bg-cyan/20 text-cyan" : "bg-graphite text-slate"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p
                    className={`font-semibold text-sm leading-tight mb-1 ${
                      isSelected ? "text-cyan" : "text-cloud"
                    }`}
                  >
                    {service.label}
                  </p>
                  <p className="text-xs text-slate leading-relaxed">{service.description}</p>
                </div>
              </div>
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <div className="w-5 h-5 rounded-full bg-cyan flex items-center justify-center">
                    <svg className="w-3 h-3 text-obsidian" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
      {error && <p className="mt-2 text-sm text-error">{error}</p>}
    </div>
  );
}
