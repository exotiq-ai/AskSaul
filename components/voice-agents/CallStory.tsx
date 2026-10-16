"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarCheck, Database, MessageSquareText, PhoneIncoming } from "lucide-react";
import Waveform from "@/components/site/Waveform";

const STEPS = [
  {
    time: "8:43 PM",
    title: "A furnace dies in Longmont.",
    body: "Your crew is home for the night. Normally this call hits voicemail, and the homeowner dials the next shop on Google.",
  },
  {
    time: "8:43 PM",
    title: "Saul answers on the second ring.",
    body: "He says he is an AI assistant, right up front. Callers care more about getting help tonight than who picks up.",
  },
  {
    time: "8:44 PM",
    title: "He asks your questions.",
    body: "Service needed, address, urgency, best callback time. Your intake rules, your service area, your tone.",
  },
  {
    time: "8:46 PM",
    title: "The lead lands in your CRM.",
    body: "A clean record in GoHighLevel with tags and a summary. No mystery voicemails, no half-remembered callbacks.",
  },
  {
    time: "8:46 PM",
    title: "Your on-call tech gets the text.",
    body: "Emergency? It routes now. Can wait? It is first on tomorrow's list. Your rules decide.",
  },
  {
    time: "7:30 AM",
    title: "The job is on the board.",
    body: "One call that used to walk to a competitor is now a booked job. That is the whole point.",
  },
];

const TRANSCRIPT = [
  { from: "saul", text: "Thanks for calling Front Range Heating. This is Saul, the AI assistant. What's going on?", at: 1 },
  { from: "caller", text: "Our furnace just quit and it's getting cold fast.", at: 1 },
  { from: "saul", text: "Got it. What's the address, and is anyone at home vulnerable to the cold?", at: 2 },
  { from: "caller", text: "1420 Pratt St, Longmont. Two kids at home.", at: 2 },
];

function Phone({ active }: { active: number }) {
  return (
    <div className="relative mx-auto w-full max-w-[360px]">
      <div className="absolute -inset-10 rounded-full bg-cyan/10 blur-3xl" aria-hidden="true" />
      <div className="relative rounded-[2.75rem] border border-white/10 bg-carbon p-3 shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
        <div className="rounded-[2.2rem] border border-wire bg-obsidian px-5 pb-6 pt-5 min-h-[560px]">
          <div className="mb-6 flex items-center justify-between text-xs text-dim">
            <span className="font-mono">{STEPS[active].time}</span>
            <span className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${active === 0 ? "bg-warning" : "bg-cyan"}`} />
              {active === 0 ? "Incoming call" : active < 3 ? "Saul on the line" : "Call complete"}
            </span>
          </div>

          {active === 0 ? (
            <div className="flex flex-col items-center pt-16 text-center">
              <div className="relative mb-8 flex h-20 w-20 items-center justify-center">
                <span className="ring-pulse absolute inset-0 rounded-full bg-warning/40" />
                <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-graphite ring-1 ring-warning/50">
                  <PhoneIncoming className="h-8 w-8 text-warning" />
                </span>
              </div>
              <p className="text-lg font-semibold text-cloud">(720) 555-0144</p>
              <p className="text-sm text-dim">Longmont, CO</p>
              <p className="mt-10 text-sm text-slate">Nobody at the shop to pick up.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {active < 3 && <Waveform className="mb-5 h-8 justify-center" />}
              {TRANSCRIPT.filter((l) => l.at <= Math.min(active, 2)).map((line) => (
                <div
                  key={line.text}
                  className={`rise max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-snug ${
                    line.from === "saul"
                      ? "rounded-tl-sm bg-cyan/12 text-cloud ring-1 ring-cyan/25"
                      : "ml-auto rounded-tr-sm bg-graphite text-slate"
                  }`}
                >
                  {line.text}
                </div>
              ))}

              {active >= 3 && (
                <div className="rise rounded-2xl border border-cyan/30 bg-carbon p-4 text-[13px]">
                  <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cyan">
                    <Database className="h-3.5 w-3.5" /> New lead · GHL
                  </div>
                  <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-slate">
                    <dt className="text-dim">Job</dt><dd>No heat, furnace</dd>
                    <dt className="text-dim">Where</dt><dd>1420 Pratt St, Longmont</dd>
                    <dt className="text-dim">Urgency</dt><dd className="font-semibold text-warning">Emergency</dd>
                    <dt className="text-dim">Note</dt><dd>Two kids at home</dd>
                  </dl>
                </div>
              )}

              {active >= 4 && (
                <div className="rise flex gap-3 rounded-2xl bg-graphite p-4 text-[13px]" style={{ ["--d" as string]: "120ms" }}>
                  <MessageSquareText className="h-4 w-4 shrink-0 text-ice" />
                  <p className="text-slate">
                    <span className="font-semibold text-cloud">Saul to on-call:</span> Emergency no-heat in Longmont, kids at home. Callback requested now.
                  </p>
                </div>
              )}

              {active >= 5 && (
                <div className="rise flex items-center gap-3 rounded-2xl bg-cyan p-4 text-[13px] font-semibold text-obsidian">
                  <CalendarCheck className="h-5 w-5" /> Booked: 8:00 AM, furnace repair
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CallStory() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative bg-obsidian py-32 sm:py-40" aria-labelledby="call-story-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mb-20 max-w-3xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-cyan">One call, start to finish</p>
          <h2 id="call-story-title" className="font-display text-4xl font-bold leading-[1.02] text-cloud sm:text-6xl">
            The call you would have missed.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_420px] lg:gap-24">
          <ol className="relative">
            <span className="absolute bottom-0 left-[11px] top-2 hidden w-px bg-wire sm:block" aria-hidden="true" />
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                data-step={i}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className="relative flex min-h-[38vh] gap-8 pb-16 lg:min-h-[62vh]"
              >
                <span
                  className={`relative z-10 mt-2 hidden h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-500 sm:flex ${
                    i <= active ? "border-cyan bg-cyan/20" : "border-wire bg-obsidian"
                  }`}
                  aria-hidden="true"
                >
                  <span className={`h-2 w-2 rounded-full transition-colors duration-500 ${i <= active ? "bg-cyan" : "bg-wire"}`} />
                </span>
                <div className={`transition-opacity duration-500 ${i === active ? "lg:opacity-100" : "lg:opacity-35"}`}>
                  <p className="mb-3 font-mono text-sm text-cyan">{step.time}</p>
                  <h3 className="mb-4 font-display text-3xl font-bold leading-tight text-cloud sm:text-4xl">{step.title}</h3>
                  <p className="max-w-md text-lg leading-relaxed text-slate">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="hidden lg:block">
            <div className="sticky top-32">
              <Phone active={active} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
