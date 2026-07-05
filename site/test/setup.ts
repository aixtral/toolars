import '@testing-library/jest-dom/vitest';
import { beforeEach, vi } from 'vitest';

// ---- i18n test mocks ----
// next-intl's navigation and server hooks depend on Next.js request context
// that vitest's jsdom environment cannot provide. We stub the surface area
// components actually use so tests can render them with real English copy
// loaded from messages/en.json.

const enMessages = (await import('../messages/en.json')).default as Record<
  string,
  unknown
>;

function lookup(messages: Record<string, unknown>, path: string) {
  return path.split('.').reduce<unknown>(
    (acc, key) =>
      acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[key] : undefined,
    messages,
  );
}

function interpolate(template: string, params?: Record<string, unknown>) {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in params ? String(params[key]) : `{${key}}`,
  );
}

function makeTranslator(namespace?: string) {
  const translate = (key: string, params?: Record<string, unknown>) => {
    const path = namespace ? `${namespace}.${key}` : key;
    const value = lookup(enMessages, path);
    if (typeof value !== 'string') return key;
    return interpolate(value, params);
  };
  // next-intl translators are callable functions with a `.has()` method
  // that reports whether a key resolves to a message. Mirror that surface so
  // components can safely probe for optional keys before rendering.
  translate.has = (key: string) => {
    const path = namespace ? `${namespace}.${key}` : key;
    return typeof lookup(enMessages, path) === 'string';
  };
  return translate;
}

vi.mock('next-intl', () => ({
  useTranslations: (namespace?: string) => makeTranslator(namespace),
  useLocale: () => 'en',
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('next-intl/server', () => ({
  getTranslations: async (namespace?: string) => makeTranslator(namespace),
  setRequestLocale: () => undefined,
}));

vi.mock('@/i18n/navigation', async () => {
  const React = await import('react');
  return {
    Link: React.forwardRef<
      HTMLAnchorElement,
      { href: string; children: React.ReactNode; className?: string }
    >(function Link({ href, children, ...rest }, ref) {
      return React.createElement('a', { ref, href, ...rest }, children);
    }),
    redirect: (href: string) => href,
    usePathname: () => '/',
    useRouter: () => ({ push: () => undefined, replace: () => undefined }),
    getPathname: () => '/',
  };
});

class MemoryStorage implements Storage {
  private readonly items = new Map<string, string>();

  get length() {
    return this.items.size;
  }

  clear() {
    this.items.clear();
  }

  getItem(key: string) {
    return this.items.get(String(key)) ?? null;
  }

  key(index: number) {
    return Array.from(this.items.keys())[index] ?? null;
  }

  removeItem(key: string) {
    this.items.delete(String(key));
  }

  setItem(key: string, value: string) {
    this.items.set(String(key), String(value));
  }
}

function isUsableStorage(storage: Storage | undefined): storage is Storage {
  return (
    Boolean(storage) &&
    typeof storage?.clear === 'function' &&
    typeof storage?.getItem === 'function' &&
    typeof storage?.setItem === 'function'
  );
}

function installStorage(name: 'localStorage' | 'sessionStorage') {
  if (isUsableStorage(globalThis[name])) return;

  Object.defineProperty(globalThis, name, {
    configurable: true,
    value: new MemoryStorage(),
    writable: true,
  });
}

beforeEach(() => {
  installStorage('localStorage');
  installStorage('sessionStorage');
  globalThis.localStorage.clear();
  globalThis.sessionStorage.clear();
});
