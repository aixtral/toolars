import {
  createInMemoryUsageMeterRepository,
  type UsageMeterRepository,
} from './index';
import { readSupabasePublicEnv } from '@/lib/supabase/env';
import { createToolarsSupabaseServiceClient } from '@/lib/supabase/service';

type EnvRecord = Partial<Record<string, string | undefined>>;

const previewUsageMeterRepository = createInMemoryUsageMeterRepository();

function hasSupabaseServiceEnv(env: EnvRecord) {
  return Boolean(env.SUPABASE_SERVICE_ROLE_KEY?.trim());
}

export async function createUsageMeterRuntimeRepository(
  env: EnvRecord = process.env,
): Promise<UsageMeterRepository> {
  const publicEnv = readSupabasePublicEnv(env);

  if (publicEnv.configured && hasSupabaseServiceEnv(env)) {
    const { createSupabaseUsageMeterRepository } = await import('./supabase');
    return createSupabaseUsageMeterRepository(
      createToolarsSupabaseServiceClient(env),
    );
  }

  if (env.NODE_ENV === 'production') {
    throw new Error('Missing Supabase usage database environment.');
  }

  return previewUsageMeterRepository;
}

export function resetPreviewUsageMeterRepository() {
  previewUsageMeterRepository.reset();
}
