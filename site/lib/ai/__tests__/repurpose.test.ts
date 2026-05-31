import { describe, expect, it } from 'vitest';
import {
  AI_PLATFORMS,
  createRepurposeJob,
  validateRepurposeRequest,
} from '@/lib/ai';

describe('AI repurpose workflow logic', () => {
  it('keeps the complete v1 platform inventory available', () => {
    expect(AI_PLATFORMS.map((platform) => platform.label)).toEqual([
      'Twitter Thread',
      'LinkedIn Post',
      'Newsletter',
      'Medium Article',
      'Reddit Post',
      'Instagram Post',
      'YouTube Script',
      'Facebook Post',
      'Hacker News Post',
      'Indie Hackers Post',
      'WeChat Article',
      'Xiaohongshu Post',
      'Jike Post',
      'Zhihu Answer',
    ]);
  });

  it('validates source text and selected platforms before generation', () => {
    expect(
      validateRepurposeRequest({
        sourceType: 'text',
        sourceValue: '',
        platforms: [],
        tone: 'professional',
        brandVoiceId: 'founder',
        model: 'toolars-fast',
      }),
    ).toEqual([
      'Add a URL or at least 20 characters of source text.',
      'Select at least one output platform.',
    ]);
  });

  it('creates deterministic output cards for selected platforms', () => {
    const job = createRepurposeJob({
      sourceType: 'text',
      sourceValue:
        'We launched toolars to combine useful calculators with account-based AI repurposing workflows for operators.',
      platforms: ['linkedin-post', 'newsletter'],
      tone: 'casual',
      brandVoiceId: 'founder',
      model: 'toolars-fast',
    });

    expect(job.status).toBe('completed');
    expect(job.outputs).toHaveLength(2);
    expect(job.outputs[0]).toMatchObject({
      platform: 'linkedin-post',
      status: 'completed',
      tone: 'casual',
    });
    expect(job.outputs[0].content).toContain('LinkedIn Post');
    expect(job.outputs[1].wordCount).toBeGreaterThan(10);
  });
});
