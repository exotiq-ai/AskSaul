"use client";

import { useState } from "react";
import { Shield, ChevronDown } from "lucide-react";
import Card from "@/components/ui/Card";

interface SecurityPoint {
  title: string;
  desc: string;
}

export default function SecuritySection({ points }: { points: SecurityPoint[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = points.slice(0, 3);
  const hidden = points.slice(3);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map((point) => (
          <Card key={point.title} glow className="p-5">
            <div className="w-8 h-8 rounded-lg bg-cyan/10 flex items-center justify-center mb-3">
              <Shield className="w-4 h-4 text-cyan" />
            </div>
            <h3 className="text-sm font-semibold text-cloud mb-1.5">{point.title}</h3>
            <p className="text-sm text-slate leading-relaxed">{point.desc}</p>
          </Card>
        ))}
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          expanded ? "max-h-[600px] mt-4" : "max-h-0"
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hidden.map((point) => (
            <Card key={point.title} glow className="p-5">
              <div className="w-8 h-8 rounded-lg bg-cyan/10 flex items-center justify-center mb-3">
                <Shield className="w-4 h-4 text-cyan" />
              </div>
              <h3 className="text-sm font-semibold text-cloud mb-1.5">{point.title}</h3>
              <p className="text-sm text-slate leading-relaxed">{point.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="mt-5 flex items-center gap-1.5 text-sm text-slate hover:text-cyan transition-colors cursor-pointer"
      >
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
        />
        {expanded ? "Hide security breakdown" : "See full security breakdown"}
      </button>
    </>
  );
}
