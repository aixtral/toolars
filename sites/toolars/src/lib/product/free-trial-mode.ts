export function isFreeTrialMode(env: Partial<Record<string, string | undefined>> = readRuntimeEnv()) {
  const flag = env.NEXT_PUBLIC_TOOLARS_FREE_TRIAL_MODE ?? env.TOOLARS_FREE_TRIAL_MODE ?? "enabled";
  return !["0", "false", "disabled", "off"].includes(flag.trim().toLowerCase());
}

function readRuntimeEnv() {
  if (typeof process === "undefined") return {};
  return process.env;
}
