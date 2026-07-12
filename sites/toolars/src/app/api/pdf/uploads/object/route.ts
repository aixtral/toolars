import { isToolarsAuthenticationError, requireAuthenticatedUser } from "@/lib/auth/toolars-api-auth-context";
import { getToolarsPrivatePdfUpload } from "@/lib/supabase/toolars-private-data";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const auth = await requireAuthenticatedUser(request);
    const uploadId = new URL(request.url).searchParams.get("uploadId");
    if (!uploadId) return Response.json({ error: "Missing PDF upload id" }, { status: 400 });
    const upload = await getToolarsPrivatePdfUpload({ id: uploadId, userId: auth.accountId! });
    if (!upload) return Response.json({ error: "PDF upload not found" }, { status: 404 });
    return Response.redirect(upload.signedObjectUrl, 302);
  } catch (error) {
    if (isToolarsAuthenticationError(error)) return Response.json({ error: "Authentication required" }, { status: 401 });
    return Response.json({ error: "Unable to access PDF upload" }, { status: 500 });
  }
}
