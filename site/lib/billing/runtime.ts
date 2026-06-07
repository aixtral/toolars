import {
  createInMemoryBillingRepository,
  type BillingSubscriptionRepository,
} from './index';
import { readSupabasePublicEnv } from '@/lib/supabase/env';

type EnvRecord = Partial<Record<string, string | undefined>>;

const previewBillingRuntimeRepository = createInMemoryBillingRepository();

function hasSupabaseServiceEnv(env: EnvRecord) {
  return Boolean(env.SUPABASE_SERVICE_ROLE_KEY?.trim());
}

export async function createBillingWebhookRuntimeRepository(
  env: EnvRecord = process.env,
): Promise<BillingSubscriptionRepository> {
  const publicEnv = readSupabasePublicEnv(env);

  if (publicEnv.configured && hasSupabaseServiceEnv(env)) {
    const { createSupabaseBillingRepository } = await import('./supabase');
    const { createToolarsSupabaseServiceClient } = await import('@/lib/supabase/service');
    return createSupabaseBillingRepository(createToolarsSupabaseServiceClient(env));
  }

  if (env.NODE_ENV === 'production') {
    throw new Error('Missing Supabase billing database environment.');
  }

  return previewBillingRuntimeRepository;
}

export function resetPreviewBillingRuntimeRepository() {
  previewBillingRuntimeRepository.reset();
}
