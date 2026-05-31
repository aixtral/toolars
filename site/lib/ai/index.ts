import { AI_PLATFORMS } from '@/data/ai-platforms';
import type { AiPlatformDefinition, RepurposePlatform } from '@/data/ai-platforms';

export { AI_PLATFORM_GROUPS, AI_PLATFORMS } from '@/data/ai-platforms';
export type { AiPlatformDefinition, RepurposePlatform } from '@/data/ai-platforms';

export type RepurposeTone = 'professional' | 'casual' | 'viral';
export type RepurposeSourceType = 'url' | 'text';
export type RepurposeStatus = 'draft' | 'streaming' | 'completed' | 'canceled' | 'failed';

export interface AiOption {
  id: string;
  label: string;
  description: string;
}

export interface RepurposeRequest {
  sourceType: RepurposeSourceType;
  sourceValue: string;
  platforms: RepurposePlatform[];
  tone: RepurposeTone;
  brandVoiceId: string;
  model: string;
}

export interface RepurposeOutput {
  id: string;
  platform: RepurposePlatform;
  platformLabel: string;
  tone: RepurposeTone;
  content: string;
  wordCount: number;
  status: RepurposeStatus;
  createdAt: string;
}

export interface RepurposeJob extends RepurposeRequest {
  id: string;
  status: RepurposeStatus;
  outputs: RepurposeOutput[];
  createdAt: string;
}

export const AI_TONES: readonly AiOption[] = [
  {
    id: 'professional',
    label: 'Professional',
    description: 'Clear, concise, and operator-focused.',
  },
  {
    id: 'casual',
    label: 'Casual',
    description: 'Plainspoken and approachable.',
  },
  {
    id: 'viral',
    label: 'Viral',
    description: 'Hook-forward with sharper pacing.',
  },
] as const;

export const AI_BRAND_VOICES: readonly AiOption[] = [
  {
    id: 'founder',
    label: 'Founder operator',
    description: 'Direct, useful, and credibility-led.',
  },
  {
    id: 'educator',
    label: 'Educator',
    description: 'Structured explanations with practical takeaways.',
  },
  {
    id: 'product',
    label: 'Product team',
    description: 'Feature clarity, benefits, and workflow detail.',
  },
] as const;

export const AI_MODELS: readonly AiOption[] = [
  {
    id: 'toolars-fast',
    label: 'toolars Fast',
    description: 'Responsive draft generation for everyday reuse.',
  },
  {
    id: 'toolars-balanced',
    label: 'toolars Balanced',
    description: 'More structure and polish for launch content.',
  },
] as const;

const platformById = new Map(AI_PLATFORMS.map((platform) => [platform.id, platform]));
const toneIds = new Set(AI_TONES.map((tone) => tone.id));
const modelIds = new Set(AI_MODELS.map((model) => model.id));
const brandVoiceIds = new Set(AI_BRAND_VOICES.map((voice) => voice.id));

function wordCount(content: string) {
  return content.trim().split(/\s+/).filter(Boolean).length;
}

function sourceExcerpt(sourceValue: string) {
  return sourceValue.trim().replace(/\s+/g, ' ').split(' ').slice(0, 18).join(' ');
}

export function validateRepurposeRequest(request: RepurposeRequest) {
  const errors: string[] = [];
  const source = request.sourceValue.trim();

  if (request.sourceType === 'url') {
    try {
      new URL(source);
    } catch {
      errors.push('Add a valid source URL.');
    }
  } else if (source.length < 20) {
    errors.push('Add a URL or at least 20 characters of source text.');
  }

  if (request.platforms.length === 0) {
    errors.push('Select at least one output platform.');
  }

  if (request.platforms.some((platform) => !platformById.has(platform))) {
    errors.push('Select supported output platforms.');
  }

  if (!toneIds.has(request.tone)) {
    errors.push('Select a supported tone.');
  }

  if (!brandVoiceIds.has(request.brandVoiceId)) {
    errors.push('Select a supported brand voice.');
  }

  if (!modelIds.has(request.model)) {
    errors.push('Select a supported model.');
  }

  return errors;
}

function outputForPlatform(
  platform: AiPlatformDefinition,
  request: RepurposeRequest,
  createdAt: string,
): RepurposeOutput {
  const voice = AI_BRAND_VOICES.find((item) => item.id === request.brandVoiceId);
  const content = [
    `Drafting ${platform.label} in a ${request.tone} tone.`,
    `Source angle: ${sourceExcerpt(request.sourceValue)}.`,
    `Use a ${voice?.label ?? 'toolars'} voice, lead with the practical result, and end with a clear next action.`,
  ].join(' ');

  return {
    id: `${platform.id}-${createdAt}`,
    platform: platform.id,
    platformLabel: platform.label,
    tone: request.tone,
    content,
    wordCount: wordCount(content),
    status: 'completed',
    createdAt,
  };
}

export function createRepurposeJob(request: RepurposeRequest): RepurposeJob {
  const errors = validateRepurposeRequest(request);
  if (errors.length > 0) {
    throw new Error(errors.join(' '));
  }

  const createdAt = new Date().toISOString();
  const outputs = request.platforms.map((platformId) => {
    const platform = platformById.get(platformId);
    if (!platform) throw new Error(`Unsupported platform: ${platformId}`);
    return outputForPlatform(platform, request, createdAt);
  });

  return {
    ...request,
    id: `repurpose-${Date.now()}`,
    status: 'completed',
    outputs,
    createdAt,
  };
}
