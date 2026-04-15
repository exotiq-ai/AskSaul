import { type NextRequest } from "next/server";
import { setAdminCookie } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const { password } = (await req.json().catch(() => ({}))) as {
    password?: string;
  };
  if (typeof password !== "string") {
    return Response.json({ error: "missing_password" }, { status: 400 });
  }
  const ok = await setAdminCookie(password);
  if (!ok) return Response.json({ error: "invalid" }, { status: 401 });
  return Response.json({ success: true });
}
