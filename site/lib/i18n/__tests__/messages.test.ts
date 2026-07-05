import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import zh from '@/messages/zh.json';
import es from '@/messages/es.json';
import pt from '@/messages/pt.json';

/**
 * Translation integrity guard.
 *
 * Every launch locale must expose the same message-key tree. A missing or
 * extra key in any locale fails the build, preventing partial translations
 * from shipping. Values are intentionally NOT compared — en/es/pt may carry
 * English placeholder text while zh carries full translations during phase 2.
 */
const launchMessages = { en, zh, es, pt } as const;

function collectKeyPaths(obj: unknown, prefix = ''): string[] {
  if (obj === null || typeof obj !== 'object') return [];
  if (Array.isArray(obj)) return [];

  return Object.entries(obj as Record<string, unknown>).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      return [path, ...collectKeyPaths(value, path)];
    }
    return [path];
  });
}

describe('translation integrity across launch locales', () => {
  const enKeys = collectKeyPaths(en).sort();
  const locales = ['zh', 'es', 'pt'] as const;

  it.each(locales)('%s message tree matches en exactly', (locale) => {
    const localeKeys = collectKeyPaths(launchMessages[locale]).sort();
    expect(localeKeys, `${locale} should have the same key set as en`).toEqual(enKeys);
  });

  it('launch locale set is en, zh, es, pt', () => {
    expect(Object.keys(launchMessages).sort()).toEqual(['en', 'es', 'pt', 'zh']);
  });
});
