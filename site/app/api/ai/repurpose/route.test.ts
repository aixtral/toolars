import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ToolarsSession } from '@/lib/auth';

const supabaseUser = { user: null as null | { id: string; email: string } };

// Mock the Supabase server client so the route doesn't need a real project or
// a Next.js request scope (cookies()). `getSession()` reads from this mock.
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser: vi.fn(async () => ({ data: { user: supabaseUser.user } })),
    },
  })),
}));

const requestBody = {
  sourceType: 'text',
  sourceValue:
    'Turn the toolars calculator launch notes into platform-native content for a small business audience.',
  platforms: ['twitter-thread', 'linkedin-post'],
  tone: 'professional',
  brandVoiceId: 'founder',
  model: 'toolars-fast',
};

describe('POST /api/ai/repurpose', () => {
  beforeEach(() => {
    supabaseUser.user = null;
    // getSession() short-circuits to null when Supabase env vars are absent.
    // Set them so the mocked createClient/auth.getUser path is actually
    // exercised (the mock stands in for a real configured project).
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://127.0.0.1/supabase';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
  });

  afterEach(() => {
    vi.resetModules();
  });

  it('requires an account context before running AI generation', async () => {
    const { POST } = await import('./route');
    const response = await POST(
      new Request('http://127.0.0.1/api/ai/repurpose', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      }),
    );

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      error: 'Account required for AI repurposing.',
    });
  });

  it('returns output cards for authenticated users', async () => {
    const session: ToolarsSession = {
      userId: 'user-1',
      email: 'founder@toolars.test',
      planId: 'pro',
      isAuthenticated: true,
    };
    supabaseUser.user = { id: session.userId, email: session.email };

    const { POST } = await import('./route');
    const response = await POST(
      new Request('http://127.0.0.1/api/ai/repurpose', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(requestBody),
      }),
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.job.status).toBe('completed');
    expect(body.job.outputs).toHaveLength(2);
  });
});
