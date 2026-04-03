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
              className={`shrink-0 w-5 h-5 transition-transform duration-300 ${
                open === i ? "rotate-180 text-cyan" : "text-slate"
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              open === i ? "max-h-96 pb-4" : "max-h-0"
            }`}
          >
            <p className="text-base text-slate leading-relaxed">{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
