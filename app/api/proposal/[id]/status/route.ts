import { type NextRequest } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

/**
 * Public status lookup. Returns a sanitized subset — never sensitive fields.
 * Use for "did my submission arrive?" flow via a magic link in the
 * confirmation email.
 */
export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!isSupabaseConfigured()) {
    return Response.json({ error: "no_supabase" }, { status: 503 });
  }

  const { id } = await ctx.params;
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("proposals")
    .select("id, status, business_name, services, created_at")
    .eq("id", id)
    .single();

  if (error || !data) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  return Response.json({
    id: data.id,
    status: data.status,
    businessName: data.business_name,
    services: data.services,
    submittedAt: data.created_at,
  });
}
