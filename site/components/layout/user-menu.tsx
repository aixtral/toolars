'use client';

import { CircleUser } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';

/**
 * Header account affordance.
 *
 * Subscribes to Supabase auth state from the browser: when a session exists it
 * shows the signed-in email; otherwise it renders a "Sign in" link to the
 * login page. The full sign-out control lives in the app sidebar (server
 * action) so the header stays lightweight. Rendered in both the desktop nav
 * and the mobile section of the header.
 */
export function UserMenu({ showLabel = true }: { showLabel?: boolean }) {
  const t = useTranslations('auth');
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // If Supabase env isn't configured (e.g. local without .env.local),
    // skip wiring up the subscription and render the signed-out state.
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setReady(true);
      return;
    }

    const supabase = createClient();

    // Seed from the current session, then react to future changes.
    supabase.auth.getUser().then(({ data: { user } }) => {
      setEmail(user?.email ?? null);
      setReady(true);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  if (ready && email) {
    return (
      <span className="inline-flex min-h-11 items-center gap-2 px-1 py-3 text-sm font-semibold text-neutral-700">
        <CircleUser aria-hidden="true" size={20} strokeWidth={2} />
        {showLabel ? (
          <span className="hidden max-w-[12rem] truncate lg:inline" title={email}>
            {email}
          </span>
        ) : null}
      </span>
    );
  }

  return (
    <Link
      className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-transparent px-1 py-3 text-sm font-semibold text-neutral-700 hover:text-ink"
      href="/login"
      aria-label={t('signInLink')}
    >
      <CircleUser aria-hidden="true" size={20} strokeWidth={2} />
      {showLabel ? <span className="hidden lg:inline">{t('signInLink')}</span> : null}
    </Link>
  );
}
