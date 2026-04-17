const BASE = "https://api.elevenlabs.io/v1";

export interface KbDocument {
  id: string;
  name: string;
}

export interface KbAttachment {
  type: "file" | "url" | "text";
  id: string;
  name?: string;
}

export interface AgentConfig {
  name: string;
  conversation_config: {
    agent: {
      prompt: {
        prompt: string;
        llm: string;
        temperature?: number;
        // ElevenLabs attaches KB docs here (verified via GET /v1/convai/agents/{id}),
        // not at the top level of the agent config.
        knowledge_base?: KbAttachment[];
        tool_ids?: string[];
        tools?: unknown[];
      };
      first_message: string;
      language?: string;
    };
    tts: {
      voice_id: string;
      model_id: string;
      stability?: number;
      similarity_boost?: number;
      style?: number;
      use_speaker_boost?: boolean;
    };
    conversation?: { max_duration_seconds?: number };
  };
}

export class ElevenLabsClient {
  private key: string;

  constructor(apiKey?: string) {
    const k = apiKey ?? process.env.ELEVENLABS_API_KEY;
    if (!k) throw new Error("ELEVENLABS_API_KEY not set");
    this.key = k;
  }

  private async req(path: string, init: RequestInit = {}): Promise<Response> {
    const res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: { "xi-api-key": this.key, ...(init.headers ?? {}) },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`ElevenLabs ${init.method ?? "GET"} ${path} → ${res.status}: ${body}`);
    }
    return res;
  }

  async getSubscription(): Promise<unknown> {
    const res = await this.req("/user/subscription");
    return res.json();
  }

  async uploadKbFile(name: string, content: string): Promise<KbDocument> {
    const form = new FormData();
    form.append("file", new Blob([content], { type: "text/markdown" }), name);
    form.append("name", name);
    const res = await this.req("/convai/knowledge-base/file", {
      method: "POST",
      body: form,
    });
    return res.json();
  }

  async listKbDocuments(): Promise<{ documents: KbDocument[] }> {
    const res = await this.req("/convai/knowledge-base");
    return res.json();
  }

  async deleteKbDocument(id: string): Promise<void> {
    await this.req(`/convai/knowledge-base/${id}`, { method: "DELETE" });
  }

  async createAgent(config: AgentConfig): Promise<{ agent_id: string }> {
    const res = await this.req("/convai/agents/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    return res.json();
  }

  async updateAgent(agentId: string, config: Partial<AgentConfig>): Promise<unknown> {
    const res = await this.req(`/convai/agents/${agentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    return res.json();
  }

  async getAgent(agentId: string): Promise<unknown> {
    const res = await this.req(`/convai/agents/${agentId}`);
    return res.json();
  }

  async listConversations(agentId?: string): Promise<unknown> {
    const params = new URLSearchParams();
    if (agentId) params.set("agent_id", agentId);
    const qs = params.toString();
    const res = await this.req(`/convai/conversations${qs ? `?${qs}` : ""}`);
    return res.json();
  }

  async getConversation(conversationId: string): Promise<unknown> {
    const res = await this.req(`/convai/conversations/${conversationId}`);
    return res.json();
  }
}
