import { runProvisionAgent } from "../src/tools/provision-agent.js";

async function main() {
  const existing = process.env.ELEVENLABS_AGENT_ID || undefined;
  const result = await runProvisionAgent({
    client_dir: "docs/clients/wolfs-tailor",
    existing_agent_id: existing,
    attach_kb_docs: true,
  });
  console.log(JSON.stringify(result, null, 2));
  console.log(
    `\n→ write ELEVENLABS_AGENT_ID=${result.agent_id} to .env.local (and Netlify env)`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
