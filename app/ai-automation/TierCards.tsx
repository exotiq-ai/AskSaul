"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronDown } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

interface Tier {
  id: string;
  name: string;
  label: string;
  forWho: string;
  price: string;
  priceNote: string;
  ongoing: string;
  popular: boolean;
  features: string[];
}

function TierCard({ tier }: { tier: Tier }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`relative h-full flex flex-col rounded-2xl border p-5 transition-all duration-300 ${
        tier.popular
          ? "border-cyan/40 bg-cyan/5 shadow-[0_0_40px_rgba(0,212,170,0.08)]"
          : "border-wire bg-carbon/80 hover:border-wire/80"
      }`}
    >
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant="cyan">Most popular</Badge>
        </div>
      )}

      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-dim mb-1">
          {tier.label}
        </p>
        <h3 className="font-display text-lg font-bold text-cloud mb-1">{tier.name}</h3>
        <p className="text-sm text-slate">{tier.forWho}</p>
      </div>

      <div className="mb-5">
        <p className="text-2xl font-display font-bold text-cloud">{tier.price}</p>
        <p className="text-xs text-dim">{tier.priceNote}</p>
        <p className="text-sm text-slate mt-1">{tier.ongoing}</p>
      </div>

      {/* Collapsible features */}
      <div className="flex-1 mb-5">
        <button
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className="flex items-center gap-1.5 text-sm text-cyan hover:text-cyan/80 transition-colors w-full mb-3 cursor-pointer"
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
          />
          {expanded ? "Hide details" : "See what's included"}
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ${
            expanded ? "max-h-[600px]" : "max-h-0"
          }`}
        >
          <ul className="flex flex-col gap-2">
            {tier.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-slate">
                <Check className="w-3.5 h-3.5 text-cyan shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Link href="/build-your-proposal">
        <Button
          variant={tier.popular ? "primary" : "ghost"}
          size="sm"
          className="w-full"
        >
          Get started
        </Button>
      </Link>
    </div>
  );
}

export default function TierCards({ tiers }: { tiers: Tier[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      {tiers.map((tier) => (
        <TierCard key={tier.id} tier={tier} />
      ))}
    </div>
  );
}
