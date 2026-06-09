const defaultAuthNextPath = '/app/repurpose';

export function safeAuthNextPath(value: string | undefined) {
  if (!value) return defaultAuthNextPath;
  if (!value.startsWith('/') || value.startsWith('//')) {
    return defaultAuthNextPath;
  }
  return value;
}
