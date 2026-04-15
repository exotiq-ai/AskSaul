#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { listProposalsTool } from "./tools/list-proposals.js";
import { getProposalTool } from "./tools/get-proposal.js";
import { scoreLeadTool } from "./tools/score-lead.js";
import { draftProposalTool } from "./tools/draft-proposal.js";
import { approveAndSendProposalTool } from "./tools/approve-and-send-proposal.js";
import { updateStatusTool } from "./tools/update-status.js";
import { syncToGhlTool } from "./tools/sync-to-ghl.js";

interface ToolDef {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  run(input: unknown): Promise<unknown>;
}

const TOOLS: ToolDef[] = [
  listProposalsTool,
  getProposalTool,
  scoreLeadTool,
  draftProposalTool,
  approveAndSendProposalTool,
  updateStatusTool,
  syncToGhlTool,
];

function assertEnv() {
  const required = [
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "RESEND_API_KEY",
    "RESEND_FROM_EMAIL",
  ];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error(
      `[asksaul-mcp] Warning: missing env vars: ${missing.join(", ")}. Tools that need them will fail at call time.`
    );
  }
  // Optional but useful; log for visibility:
  const optional = [
    "RESEND_FROM_NAME",
    "INTERNAL_NOTIFICATION_EMAIL",
    "ADMIN_API_SECRET",
    "NEXT_PUBLIC_SITE_URL",
  ];
  for (const k of optional) {
    if (!process.env[k]) console.error(`[asksaul-mcp] Info: ${k} not set.`);
  }
}

async function main() {
  assertEnv();

  const server = new Server(
    { name: "asksaul-mcp", version: "0.1.0" },
    { capabilities: { tools: {} } }
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
      return {
        isError: true,
        content: [
          { type: "text", text: `Unknown tool: ${req.params.name}` },
        ],
      };
    }
    try {
      const result = await tool.run(req.params.arguments ?? {});
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        structuredContent: result as Record<string, unknown>,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        isError: true,
        content: [{ type: "text", text: `Error in ${tool.name}: ${message}` }],
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[asksaul-mcp] Ready on stdio.");
}

main().catch((err) => {
  console.error("[asksaul-mcp] Fatal:", err);
  process.exit(1);
});
