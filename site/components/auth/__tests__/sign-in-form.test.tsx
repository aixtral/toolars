import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SignInForm, safeAuthNextPath } from '@/components/auth/sign-in-form';

const push = vi.fn();
const refresh = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push,
    refresh,
  }),
}));

function createAuthClient(errorMessage?: string) {
  return {
    auth: {
      signInWithPassword: vi.fn(async () => ({
        data: {
          user: errorMessage ? null : { id: 'user_123' },
          session: errorMessage ? null : { access_token: 'token' },
        },
        error: errorMessage ? { message: errorMessage } : null,
      })),
    },
  };
}

describe('SignInForm', () => {
  beforeEach(() => {
    push.mockReset();
    refresh.mockReset();
  });

  it('allows only same-origin path redirects after auth', () => {
    expect(safeAuthNextPath('/app/repurpose')).toBe('/app/repurpose');
    expect(safeAuthNextPath('/app/settings?tab=billing')).toBe(
      '/app/settings?tab=billing',
    );
    expect(safeAuthNextPath('https://evil.example/app')).toBe('/app/repurpose');
    expect(safeAuthNextPath('//evil.example/app')).toBe('/app/repurpose');
    expect(safeAuthNextPath(undefined)).toBe('/app/repurpose');
  });

  it('signs in with Supabase and redirects to the safe next path', async () => {
    const authClient = createAuthClient();

    render(<SignInForm authClient={authClient} nextPath="/app/repurpose" />);

    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'founder@toolars.test' },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'correct-password' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^sign in$/i }));

    await waitFor(() => {
      expect(authClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'founder@toolars.test',
        password: 'correct-password',
      });
    });
    expect(push).toHaveBeenCalledWith('/app/repurpose');
  });

  it('shows a Supabase auth error without redirecting', async () => {
    const authClient = createAuthClient('Invalid login credentials');

    render(<SignInForm authClient={authClient} nextPath="/app/repurpose" />);

    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'founder@toolars.test' },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'wrong-password' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^sign in$/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /invalid login credentials/i,
    );
    expect(push).not.toHaveBeenCalled();
  });
});
