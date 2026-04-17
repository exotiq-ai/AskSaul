// app/demos/wolfs-tailor/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sawyer — AI Reservationist Demo | The Wolf's Tailor × AskSaul",
  description:
    "Talk to Sawyer, the AI reservationist built for The Wolf's Tailor. Live demo — ask about hours, pricing, allergies, or try to book.",
};

const AGENT_ID = process.env.ELEVENLABS_AGENT_ID ?? "";

const SAMPLE_PROMPTS = [
  "What are your hours?",
  "I have a severe garlic allergy. Can you accommodate?",
  "Can I book for ten people for a birthday?",
  "I need to cancel my reservation for tomorrow.",
];

export default function WolfsTailorDemoPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="mb-2 text-xs uppercase tracking-widest text-neutral-400">
          AskSaul × The Wolf&apos;s Tailor
        </p>
        <h1 className="mb-4 text-4xl font-semibold">Meet Sawyer.</h1>
        <p className="mb-8 text-lg text-neutral-300">
          She answers the phone at a two-Michelin-star restaurant. She knows the hours, the pricing,
          the cancellation tiers, and the exact phrasing for the allergies the kitchen cannot
          accommodate — soy, allium, citrus. She never says yes when the answer is no.
        </p>

        <div className="mb-8 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          {AGENT_ID ? (
            <div dangerouslySetInnerHTML={{ __html: `<elevenlabs-convai agent-id="${AGENT_ID}"></elevenlabs-convai>` }} />
          ) : (
            <p className="text-neutral-500">Widget not yet provisioned (ELEVENLABS_AGENT_ID unset).</p>
          )}
          <script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript" />
        </div>

        <h2 className="mb-3 text-sm uppercase tracking-widest text-neutral-400">Try asking:</h2>
        <ul className="mb-10 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {SAMPLE_PROMPTS.map((p) => (
            <li key={p} className="rounded-lg border border-neutral-800 px-4 py-3 text-sm text-neutral-300">
              &ldquo;{p}&rdquo;
            </li>
          ))}
        </ul>

        <section className="mb-10 rounded-2xl border border-amber-900/60 bg-amber-950/20 p-6">
          <h3 className="mb-2 text-lg font-medium text-amber-300">The allergy landmine</h3>
          <p className="text-neutral-300">
            The Wolf&apos;s Tailor&apos;s tasting menu cannot accommodate soy, allium
            (garlic/onion/leek/shallot), or citrus allergies. A human host who hedges on this costs
            the restaurant a bad review. Sawyer says no the same way every time. Ask her about
            garlic.
          </p>
        </section>

        <footer className="text-sm text-neutral-500">
          Built by{" "}
          <a className="underline" href="https://asksaul.ai">
            AskSaul.ai
          </a>
          . Voice: Jessica via ElevenLabs <code>eleven_flash_v2</code>. Knowledge base: 15
          restaurant-specific documents.
        </footer>
      </div>
    </main>
  );
}
