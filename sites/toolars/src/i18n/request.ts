import { getRequestConfig } from "next-intl/server";
import { isLaunchLocale, DEFAULT_LOCALE } from "@/lib/i18n";

// Static imports so Turbopack/Webpack can resolve each locale's messages at
// build time. Dynamic template-string imports are not supported by Turbopack.
import en from "../../messages/en.json";
import es from "../../messages/es.json";
import zhHans from "../../messages/zh-hans.json";
import zhHant from "../../messages/zh-hant.json";

const messageBundles = { en, es, "zh-hans": zhHans, "zh-hant": zhHant } as const;
type MessageLocaleCode = keyof typeof messageBundles;

export function resolveRequestLocale(requested: string | null | undefined): MessageLocaleCode {
  if (requested && isLaunchLocale(requested) && requested in messageBundles) {
    return requested as MessageLocaleCode;
  }

  return DEFAULT_LOCALE as MessageLocaleCode;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = resolveRequestLocale(requested);

  return {
    locale,
    messages: messageBundles[locale]
  };
});
