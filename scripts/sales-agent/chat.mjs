// Minimal text-only client for the sales agent over the ElevenLabs websocket.
// Used by the eval runner; mirrors what the site widget does.
const WS_URL = "wss://api.elevenlabs.io/v1/convai/conversation";

export async function runConversation({ agentId, turns, dynamicVariables = {}, toolResults = {}, timeoutMs = 60000 }) {
  const ws = new WebSocket(`${WS_URL}?agent_id=${agentId}`);
  const transcript = [];
  const toolCalls = [];
  let pending = null;
  let current = "";

  const done = (resolve) => () => {
    if (current) transcript.push({ role: "agent", text: current.trim() });
    current = "";
    resolve();
  };

  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", (e) => reject(new Error(`ws error ${e.message ?? ""}`)), { once: true });
  });

  ws.send(
    JSON.stringify({
      type: "conversation_initiation_client_data",
      conversation_config_override: { conversation: { text_only: true } },
      dynamic_variables: { page_path: "/voice-agents", today: "October 15, 2026", prior_transcript: "", ...dynamicVariables },
    })
  );

  ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(ev.data);
    switch (msg.type) {
      case "ping":
        ws.send(JSON.stringify({ type: "pong", event_id: msg.ping_event.event_id }));
        break;
      case "agent_response":
        current += (current ? "\n" : "") + msg.agent_response_event.agent_response;
        clearTimeout(pending?.timer);
        if (pending) pending.timer = setTimeout(pending.finish, 2500);
        break;
      case "client_tool_call": {
        const { tool_name, tool_call_id, parameters } = msg.client_tool_call;
        toolCalls.push({ tool: tool_name, parameters });
        const result = toolResults[tool_name] ?? "ok";
        ws.send(JSON.stringify({ type: "client_tool_result", tool_call_id, result, is_error: false }));
        clearTimeout(pending?.timer);
        if (pending) pending.timer = setTimeout(pending.finish, 6000);
        break;
      }
      case "conversation_initiation_metadata":
        transcript.conversationId = msg.conversation_initiation_metadata_event.conversation_id;
        break;
    }
  });

  for (const text of turns) {
    transcript.push({ role: "user", text });
    await new Promise((resolve) => {
      pending = { finish: done(resolve) };
      pending.timer = setTimeout(pending.finish, timeoutMs);
      ws.send(JSON.stringify({ type: "user_message", text }));
    });
    pending = null;
  }
  ws.close();
  return { transcript, toolCalls, conversationId: transcript.conversationId };
}
