import { CalendarCheck, Database, Mail, MessageSquareText, PhoneIncoming, Star } from "lucide-react";

const EVENTS = [
  { icon: PhoneIncoming, title: "After-hours call answered", meta: "No-heat emergency · Longmont", time: "8:43 PM" },
  { icon: Database, title: "Lead logged in CRM", meta: "Tagged: emergency, furnace", time: "8:46 PM" },
  { icon: Mail, title: "Quote follow-up sent", meta: "Day 2 of 5 · roof replacement", time: "9:00 AM" },
  { icon: MessageSquareText, title: "FAQ answered by Saul", meta: "\"Do you serve Loveland?\"", time: "9:12 AM" },
  { icon: CalendarCheck, title: "Estimate booked", meta: "Thursday 10:00 AM", time: "9:14 AM" },
  { icon: Star, title: "Review request sent", meta: "Job closed · 5-star prompt", time: "4:30 PM" },
];

function Row({ e }: { e: (typeof EVENTS)[number] }) {
  const Icon = e.icon;
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-carbon/90 p-4 backdrop-blur">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan/10 ring-1 ring-cyan/25">
        <Icon className="h-5 w-5 text-cyan" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-cloud">{e.title}</p>
        <p className="truncate text-sm text-dim">{e.meta}</p>
      </div>
      <span className="font-mono text-xs text-dim">{e.time}</span>
    </div>
  );
}

export default function ActivityFeed() {
  return (
    <div className="relative" aria-hidden="true">
      <div className="absolute -inset-12 rounded-full bg-cyan/10 blur-3xl" />
      <div className="relative rounded-[2rem] border border-white/10 bg-obsidian/70 p-4 shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
        <div className="mb-3 flex items-center justify-between px-2 pt-1 text-xs">
          <span className="font-semibold uppercase tracking-[0.2em] text-slate">Saul, today</span>
          <span className="flex items-center gap-1.5 text-cyan">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan" /> Live
          </span>
        </div>
        <div className="mask-fade-y h-[380px] overflow-hidden">
          <div className="feed-scroll space-y-3">
            {[...EVENTS, ...EVENTS].map((e, i) => (
              <Row key={i} e={e} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
