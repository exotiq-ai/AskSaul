const LEAKS = [
  {
    title: "Missed calls",
    today: "Calls hit voicemail while customers dial the next company.",
    fix: "A voice agent that answers, qualifies, and routes the lead.",
  },
  {
    title: "Dead follow-up",
    today: "Leads fill out a form, then wait days for a real reply.",
    fix: "Email and SMS follow-up that fires on its own and keeps the next step clear.",
  },
  {
    title: "Repeat questions",
    today: "Your team answers pricing, hours, and service-area questions all day.",
    fix: "An assistant trained on your services and policies.",
  },
  {
    title: "Admin drag",
    today: "Staff copy and paste between inboxes, sheets, CRMs, and calendars.",
    fix: "Automations that update your tools and hand off clean.",
  },
];

export default function WorkLeaks() {
  return (
    <section className="relative bg-obsidian py-32 sm:py-40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 lg:px-8">
        <div className="lg:sticky lg:top-36 lg:self-start">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-cyan">Where the work leaks</p>
          <h2 className="font-display text-4xl font-bold leading-[1.02] text-cloud sm:text-6xl">
            You don&apos;t need another tool. You need the work done.
          </h2>
        </div>

        <div className="space-y-6">
          {LEAKS.map((leak, i) => (
            <article
              key={leak.title}
              className="sticky rounded-3xl border border-wire bg-carbon p-8 shadow-[0_-20px_60px_rgba(0,0,0,0.5)] sm:p-10"
              style={{ top: `calc(8rem + ${i * 1.25}rem)` }}
            >
              <div className="mb-8 flex items-baseline justify-between">
                <h3 className="font-display text-3xl font-bold text-cloud sm:text-4xl">{leak.title}</h3>
                <span className="font-mono text-sm text-dim">0{i + 1}</span>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-dim">Today</p>
                  <p className="leading-relaxed text-slate">{leak.today}</p>
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan">With Saul</p>
                  <p className="leading-relaxed text-cloud">{leak.fix}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
