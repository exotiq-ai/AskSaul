import { runQaRegression } from "../src/tools/run-qa-regression.js";

async function main() {
  const r = await runQaRegression({
    scenarios_file: "docs/clients/wolfs-tailor/qa-scenarios.jsonl",
    stop_on_first_fail: false,
  });
  console.log(JSON.stringify(r, null, 2));
  if (r.failed) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
