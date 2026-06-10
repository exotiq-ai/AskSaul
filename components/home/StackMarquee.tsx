import Image from "next/image";

type StackItem = {
  name: string;
  role: string;
  logoSrc: string;
};

const STACK: StackItem[] = [
  { name: "OpenClaw", role: "agent orchestration", logoSrc: "/brand-logos/openclaw.svg" },
  { name: "GoHighLevel", role: "CRM + outbound", logoSrc: "/brand-logos/gohighlevel.svg" },
  { name: "Resend", role: "email backup", logoSrc: "/brand-logos/resend.svg" },
  { name: "Twilio", role: "phone + routing", logoSrc: "/brand-logos/twilio.svg" },
  { name: "ElevenLabs", role: "voice agents", logoSrc: "/brand-logos/elevenlabs.svg" },
  { name: "Next.js", role: "conversion sites", logoSrc: "/brand-logos/nextjs.svg" },
  { name: "Netlify", role: "deployment", logoSrc: "/brand-logos/netlify.svg" },
  { name: "OpenAI", role: "LLM workflows", logoSrc: "/brand-logos/openai.svg" },
  { name: "Anthropic", role: "reasoning layer", logoSrc: "/brand-logos/anthropic.svg" },
  { name: "OpenRouter", role: "model routing", logoSrc: "/brand-logos/openrouter.svg" },
  { name: "Supabase", role: "data + auth", logoSrc: "/brand-logos/supabase.svg" },
  { name: "Telegram", role: "operator channel", logoSrc: "/brand-logos/telegram.svg" },
  { name: "WhatsApp", role: "customer messaging", logoSrc: "/brand-logos/whatsapp.svg" },
  { name: "Slack", role: "team handoff", logoSrc: "/brand-logos/slack.svg" },
  { name: "Cloudflare", role: "edge preview", logoSrc: "/brand-logos/cloudflare.svg" },
];

function LogoCard({ item }: { item: StackItem }) {
  return (
    <div className="mx-3 flex min-w-[238px] items-center gap-4 rounded-2xl border border-white/10 bg-carbon/85 px-5 py-4 shadow-[0_18px_60px_rgba(0,0,0,0.22)] ring-1 ring-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan/35 hover:bg-graphite/90 hover:shadow-[0_22px_70px_rgba(0,212,170,0.08)]">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/[0.06] p-2.5 ring-1 ring-white/10" aria-hidden="true">
        <Image src={item.logoSrc} alt="" width={32} height={32} className="max-h-8 max-w-8 object-contain" />
      </span>
      <span className="min-w-0">
        <span className="block text-base font-bold leading-tight text-cloud">{item.name}</span>
        <span className="mt-1 block text-xs font-medium uppercase tracking-wider text-dim">{item.role}</span>
      </span>
    </div>
  );
}

export default function StackMarquee() {
  const items = [...STACK, ...STACK];

  return (
    <section className="relative overflow-hidden border-y border-wire bg-[linear-gradient(180deg,rgba(18,18,26,0.92),rgba(10,10,15,0.92))] py-10" aria-labelledby="stack-marquee-title">
      <div className="mx-auto mb-6 max-w-3xl px-4 text-center">
        <p id="stack-marquee-title" className="text-xs font-semibold uppercase tracking-widest text-cyan">
          Built with the stack serious operators already use
        </p>
        <p className="mt-2 text-sm text-slate">
          Phone, voice, CRM, email, website, and AI infrastructure wired into one practical workflow.
        </p>
      </div>

      <ul className="sr-only">
        {STACK.map((item) => (
          <li key={item.name}>{item.name}: {item.role}</li>
        ))}
      </ul>

      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-obsidian to-transparent sm:w-40" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-obsidian to-transparent sm:w-40" aria-hidden="true" />
      <div className="flex overflow-hidden" aria-hidden="true">
        <div className="flex min-w-max animate-marquee items-center motion-reduce:animate-none">
          {items.map((item, index) => (
            <LogoCard key={`${item.name}-${index}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
