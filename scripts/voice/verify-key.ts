/**
 * Smoke-test the ElevenLabs API key. Run with: npm run voice:verify-key
 * Exits 0 on success, 1 on any failure, prints plan details.
 */
const KEY = process.env.ELEVENLABS_API_KEY;

if (!KEY) {
  console.error("[verify-key] ELEVENLABS_API_KEY is not set. Check .env.local.");
  process.exit(1);
}

async function main() {
  const res = await fetch("https://api.elevenlabs.io/v1/user/subscription", {
    headers: { "xi-api-key": KEY! },
  });
  if (!res.ok) {
    console.error(`[verify-key] ElevenLabs returned ${res.status}: ${await res.text()}`);
    process.exit(1);
  }
  const sub = await res.json();
  console.log("[verify-key] OK");
  console.log(`  tier:           ${sub.tier}`);
  console.log(`  chars used:     ${sub.character_count?.toLocaleString()}`);
  console.log(`  chars limit:    ${sub.character_limit?.toLocaleString()}`);
  console.log(`  voice slots:    ${sub.voice_slots_used}/${sub.voice_limit}`);
  console.log(`  status:         ${sub.status}`);
  if (sub.pending_change?.kind === "cancellation") {
    const when = new Date(sub.pending_change.timestamp_seconds * 1000).toISOString();
    console.warn(`  ⚠ pending cancellation scheduled: ${when}`);
  }
}

main().catch((e) => {
  console.error("[verify-key] unexpected error:", e);
  process.exit(1);
});
