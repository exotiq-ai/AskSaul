import { type NextRequest } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { logProposalEvent } from "@/lib/events";

const VALID = new Set([
  "submitted",
  "reviewed",
  "quoted",
  "accepted",
  "rejected",
  "lost",
  "won",
]);

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthed())) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return Response.json({ error: "no_supabase" }, { status: 503 });
  }

  const { id } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as {
    status?: string;
    note?: string;
  };

  if (!body.status || !VALID.has(body.status)) {
    return Response.json({ error: "invalid_status" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { data: existing } = await supabase
    .from("proposals")
    .select("status")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("proposals")
    .update({ status: body.status })
    .eq("id", id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  await logProposalEvent(
    id,
    "status_changed",
    {
      from: existing?.status ?? null,
      to: body.status,
      note: body.note ?? null,
    },
    "gregory",
  );

  return Response.json({ success: true });
}
