#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

import { syncKnowledgeBaseTool } from "./tools/sync-knowledge-base.js";
import { provisionAgentTool } from "./tools/provision-agent.js";
import { runQaRegressionTool } from "./tools/run-qa-regression.js";

interface ToolDef {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  run(input: unknown): Promise<unknown>;
}

const TOOLS: ToolDef[] = [syncKnowledgeBaseTool, provisionAgentTool, runQaRegressionTool];

async function main() {
  if (!process.env.ELEVENLABS_API_KEY) {
    console.error("[mcp-elevenlabs] ELEVENLABS_API_KEY not set. Tools will fail at call time.");
  }

  const server = new Server(
    { name: "asksaul-elevenlabs", version: "0.1.0" },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOLS.map((t) => ({
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema,
    })),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    const tool = TOOLS.find((t) => t.name === req.params.name);
    if (!tool) {
      return { isError: true, content: [{ type: "text", text: `unknown tool: ${req.params.name}` }] };
    }
    try {
      const result = await tool.run(req.params.arguments ?? {});
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    } catch (err) {
      return { isError: true, content: [{ type: "text", text: (err as Error).message }] };
    }
  });

  await server.connect(new StdioServerTransport());
  console.error("[mcp-elevenlabs] running on stdio");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
