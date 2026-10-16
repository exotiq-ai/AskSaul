"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { CalendarCheck, Database, MessageSquareText, PhoneIncoming } from "lucide-react";
import Waveform from "@/components/site/Waveform";
import { HVAC_STORY, type CallStoryData } from "./stories";

function Phone({ active, story }: { active: number; story: CallStoryData }) {
  return (
    <div className="relative mx-auto w-full max-w-[360px]">
      <div className="absolute -inset-10 rounded-full bg-cyan/10 blur-3xl" aria-hidden="true" />
      <div className="relative rounded-[2.75rem] border border-white/10 bg-carbon p-3 shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
        <div className="rounded-[2.2rem] border border-wire bg-obsidian px-5 pb-6 pt-5 min-h-[560px]">
          <div className="mb-6 flex items-center justify-between text-xs text-dim">
            <span className="font-mono">{story.steps[active].time}</span>
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
              <p className="text-lg font-semibold text-cloud">{story.caller.number}</p>
              <p className="text-sm text-dim">{story.caller.place}</p>
              <p className="mt-10 text-sm text-slate">Nobody at the shop to pick up.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {active < 3 && <Waveform className="mb-5 h-8 justify-center" />}
              {story.transcript.filter((l) => l.at <= Math.min(active, 2)).map((line) => (
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
                    {story.lead.map(([k, v, hot]) => (
                      <Fragment key={k}>
                        <dt className="text-dim">{k}</dt>
                        <dd className={hot ? "font-semibold text-warning" : undefined}>{v}</dd>
                      </Fragment>
                    ))}
                  </dl>
                </div>
              )}

              {active >= 4 && (
                <div className="rise flex gap-3 rounded-2xl bg-graphite p-4 text-[13px]" style={{ ["--d" as string]: "120ms" }}>
                  <MessageSquareText className="h-4 w-4 shrink-0 text-ice" />
                  <p className="text-slate">
                    <span className="font-semibold text-cloud">Saul to on-call:</span> {story.sms}
                  </p>
                </div>
              )}

              {active >= 5 && (
                <div className="rise flex items-center gap-3 rounded-2xl bg-cyan p-4 text-[13px] font-semibold text-obsidian">
                  <CalendarCheck className="h-5 w-5" /> {story.booked}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CallStory({ story = HVAC_STORY }: { story?: CallStoryData }) {
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
            {story.heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_420px] lg:gap-24">
          <ol className="relative">
            <span className="absolute bottom-0 left-[11px] top-2 hidden w-px bg-wire sm:block" aria-hidden="true" />
            {story.steps.map((step, i) => (
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
              <Phone active={active} story={story} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
