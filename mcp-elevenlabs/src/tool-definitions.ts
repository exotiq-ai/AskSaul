// mcp-elevenlabs/src/tool-definitions.ts
// These are the tool definitions the agent uses during a call.
// The agent POSTs to these URLs with the x-voice-tool-secret header.
// Tool names are snake_case and match the outcome inference in app/api/voice/webhook/route.ts.

export function buildAgentTools(siteUrl: string, toolSecret: string) {
  const headers = { "x-voice-tool-secret": toolSecret, "content-type": "application/json" };
  const base = `${siteUrl.replace(/\/$/, "")}/api/voice/tools`;

  return [
    {
      type: "webhook",
      name: "check_availability",
      description:
        "Check if a date/time/party-size is available for booking. Returns a message to read back and a Tock URL. Use when the guest gives date + time + party size.",
      webhook: {
        url: `${base}/check-availability`,
        method: "POST",
        headers,
      },
      parameters: {
        type: "object",
        properties: {
          conversation_id: { type: "string" },
          date: { type: "string", description: "YYYY-MM-DD" },
          time: { type: "string", description: "HH:MM, 24-hr" },
          party_size: { type: "integer" },
        },
        required: ["conversation_id", "date", "time", "party_size"],
      },
    },
    {
      type: "webhook",
      name: "create_lead",
      description:
        "Capture a booking lead for parties of 2–6. Use when the guest wants the team to follow up or when availability is uncertain.",
      webhook: { url: `${base}/create-lead`, method: "POST", headers },
      parameters: {
        type: "object",
        properties: {
          conversation_id: { type: "string" },
          name: { type: "string" },
          phone: { type: "string" },
          email: { type: "string" },
          date: { type: "string" },
          time: { type: "string" },
          party_size: { type: "integer" },
          occasion: { type: "string" },
          allergies: { type: "string" },
          notes: { type: "string" },
        },
        required: ["conversation_id", "name", "phone", "date", "party_size"],
      },
    },
    {
      type: "webhook",
      name: "private_dining_intake",
      description: "Capture intake for parties of 7+. ONLY use when party_size >= 7.",
      webhook: { url: `${base}/private-dining-intake`, method: "POST", headers },
      parameters: {
        type: "object",
        properties: {
          conversation_id: { type: "string" },
          name: { type: "string" },
          phone: { type: "string" },
          email: { type: "string" },
          party_size: { type: "integer" },
          requested_date: { type: "string" },
          occasion: { type: "string" },
          preferred_experience: { type: "string" },
          notes: { type: "string" },
        },
        required: ["conversation_id", "name", "phone", "party_size"],
      },
    },
    {
      type: "webhook",
      name: "message_for_team",
      description:
        "Take a message for the team. Use for refund disputes, complaints, media, employment, or anything outside the knowledge base.",
      webhook: { url: `${base}/message-for-team`, method: "POST", headers },
      parameters: {
        type: "object",
        properties: {
          conversation_id: { type: "string" },
          name: { type: "string" },
          phone: { type: "string" },
          reason: { type: "string", enum: ["refund_dispute", "past_experience", "media", "employment", "other"] },
          notes: { type: "string" },
        },
        required: ["conversation_id", "name", "phone", "reason", "notes"],
      },
    },
    {
      type: "webhook",
      name: "get_menu_theme",
      description: "Get the current seasonal menu theme.",
      webhook: { url: `${base}/get-menu-theme`, method: "POST", headers },
      parameters: { type: "object", properties: {}, required: [] },
    },
  ];
}
