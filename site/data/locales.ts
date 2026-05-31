export type LocaleCode =
  | 'en'
  | 'es'
  | 'fr'
  | 'zh'
  | 'ja'
  | 'ru'
  | 'ar'
  | 'pt'
  | 'hi'
  | 'zh-tw';

export type LocaleDirection = 'ltr' | 'rtl';

export interface LocaleConfig {
  code: LocaleCode;
  label: string;
  nativeName: string;
  direction: LocaleDirection;
  pathPrefix: string;
  phase: 'launch' | 'phase-two';
}

export const DEFAULT_LOCALE: LocaleCode = 'en';

export const LOCALE_CONFIGS: readonly LocaleConfig[] = [
  {
    code: 'en',
    label: 'English',
    nativeName: 'English',
    direction: 'ltr',
    pathPrefix: '',
    phase: 'launch',
  },
  {
    code: 'es',
    label: 'Spanish',
    nativeName: 'Espanol',
    direction: 'ltr',
    pathPrefix: '/es',
    phase: 'phase-two',
  },
  {
    code: 'fr',
    label: 'French',
    nativeName: 'Francais',
    direction: 'ltr',
    pathPrefix: '/fr',
    phase: 'phase-two',
  },
  {
    code: 'zh',
    label: 'Chinese',
    nativeName: '中文',
    direction: 'ltr',
    pathPrefix: '/zh',
    phase: 'phase-two',
  },
  {
    code: 'ja',
    label: 'Japanese',
    nativeName: '日本語',
    direction: 'ltr',
    pathPrefix: '/ja',
    phase: 'phase-two',
  },
  {
    code: 'ru',
    label: 'Russian',
    nativeName: 'Русский',
    direction: 'ltr',
    pathPrefix: '/ru',
    phase: 'phase-two',
  },
  {
    code: 'ar',
    label: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    pathPrefix: '/ar',
    phase: 'phase-two',
  },
  {
    code: 'pt',
    label: 'Portuguese',
    nativeName: 'Portugues',
    direction: 'ltr',
    pathPrefix: '/pt',
    phase: 'phase-two',
  },
  {
    code: 'hi',
    label: 'Hindi',
    nativeName: 'हिन्दी',
    direction: 'ltr',
    pathPrefix: '/hi',
    phase: 'phase-two',
  },
  {
    code: 'zh-tw',
    label: 'Traditional Chinese',
    nativeName: '繁體中文',
    direction: 'ltr',
    pathPrefix: '/zh-tw',
    phase: 'phase-two',
  },
] as const;

export const SUPPORTED_LOCALES = LOCALE_CONFIGS.map((locale) => locale.code) as readonly LocaleCode[];
