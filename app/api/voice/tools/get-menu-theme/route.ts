import { type NextRequest } from "next/server";
import { verifyToolSecret, unauthorizedResponse } from "@/lib/voice/auth";
import { getCurrentMenuTheme } from "@/lib/voice/menu-theme";

export async function POST(request: NextRequest | Request) {
  if (!verifyToolSecret(request as Request)) return unauthorizedResponse();
  return Response.json(getCurrentMenuTheme());
}
