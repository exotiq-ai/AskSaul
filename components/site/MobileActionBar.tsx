import Link from "next/link";
import { PhoneCall } from "lucide-react";
import { DEMO_PHONE_DISPLAY, DEMO_PHONE_HREF } from "@/lib/constants";

export default function MobileActionBar({ claimHref = "#founding" }: { claimHref?: string }) {
  return (
    <div className="mobile-action-bar fixed inset-x-0 bottom-0 z-40 border-t border-wire/80 bg-obsidian/95 p-3 backdrop-blur-md md:hidden">
      <div className="grid grid-cols-2 gap-2">
        <a
          href={DEMO_PHONE_HREF}
          className="flex items-center justify-center gap-2 rounded-xl border border-wire py-3.5 text-[15px] font-semibold text-cloud"
        >
          <PhoneCall className="h-4 w-4 text-cyan" />
          Call {DEMO_PHONE_DISPLAY.replace(/[()]/g, "").replace(" ", "-")}
        </a>
        <Link
          href={claimHref}
          className="flex items-center justify-center rounded-xl bg-cyan py-3.5 text-[15px] font-semibold text-obsidian"
        >
          Claim a spot
        </Link>
      </div>
    </div>
  );
}
