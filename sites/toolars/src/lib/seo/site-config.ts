const FALLBACK_BASE_URL = "http://localhost:9320";

/**
 * Resolve the canonical site base URL. Reads NEXT_PUBLIC_SITE_URL so the same
 * value is available on both server and client bundles. Falls back to the dev
 * server origin so metadata stays valid locally.
 */
export function getSiteBaseUrl(env: Record<string, string | undefined> = readEnv()): string {
  const raw = (env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_BASE_URL).trim();
  return raw.replace(/\/+$/g, "");
}

/**
 * Join a relative path onto the site base URL, normalizing duplicate slashes.
 */
export function getSiteUrl(path: string, env: Record<string, string | undefined> = readEnv()): string {
  const base = getSiteBaseUrl(env);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

function readEnv(): Record<string, string | undefined> {
  if (typeof process === "undefined") return {};
  return process.env;
}
