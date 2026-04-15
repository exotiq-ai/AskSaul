import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using the service_role key.
 * NEVER import this into a "use client" component.
 *
 * Missing env vars are not fatal at import time — we only throw when a caller
 * actually tries to use the client. This lets builds and local dev succeed
 * before Supabase is provisioned.
 */

let cachedClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (cachedClient) return cachedClient;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "[supabase] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set. " +
        "Proposal builder persistence will fail until env is configured.",
    );
  }

  cachedClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cachedClient;
}

/**
 * Best-effort flag for callers that want to decide whether to skip Supabase
 * entirely vs. throw. Useful during rollout when the table may not exist yet.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
