import { runSyncKnowledgeBase } from "../src/tools/sync-knowledge-base.js";

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const result = await runSyncKnowledgeBase({
    client_slug: "wolfs-tailor",
    kb_dir: "docs/clients/wolfs-tailor/kb",
    dry_run: dryRun,
  });
  console.log(JSON.stringify(result, null, 2));
  if (result.errors.length) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
