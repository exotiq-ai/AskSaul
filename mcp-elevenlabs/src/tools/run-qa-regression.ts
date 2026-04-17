import { z } from "zod";
import { readFile } from "node:fs/promises";

export const runQaInput = z.object({
  agent_id: z.string().optional(),
  scenarios_file: z.string().default("docs/clients/wolfs-tailor/qa-scenarios.jsonl"),
  stop_on_first_fail: z.boolean().default(false),
});

export type QaInput = z.infer<typeof runQaInput>;

export interface QaScenario {
  id: string;
  prompt: string;
  must_contain?: string[];
  must_not_contain?: string[];
  must_call_tool?: string;
  policy_critical?: boolean;
}

export interface QaFailure {
  id: string;
  reason: string;
  response: string;
}

export interface QaResult {
  total: number;
  passed: number;
  failed: number;
  failures: QaFailure[];
}

// Endpoint shape verified via probe against live agent on 2026-04-17:
//   POST /v1/convai/agents/{id}/simulate-conversation
//   body: { simulation_specification: { simulated_user_config: { prompt: { prompt: "..." } } } }
//   response: { simulated_conversation: [{ role: "agent"|"user", message: string, tool_calls: [{name, ...}] }, ...], analysis, guardrails_result }
interface SimTurn {
  role?: string;
  message?: string;
  tool_calls?: Array<{ name?: string; tool_name?: string }>;
}
interface SimResponse {
  simulated_conversation?: SimTurn[];
  error?: unknown;
}

export async function runQaRegression(input: QaInput): Promise<QaResult> {
  const agentId = input.agent_id ?? process.env.ELEVENLABS_AGENT_ID;
  if (!agentId) throw new Error("agent_id not provided and ELEVENLABS_AGENT_ID not set");
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error("ELEVENLABS_API_KEY not set");

  const lines = (await readFile(input.scenarios_file, "utf8")).split("\n").filter((l) => l.trim());
  const scenarios: QaScenario[] = lines.map((l) => JSON.parse(l));

  const result: QaResult = { total: scenarios.length, passed: 0, failed: 0, failures: [] };

  for (const s of scenarios) {
    // Inject the scenario prompt as the simulated user's instruction so the first
    // user turn is exactly the test prompt.
    const simRes = await fetch(
      `https://api.elevenlabs.io/v1/convai/agents/${agentId}/simulate-conversation`,
      {
        method: "POST",
        headers: { "xi-api-key": key, "content-type": "application/json" },
        body: JSON.stringify({
          simulation_specification: {
            simulated_user_config: {
              prompt: {
                prompt: `You are testing the agent. Say exactly: "${s.prompt}" and nothing else.`,
              },
            },
          },
        }),
      },
    );
    const body: SimResponse = simRes.ok
      ? ((await simRes.json()) as SimResponse)
      : ({ error: await simRes.text() } as SimResponse);

    const turns = body.simulated_conversation ?? [];
    // Collect all agent text (first agent turn after the user prompt is what we evaluate,
    // but we join all subsequent agent text to allow phrases spread across turns).
    const agentText = turns
      .filter((t) => t.role === "agent")
      .map((t) => t.message ?? "")
      .join("\n");
    const text = agentText || JSON.stringify(body);
    const calledTools: string[] = turns.flatMap((t) =>
      (t.tool_calls ?? []).map((c) => c.name ?? c.tool_name ?? ""),
    );

    const fail = (reason: string) => {
      result.failed++;
      result.failures.push({ id: s.id, reason, response: text });
      if (input.stop_on_first_fail) throw new Error(`QA stopped on ${s.id}: ${reason}`);
    };

    let ok = true;
    for (const phrase of s.must_contain ?? []) {
      if (!new RegExp(phrase, "i").test(text)) {
        fail(`missing '${phrase}'`);
        ok = false;
        break;
      }
    }
    if (ok)
      for (const phrase of s.must_not_contain ?? []) {
        if (new RegExp(phrase, "i").test(text)) {
          fail(`contained forbidden '${phrase}'`);
          ok = false;
          break;
        }
      }
    if (ok && s.must_call_tool && !calledTools.includes(s.must_call_tool)) {
      fail(`did not call tool '${s.must_call_tool}'`);
      ok = false;
    }
    if (ok) result.passed++;
  }

  return result;
}

export const runQaRegressionTool = {
  name: "run_qa_regression",
  description: "Run the scenario suite against the live agent. Reports pass/fail per scenario.",
  inputSchema: {
    type: "object",
    properties: {
      agent_id: { type: "string" },
      scenarios_file: { type: "string", default: "docs/clients/wolfs-tailor/qa-scenarios.jsonl" },
      stop_on_first_fail: { type: "boolean", default: false },
    },
  },
  async run(raw: unknown) {
    const input = runQaInput.parse(raw);
    return runQaRegression(input);
  },
};
