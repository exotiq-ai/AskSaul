-- 0004_voice_agent.sql
-- Voice agent lead inbox + call log.

CREATE TABLE IF NOT EXISTS voice_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id TEXT NOT NULL,
  client_slug TEXT NOT NULL DEFAULT 'wolfs-tailor',
  kind TEXT NOT NULL CHECK (kind IN ('booking_request','private_dining','escalation','message')),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  party_size INT,
  requested_date DATE,
  requested_time TIME,
  occasion TEXT,
  allergies TEXT,
  allergy_flag BOOLEAN NOT NULL DEFAULT FALSE,
  reason TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','in_progress','resolved','archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS voice_leads_conv_idx ON voice_leads(conversation_id);
CREATE INDEX IF NOT EXISTS voice_leads_status_idx ON voice_leads(status, created_at DESC);

CREATE TABLE IF NOT EXISTS call_logs (
  conversation_id TEXT PRIMARY KEY,
  client_slug TEXT NOT NULL DEFAULT 'wolfs-tailor',
  caller_number TEXT,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  duration_sec INT,
  transcript_json JSONB,
  tool_calls_json JSONB,
  audio_url TEXT,
  llm_cost_usd NUMERIC(10,4),
  tts_cost_usd NUMERIC(10,4),
  outcome TEXT CHECK (outcome IN ('info_only','lead_captured','escalated','abandoned')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS call_logs_client_idx ON call_logs(client_slug, started_at DESC);
