import {
  createGoogleOAuthStateCookie,
  GOOGLE_OAUTH_AUTHORIZATION_ENDPOINT,
  GOOGLE_OAUTH_SCOPE
} from "@/lib/auth/toolars-google-oauth";

export const runtime = "nodejs";

export function GET(request: Request) {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  if (!clientId) {
    return Response.json({ error: "Google OAuth is not configured" }, { status: 503 });
  }

  const requestUrl = new URL(request.url);
  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI ?? new URL("/api/auth/google/callback", requestUrl.origin).toString();
  const workspaceId = requestUrl.searchParams.get("workspaceId") ?? request.headers.get("x-toolars-workspace-id") ?? "anonymous-local";
  const { cookie, state } = createGoogleOAuthStateCookie({ workspaceId });
  // Google Web Server OAuth authorization endpoint:
  // https://developers.google.com/identity/protocols/oauth2/web-server
  const redirectUrl = new URL(GOOGLE_OAUTH_AUTHORIZATION_ENDPOINT);
  redirectUrl.searchParams.set("client_id", clientId);
  redirectUrl.searchParams.set("redirect_uri", redirectUri);
  redirectUrl.searchParams.set("response_type", "code");
  redirectUrl.searchParams.set("scope", GOOGLE_OAUTH_SCOPE);
  redirectUrl.searchParams.set("state", state);
  redirectUrl.searchParams.set("access_type", "online");
  redirectUrl.searchParams.set("prompt", "select_account");

  return new Response(null, {
    headers: {
      Location: redirectUrl.toString(),
      "Set-Cookie": cookie
    },
    status: 302
  });
}
