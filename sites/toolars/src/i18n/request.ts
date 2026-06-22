import { getRequestConfig } from "next-intl/server";
import { isValidLocale, DEFAULT_LOCALE, type LocaleCode } from "@/lib/i18n";

// Static imports so Turbopack/Webpack can resolve each locale's messages at
// build time. Dynamic template-string imports are not supported by Turbopack.
import en from "../../messages/en.json";
import es from "../../messages/es.json";
import zh from "../../messages/zh.json";

const messageBundles = { en, es, zh } as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale: LocaleCode = isValidLocale(requested ?? "") ? (requested as LocaleCode) : DEFAULT_LOCALE;

  return {
    locale,
    messages: messageBundles[locale]
  };
});
