export const runtime = "nodejs";

export function GET(_request?: Request) {
  return Response.json(
    {
      code: "supabase_auth_required",
      error: "Legacy Google OAuth is retired. Use Supabase Auth instead."
    },
    { status: 410 }
  );
}
