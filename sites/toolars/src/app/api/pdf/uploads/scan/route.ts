import { isToolarsAuthenticationError, requireAuthenticatedUser } from "@/lib/auth/toolars-api-auth-context";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    await requireAuthenticatedUser(request);
    return Response.json({ processed: [] });
  } catch (error) {
    if (isToolarsAuthenticationError(error)) return Response.json({ error: "Authentication required" }, { status: 401 });
    throw error;
  }
}
