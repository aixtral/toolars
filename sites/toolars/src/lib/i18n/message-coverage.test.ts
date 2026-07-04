import { describe, expect, it } from "vitest";
import ar from "../../../messages/ar.json";
import en from "../../../messages/en.json";
import es from "../../../messages/es.json";
import fr from "../../../messages/fr.json";
import hi from "../../../messages/hi.json";
import ja from "../../../messages/ja.json";
import pt from "../../../messages/pt.json";
import ru from "../../../messages/ru.json";
import zhHans from "../../../messages/zh-hans.json";
import zhHant from "../../../messages/zh-hant.json";
import { allDetailSlugs } from "../../data/tool-details";
import { tools } from "../../data/registry";
import { DRAFT_LOCALES, ROUTED_LOCALES } from "./index";
import { getToolTagMessageKey } from "./tool-tags";

type MessageValue = string | number | boolean | null | MessageValue[] | { [key: string]: MessageValue };

const launchMessages = {
  es,
  "zh-hans": zhHans,
  "zh-hant": zhHant
} as const;

const draftMessages = {
  ar,
  fr,
  hi,
  ja,
  pt,
  ru
} as const;

const allLocaleMessages = {
  en,
  ...launchMessages,
  ...draftMessages
} as const;

describe("localized message coverage", () => {
  it("keeps every launch locale structurally aligned with English", () => {
    const englishKeys = Object.keys(flattenMessages(en));

    for (const [locale, messages] of Object.entries(launchMessages)) {
      expect(Object.keys(flattenMessages(messages)).sort(), locale).toEqual(englishKeys.sort());
    }
  });

  it("keeps draft bundles key-complete without making them routed locales", () => {
    const englishKeys = Object.keys(flattenMessages(en)).sort();
    const routedLocales = ROUTED_LOCALES.map((locale) => locale.code);
    const draftLocales = DRAFT_LOCALES.map((locale) => locale.code);

    expect(Object.keys(draftMessages)).toEqual(["ar", "fr", "hi", "ja", "pt", "ru"]);

    for (const [locale, messages] of Object.entries(draftMessages)) {
      expect(Object.keys(flattenMessages(messages)).sort(), locale).toEqual(englishKeys);
      expect(draftLocales, locale).toContain(locale);
      expect(routedLocales, locale).not.toContain(locale);
    }
  });

  it("does not ship copied English tool descriptions in launch locales", () => {
    const englishMessages = flattenMessages(en);

    for (const [locale, messages] of Object.entries(launchMessages)) {
      const localizedMessages = flattenMessages(messages);
      const copiedDescriptions = Object.entries(englishMessages)
        .filter(([key, value]) => key.startsWith("tools.") && key.endsWith(".description") && typeof value === "string")
        .filter(([key, value]) => localizedMessages[key] === value)
        .map(([key]) => key);

      expect(copiedDescriptions, `${locale} copied descriptions`).toEqual([]);
    }
  });

  it("covers every tool detail page slug with localized tool labels", () => {
    const missingMessages: string[] = [];

    for (const [locale, messages] of Object.entries(allLocaleMessages)) {
      const flattenedMessages = flattenMessages(messages);

      for (const slug of allDetailSlugs) {
        for (const field of ["name", "description"] as const) {
          const key = `tools.${slug}.${field}`;
          const message = flattenedMessages[key];

          if (!message || !message.trim()) {
            missingMessages.push(`${locale}:${key}`);
          }
        }
      }
    }

    expect(missingMessages).toEqual([]);
  });

  it("covers every registry tag with localized common tag labels", () => {
    const registryTagKeys = [...new Set(tools.flatMap((tool) => tool.tags).map(getToolTagMessageKey))].sort();
    const missingMessages: string[] = [];

    for (const [locale, messages] of Object.entries(allLocaleMessages)) {
      const flattenedMessages = flattenMessages(messages);

      for (const tagKey of registryTagKeys) {
        const key = `commonToolTags.${tagKey}`;
        const message = flattenedMessages[key];

        if (!message || !message.trim()) {
          missingMessages.push(`${locale}:${key}`);
        }
      }
    }

    expect(missingMessages).toEqual([]);
  });

  it("keeps ICU argument names aligned with English", () => {
    const englishMessages = flattenMessages(en);
    const mismatches: Array<{ locale: string; key: string; expected: string[]; actual: string[] }> = [];

    for (const [locale, messages] of Object.entries(allLocaleMessages)) {
      if (locale === "en") continue;

      const localizedMessages = flattenMessages(messages);

      for (const [key, englishValue] of Object.entries(englishMessages)) {
        const expected = extractIcuArgumentNames(englishValue);
        const actual = extractIcuArgumentNames(localizedMessages[key] ?? "");

        if (expected.join("|") !== actual.join("|")) {
          mismatches.push({ locale, key, expected, actual });
        }
      }
    }

    expect(mismatches).toEqual([]);
  });
});

function flattenMessages(messages: MessageValue, prefix = "", output: Record<string, string> = {}) {
  if (!messages || typeof messages !== "object" || Array.isArray(messages)) return output;

  for (const [key, value] of Object.entries(messages)) {
    const nextKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      flattenMessages(value, nextKey, output);
      continue;
    }

    output[nextKey] = String(value);
  }

  return output;
}


function extractIcuArgumentNames(message: string) {
  const argumentNames = new Set<string>();
  const argumentPattern = /\{([^{}#,]+?)(?:,|\})/gu;
  let match: RegExpExecArray | null;

  while ((match = argumentPattern.exec(message))) {
    const argumentName = match[1]?.trim();

    if (argumentName && /^[\p{L}_$][\p{L}\p{N}_$-]*$/u.test(argumentName)) {
      argumentNames.add(argumentName);
    }
  }

  return [...argumentNames].sort();
}
