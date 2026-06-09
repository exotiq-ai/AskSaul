"use client";

import { useEffect } from "react";

type EventPayload = {
  category: string;
  action: string;
  label?: string;
  href?: string;
  path: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (command: "event", action: string, params?: Record<string, unknown>) => void;
    plausible?: (event: string, options?: { props?: Record<string, unknown> }) => void;
  }
}

function cleanText(value: string | null | undefined) {
  return value?.replace(/\s+/g, " ").trim().slice(0, 120) || undefined;
}

function classifyClick(target: Element): EventPayload | null {
  const interactive = target.closest("a, button") as HTMLAnchorElement | HTMLButtonElement | null;
  if (!interactive) return null;

  const href = interactive instanceof HTMLAnchorElement ? interactive.href : undefined;
  const path = window.location.pathname;
  const label =
    cleanText(interactive.getAttribute("data-analytics-label")) ||
    cleanText(interactive.getAttribute("aria-label")) ||
    cleanText(interactive.textContent) ||
    cleanText(href);

  if (href?.startsWith("tel:")) {
    return { category: "conversion", action: "phone_click", label, href, path };
  }

  if (href?.includes("/build-your-proposal")) {
    return { category: "conversion", action: "automation_map_click", label, href, path };
  }

  if (href?.includes("/voice-agents/waste")) {
    return { category: "conversion", action: "waste_page_click", label, href, path };
  }

  if (href?.startsWith("mailto:")) {
    return { category: "conversion", action: "email_click", label, href, path };
  }

  if (label?.toLowerCase().includes("open chat")) {
    return { category: "chat", action: "chat_open", label, path };
  }

  if (label?.toLowerCase().includes("send message")) {
    return { category: "chat", action: "chat_message_send", label, path };
  }

  if (href && new URL(href).origin !== window.location.origin) {
    return { category: "engagement", action: "external_link_click", label, href, path };
  }

  return null;
}

function track(payload: EventPayload) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: payload.action, ...payload });

  window.gtag?.("event", payload.action, {
    event_category: payload.category,
    event_label: payload.label,
    link_url: payload.href,
    page_path: payload.path,
  });

  window.plausible?.(payload.action, {
    props: {
      category: payload.category,
      label: payload.label,
      href: payload.href,
      path: payload.path,
    },
  });
}

export default function ConversionTracker() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const payload = classifyClick(event.target);
      if (payload) track(payload);
    }

    function onSubmit(event: SubmitEvent) {
      if (!(event.target instanceof HTMLFormElement)) return;
      const formText = cleanText(event.target.textContent) || "form";
      const path = window.location.pathname;
      const action = path.includes("build-your-proposal")
        ? "automation_map_submit"
        : path.includes("voice-agents")
          ? "voice_agent_form_submit"
          : "contact_form_submit";

      track({ category: "conversion", action, label: formText, path });
    }

    document.addEventListener("click", onClick, { capture: true });
    document.addEventListener("submit", onSubmit, { capture: true });

    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("submit", onSubmit, { capture: true });
    };
  }, []);

  return null;
}
