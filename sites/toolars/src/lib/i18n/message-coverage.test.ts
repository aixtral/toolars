import { describe, expect, it } from "vitest";
import en from "../../../messages/en.json";
import es from "../../../messages/es.json";
import zhHans from "../../../messages/zh-hans.json";
import zhHant from "../../../messages/zh-hant.json";

type MessageValue = string | number | boolean | null | MessageValue[] | { [key: string]: MessageValue };

const launchMessages = {
  es,
  "zh-hans": zhHans,
  "zh-hant": zhHant
} as const;

describe("localized message coverage", () => {
  it("keeps every launch locale structurally aligned with English", () => {
    const englishKeys = Object.keys(flattenMessages(en));

    for (const [locale, messages] of Object.entries(launchMessages)) {
      expect(Object.keys(flattenMessages(messages)).sort(), locale).toEqual(englishKeys.sort());
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
