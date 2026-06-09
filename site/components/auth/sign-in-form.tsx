'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LockKeyhole, Mail } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { safeAuthNextPath } from '@/lib/auth/redirect';
import { createToolarsSupabaseBrowserClient } from '@/lib/supabase/client';

type SupabaseAuthError = {
  message?: string;
};

type SignInResult = {
  error: SupabaseAuthError | null;
};

export interface SignInAuthClient {
  auth: {
    signInWithPassword(input: {
      email: string;
      password: string;
    }): Promise<SignInResult>;
  };
}

export interface SignInFormProps {
  nextPath?: string;
  authClient?: SignInAuthClient;
}

export function SignInForm({ nextPath, authClient }: SignInFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');

    if (!email || !password) {
      setError('Enter your email and password.');
      setIsSubmitting(false);
      return;
    }

    const client = authClient ?? createToolarsSupabaseBrowserClient();
    const result = await client.auth.signInWithPassword({ email, password });

    if (result.error) {
      setError(result.error.message ?? 'Unable to sign in.');
      setIsSubmitting(false);
      return;
    }

    router.push(safeAuthNextPath(nextPath));
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="mb-2 block text-sm font-semibold text-neutral-700" htmlFor="email">
          Email
        </label>
        <div className="relative">
          <Mail aria-hidden="true" className="absolute left-3 top-3 text-neutral-500" size={18} />
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="pl-10"
            placeholder="you@example.com"
            required
          />
        </div>
      </div>
      <div>
        <label
          className="mb-2 block text-sm font-semibold text-neutral-700"
          htmlFor="password"
        >
          Password
        </label>
        <div className="relative">
          <LockKeyhole
            aria-hidden="true"
            className="absolute left-3 top-3 text-neutral-500"
            size={18}
          />
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className="pl-10"
            placeholder="Password"
            required
          />
        </div>
      </div>
      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-danger" role="alert">
          {error}
        </p>
      ) : null}
      <Button className="w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
}
