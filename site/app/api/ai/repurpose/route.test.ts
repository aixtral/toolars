import { describe, expect, it } from 'vitest';
import { POST } from './route';

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
  it('requires an account context before running AI generation', async () => {
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

  it('returns output cards for authenticated preview users', async () => {
    const response = await POST(
      new Request('http://127.0.0.1/api/ai/repurpose', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-toolars-preview-user': 'true',
        },
        body: JSON.stringify(requestBody),
      }),
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.job.status).toBe('completed');
    expect(body.job.outputs).toHaveLength(2);
  });
});
