import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * OAuth / magic-link redirect handler. Supabase redirects here with a `code`
 * query param; we exchange it for a session, then forward to `next` (defaults
 * to the repurpose workspace in English). Lives under `app/auth/` (no locale
 * segment) because Supabase redirect URLs are locale-agnostic.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/en/app/repurpose';

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
