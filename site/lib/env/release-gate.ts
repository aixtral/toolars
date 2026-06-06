const previewAuthProductionError =
  'TOOLARS_ENABLE_PREVIEW_AUTH must not be true when NODE_ENV=production.';

type ToolarsEnv = {
  NODE_ENV?: string;
  TOOLARS_ENABLE_PREVIEW_AUTH?: string;
};

function normalizedEnvValue(value: string | undefined) {
  return value?.trim().toLowerCase();
}

function isTruthyEnvValue(value: string | undefined) {
  const normalized = normalizedEnvValue(value);
  return normalized === 'true' || normalized === '1' || normalized === 'yes';
}

function isFalseEnvValue(value: string | undefined) {
  const normalized = normalizedEnvValue(value);
  return normalized === 'false' || normalized === '0' || normalized === 'no';
}

export function isProductionEnvironment(env: ToolarsEnv = process.env) {
  return env.NODE_ENV === 'production';
}

export function isPreviewAuthAllowed(env: ToolarsEnv = process.env) {
  if (isProductionEnvironment(env)) return false;
  return !isFalseEnvValue(env.TOOLARS_ENABLE_PREVIEW_AUTH);
}

export function validateToolarsProductionEnv(env: ToolarsEnv = process.env) {
  const errors: string[] = [];

  if (
    isProductionEnvironment(env) &&
    isTruthyEnvValue(env.TOOLARS_ENABLE_PREVIEW_AUTH)
  ) {
    errors.push(previewAuthProductionError);
  }

  return errors;
}

export function assertToolarsProductionEnv(env: ToolarsEnv = process.env) {
  const errors = validateToolarsProductionEnv(env);
  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }
}
