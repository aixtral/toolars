export interface SupabasePublicEnv {
  url: string;
  publishableKey: string;
}

export interface SupabaseServiceEnv {
  url: string;
  serviceRoleKey: string;
}

export type SupabasePublicEnvState =
  | ({ configured: true } & SupabasePublicEnv)
  | {
      configured: false;
      missing: string[];
    };

type EnvRecord = Partial<Record<string, string | undefined>>;

const publicEnvKeys = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
] as const;

function cleanValue(value: string | undefined) {
  const cleaned = value?.trim();
  return cleaned ? cleaned : undefined;
}

export function readSupabasePublicEnv(
  env: EnvRecord = process.env,
): SupabasePublicEnvState {
  const url = cleanValue(env.NEXT_PUBLIC_SUPABASE_URL);
  const publishableKey = cleanValue(env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  const missing = publicEnvKeys.filter((key) => !cleanValue(env[key]));

  if (missing.length > 0) {
    return {
      configured: false,
      missing,
    };
  }

  return {
    configured: true,
    url: url as string,
    publishableKey: publishableKey as string,
  };
}

export function requireSupabasePublicEnv(
  env: EnvRecord = process.env,
): SupabasePublicEnv {
  const config = readSupabasePublicEnv(env);

  if (!config.configured) {
    throw new Error(
      `Missing Supabase public environment: ${config.missing.join(', ')}`,
    );
  }

  return {
    url: config.url,
    publishableKey: config.publishableKey,
  };
}

export function requireSupabaseServiceEnv(
  env: EnvRecord = process.env,
): SupabaseServiceEnv {
  const publicEnv = requireSupabasePublicEnv(env);
  const serviceRoleKey = cleanValue(env.SUPABASE_SERVICE_ROLE_KEY);

  if (!serviceRoleKey) {
    throw new Error('Missing Supabase service role key: SUPABASE_SERVICE_ROLE_KEY');
  }

  return {
    url: publicEnv.url,
    serviceRoleKey,
  };
}
