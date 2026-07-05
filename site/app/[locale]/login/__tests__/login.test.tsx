import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

// Mock the Supabase server client so the page doesn't need a real project.
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser: vi.fn(async () => ({ data: { user: null } })),
    },
  })),
}));

describe('login page', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('renders email/password inputs and a submit button when Supabase is configured', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'anon-key');

    const { default: LoginPage } = await import('@/app/[locale]/login/page');

    const ui = await LoginPage({
      params: Promise.resolve({ locale: 'en' }),
      searchParams: Promise.resolve({}),
    });

    render(ui);

    expect(screen.getByRole('heading', { name: /sign in to toolars/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /^sign in$/i }),
    ).toBeInTheDocument();
  });

  it('renders a link to the register page', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'anon-key');

    const { default: LoginPage } = await import('@/app/[locale]/login/page');

    const ui = await LoginPage({
      params: Promise.resolve({ locale: 'en' }),
      searchParams: Promise.resolve({}),
    });

    render(ui);

    expect(screen.getByRole('link', { name: /create one/i })).toHaveAttribute(
      'href',
      '/register',
    );
  });

  it('shows the invalid-credentials error when error=invalid is present', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'anon-key');

    const { default: LoginPage } = await import('@/app/[locale]/login/page');

    const ui = await LoginPage({
      params: Promise.resolve({ locale: 'en' }),
      searchParams: Promise.resolve({ error: 'invalid' }),
    });

    render(ui);

    expect(screen.getByRole('alert')).toHaveTextContent(/invalid email or password/i);
  });
});
