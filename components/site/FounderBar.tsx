import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const FOUNDING_HREF = "/voice-agents#founding";

export default function FounderBar() {
  return (
    <Link
      href={FOUNDING_HREF}
      className="group relative block overflow-hidden border-b border-cyan/20 bg-[linear-gradient(90deg,rgba(0,212,170,0.14),rgba(74,198,232,0.10),rgba(0,212,170,0.14))]"
    >
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-center gap-3 px-4 text-[13px] font-medium text-cloud sm:text-sm">
        <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
          <span className="ring-pulse absolute inline-flex h-full w-full rounded-full bg-cyan" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" />
        </span>
        <span className="truncate">
          <span className="font-semibold text-cyan">Founding Client Program</span>
          <span className="hidden sm:inline"> · 10 Front Range roofing + HVAC shops · closes Dec 31</span>
          <span className="sm:hidden"> · 10 shops · closes Dec 31</span>
        </span>
        <span className="hidden items-center gap-1 font-semibold text-cyan transition-all group-hover:gap-2 sm:inline-flex">
          Claim a spot
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
