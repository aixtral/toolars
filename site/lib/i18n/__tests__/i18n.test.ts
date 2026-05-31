import { describe, expect, it } from 'vitest';
import {
  DEFAULT_LOCALE,
  getAlternateLanguageLinks,
  getLocaleConfig,
  isSupportedLocale,
  localizePath,
  SUPPORTED_LOCALES,
} from '@/lib/i18n';

describe('i18n routing helpers', () => {
  it('keeps English as the unprefixed default locale', () => {
    expect(DEFAULT_LOCALE).toBe('en');
    expect(localizePath('/tools/bmi-calculator', 'en')).toBe('/tools/bmi-calculator');
    expect(getLocaleConfig('en')).toMatchObject({
      code: 'en',
      direction: 'ltr',
      pathPrefix: '',
    });
  });

  it('declares every planned phase-two locale including RTL Arabic', () => {
    expect(SUPPORTED_LOCALES).toEqual([
      'en',
      'es',
      'fr',
      'zh',
      'ja',
      'ru',
      'ar',
      'pt',
      'hi',
      'zh-tw',
    ]);
    expect(getLocaleConfig('ar')).toMatchObject({
      code: 'ar',
      direction: 'rtl',
      pathPrefix: '/ar',
    });
  });

  it('builds hreflang-ready alternate links for localized public routes', () => {
    expect(isSupportedLocale('zh-tw')).toBe(true);
    expect(isSupportedLocale('de')).toBe(false);
    expect(localizePath('/tools/bmi-calculator', 'fr')).toBe('/fr/tools/bmi-calculator');

    expect(getAlternateLanguageLinks('/tools/bmi-calculator', ['en', 'es', 'ar'])).toEqual({
      en: '/tools/bmi-calculator',
      es: '/es/tools/bmi-calculator',
      ar: '/ar/tools/bmi-calculator',
      'x-default': '/tools/bmi-calculator',
    });
  });
});
