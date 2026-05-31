import {
  DEFAULT_LOCALE,
  LOCALE_CONFIGS,
  SUPPORTED_LOCALES,
  type LocaleCode,
  type LocaleConfig,
} from '@/data/locales';

export { DEFAULT_LOCALE, LOCALE_CONFIGS, SUPPORTED_LOCALES };
export type { LocaleCode, LocaleConfig };

const localeConfigByCode = new Map<LocaleCode, LocaleConfig>(
  LOCALE_CONFIGS.map((locale) => [locale.code, locale]),
);

function normalizePath(path: string) {
  if (!path || path === '/') return '/';
  return path.startsWith('/') ? path : `/${path}`;
}

export function isSupportedLocale(locale: string): locale is LocaleCode {
  return localeConfigByCode.has(locale as LocaleCode);
}

export function getLocaleConfig(locale: LocaleCode): LocaleConfig {
  const config = localeConfigByCode.get(locale);
  if (!config) {
    throw new Error(`Unsupported locale: ${locale}`);
  }
  return config;
}

export function localizePath(path: string, locale: LocaleCode = DEFAULT_LOCALE) {
  const normalized = normalizePath(path);
  const config = getLocaleConfig(locale);

  if (locale === DEFAULT_LOCALE) return normalized;
  if (normalized === '/') return config.pathPrefix;
  return `${config.pathPrefix}${normalized}`;
}

export function getAlternateLanguageLinks(
  path: string,
  locales: readonly LocaleCode[] = SUPPORTED_LOCALES,
): Partial<Record<LocaleCode, string>> & { 'x-default': string } {
  const alternates = Object.fromEntries(
    locales.map((locale) => [locale, localizePath(path, locale)]),
  ) as Partial<Record<LocaleCode, string>>;

  return {
    ...alternates,
    'x-default': localizePath(path, DEFAULT_LOCALE),
  };
}
