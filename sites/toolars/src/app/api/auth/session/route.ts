import { TOOLARS_SESSION_COOKIE_NAME } from "@/lib/auth/toolars-auth-session";
import { getToolarsSupabaseSessionPayload, signOutToolarsSupabaseSession } from "@/lib/supabase/toolars-supabase-auth-server";
import { isToolarsSupabaseConfigured } from "@/lib/supabase/toolars-supabase-config";

export const runtime = "nodejs";

export function POST(_request?: Request) {
  return Response.json(
    {
      error: "Use Supabase Auth from the client instead of creating Toolars preview sessions.",
      supabase: {
        isConfigured: isToolarsSupabaseConfigured()
      }
    },
    { status: 410 }
  );
}

export async function GET(request: Request) {
  return Response.json(await getToolarsSupabaseSessionPayload(request));
}

export async function DELETE(_request?: Request) {
  const payload = await signOutToolarsSupabaseSession();

  return Response.json(payload, {
    headers: {
      "Set-Cookie": clearLegacySessionCookie()
    }
  });
}

function clearLegacySessionCookie() {
  return `${TOOLARS_SESSION_COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`;
}
