import {
  clearGoogleOAuthStateCookie,
  createGoogleAccountId,
  GOOGLE_OPENID_USERINFO_ENDPOINT,
  GOOGLE_OAUTH_TOKEN_ENDPOINT,
  resolveGoogleOAuthStateFromRequest
} from "@/lib/auth/toolars-google-oauth";
import { issueToolarsSession } from "@/lib/auth/toolars-session-issuer";

export const runtime = "nodejs";

interface GoogleTokenPayload {
  access_token?: string;
  error?: string;
}

interface GoogleUserInfoPayload {
  email?: string;
  email_verified?: boolean;
  sub?: string;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");
  const error = requestUrl.searchParams.get("error");

  if (error) return Response.json({ error: "Google OAuth was cancelled" }, { status: 400 });
  if (!code || !state) return Response.json({ error: "Google OAuth callback is missing code or state" }, { status: 400 });

  const oauthState = resolveGoogleOAuthStateFromRequest(request, state);
  if (!oauthState) return Response.json({ error: "Invalid Google OAuth state" }, { status: 400 });

  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) return Response.json({ error: "Google OAuth is not configured" }, { status: 503 });

  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI ?? new URL("/api/auth/google/callback", requestUrl.origin).toString();
  const accessToken = await exchangeGoogleCodeForAccessToken({
    clientId,
    clientSecret,
    code,
    redirectUri
  });
  if (!accessToken) return Response.json({ error: "Google OAuth token exchange failed" }, { status: 502 });

  const googleUser = await fetchGoogleUserInfo(accessToken);
  if (!googleUser.email || !googleUser.sub || googleUser.email_verified === false) {
    return Response.json({ error: "Google account email is not verified" }, { status: 401 });
  }

  const issued = issueToolarsSession({
    accountEmail: googleUser.email,
    accountId: createGoogleAccountId(googleUser.sub),
    boundAt: oauthState.issuedAt,
    workspaceId: oauthState.workspaceId
  });
  const headers = new Headers({
    Location: "/my-tools"
  });
  headers.append("Set-Cookie", issued.cookie);
  headers.append("Set-Cookie", clearGoogleOAuthStateCookie());

  return new Response(null, {
    headers,
    status: 302
  });
}

async function exchangeGoogleCodeForAccessToken({
  clientId,
  clientSecret,
  code,
  redirectUri
}: {
  clientId: string;
  clientSecret: string;
  code: string;
  redirectUri: string;
}) {
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri
  });
  // Google OAuth token endpoint for web server authorization code exchange:
  // https://developers.google.com/identity/protocols/oauth2/web-server
  const response = await fetch(GOOGLE_OAUTH_TOKEN_ENDPOINT, {
    body,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  });
  if (!response.ok) return null;

  const payload = (await response.json()) as GoogleTokenPayload;
  return payload.access_token ?? null;
}

async function fetchGoogleUserInfo(accessToken: string): Promise<GoogleUserInfoPayload> {
  // Google OpenID Connect UserInfo endpoint:
  // https://developers.google.com/identity/openid-connect/reference
  const response = await fetch(GOOGLE_OPENID_USERINFO_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  if (!response.ok) return {};

  return (await response.json()) as GoogleUserInfoPayload;
}
