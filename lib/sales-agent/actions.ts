import { BOOKING_URL, DEMO_PHONE_DISPLAY, DEMO_PHONE_HREF } from "@/lib/constants";

export type ActionId =
  | "claim_founding"
  | "free_audit"
  | "call_demo"
  | "book_call"
  | "automation_map"
  | "roofing_page"
  | "hvac_page"
  | "voice_page"
  | "waste_page"
  | "case_study_lous";

export type ChatAction = { id: ActionId; label: string; href: string; external?: boolean; primary?: boolean };

export const ACTIONS: Record<ActionId, ChatAction> = {
  claim_founding: { id: "claim_founding", label: "Claim a founding spot", href: "/voice-agents#founding", primary: true },
  free_audit: { id: "free_audit", label: "Get the free audit", href: "/audit" },
  call_demo: { id: "call_demo", label: `Call Saul: ${DEMO_PHONE_DISPLAY}`, href: DEMO_PHONE_HREF },
  book_call: { id: "book_call", label: "Book a 20-min call", href: BOOKING_URL, external: true },
  automation_map: { id: "automation_map", label: "Get your Automation Map", href: "/build-your-proposal", primary: true },
  roofing_page: { id: "roofing_page", label: "Saul for roofers", href: "/voice-agents/roofing" },
  hvac_page: { id: "hvac_page", label: "Saul for HVAC", href: "/voice-agents/hvac" },
  voice_page: { id: "voice_page", label: "How Saul answers calls", href: "/voice-agents" },
  waste_page: { id: "waste_page", label: "Try the waste demos", href: "/voice-agents/waste" },
  case_study_lous: { id: "case_study_lous", label: "Lou's case study", href: "/case-studies/lous-hvac" },
};

const TAG = /\[\[\s*actions?\s*:\s*([^\]]*)\]\]/gi;

/** Splits an agent message into display text and the action buttons it asked for. */
export function parseAgentMessage(raw: string): { text: string; actions: ChatAction[] } {
  const ids = new Set<ActionId>();
  for (const match of raw.matchAll(TAG)) {
    for (const id of match[1].split(",").map((s) => s.trim())) {
      if (id in ACTIONS) ids.add(id as ActionId);
    }
  }
  // Also hide a tag that is still streaming in ("[[actions: free_au").
  const text = raw.replace(TAG, "").replace(/\[\[[^\]]*$/, "").trim();
  return { text, actions: [...ids].slice(0, 3).map((id) => ACTIONS[id]) };
}
