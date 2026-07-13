import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  auditMessageCoverage,
  auditCopiedEnglishByPhase,
  createI18nAudit,
  findCopiedEnglishValues,
  scanSourceText
} from "./audit-i18n.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDir, "..");

describe("i18n audit", () => {
  it("detects missing and extra message keys", () => {
    const coverage = auditMessageCoverage({
      en: {
        nav: { explore: "Explore", tools: "Tools" },
        common: { save: "Save" }
      },
      es: {
        nav: { explore: "Explorar" },
        extra: "Extra"
      }
    });

    expect(coverage.locales.es.missingKeys).toEqual(["common.save", "nav.tools"]);
    expect(coverage.locales.es.extraKeys).toEqual(["extra"]);
  });

  it("reports copied English sentences while ignoring short product tokens", () => {
    const copied = findCopiedEnglishValues(
      {
        app: { headline: "All tools. One workspace.", brand: "Toolars", format: "PDF" }
      },
      {
        app: { headline: "All tools. One workspace.", brand: "Toolars", format: "PDF" }
      },
      "zh-hans"
    );

    expect(copied.map((item) => item.key)).toEqual(["app.headline"]);
  });

  it("skips stable copied formats without hiding ordinary English prose", () => {
    const copied = findCopiedEnglishValues(
      {
        footer: {
          privacy: "Privacy Policy",
          rights: "All rights reserved."
        },
        auth: {
          google: "Continue with Google"
        },
        tools: {
          fileSize: {
            sizeMb: "{size} MB"
          },
          bmi: {
            healthyWeightRange: "0.0-0.0 kg"
          },
          protein: {
            customFactor: "{value} g/kg",
            summary: "{weight} kg × {factor} g/kg"
          },
          bloodPressure: {
            summary: "{reading} mmHg"
          },
          testosterone: {
            emptyFreeTestosterone: "0.0 ng/dL"
          },
          vo2Max: {
            sourceDistance: "{distanceMeters} m"
          },
          timers: {
            minutesShort: "{minutes} min"
          },
          currency: {
            rateDisplay: "1 {fromCurrency} = {rate} {toCurrency}",
            currencyOptionLabel: "{code} - {name}"
          },
          base64: {
            runMode: "UTF-8 Base64"
          },
          userAgent: {
            inputPlaceholder: "Mozilla/5.0 ... Chrome/125.0.0.0 Safari/537.36"
          }
        },
        settings: {
          billing: {
            paymentMethods: [{ value: "Visa ·•••• 4242" }]
          },
          connectedApps: {
            apps: [{ name: "Google Drive" }]
          }
        }
      },
      {
        footer: {
          privacy: "Privacy Policy",
          rights: "All rights reserved."
        },
        auth: {
          google: "Continue with Google"
        },
        tools: {
          fileSize: {
            sizeMb: "{size} MB"
          },
          bmi: {
            healthyWeightRange: "0.0-0.0 kg"
          },
          protein: {
            customFactor: "{value} g/kg",
            summary: "{weight} kg × {factor} g/kg"
          },
          bloodPressure: {
            summary: "{reading} mmHg"
          },
          testosterone: {
            emptyFreeTestosterone: "0.0 ng/dL"
          },
          vo2Max: {
            sourceDistance: "{distanceMeters} m"
          },
          timers: {
            minutesShort: "{minutes} min"
          },
          currency: {
            rateDisplay: "1 {fromCurrency} = {rate} {toCurrency}",
            currencyOptionLabel: "{code} - {name}"
          },
          base64: {
            runMode: "UTF-8 Base64"
          },
          userAgent: {
            inputPlaceholder: "Mozilla/5.0 ... Chrome/125.0.0.0 Safari/537.36"
          }
        },
        settings: {
          billing: {
            paymentMethods: [{ value: "Visa ·•••• 4242" }]
          },
          connectedApps: {
            apps: [{ name: "Google Drive" }]
          }
        }
      },
      "zh-hans"
    );

    expect(copied.map((item) => item.key)).toEqual(["footer.privacy", "footer.rights", "auth.google"]);
  });

  it("reports copied English leaf strings inside arrays of objects with indexed keys", () => {
    const copied = findCopiedEnglishValues(
      {
        pricing: {
          faq: {
            items: [
              { question: "How do teams start?", answer: "Start with one workspace." },
              { question: "Can I export reports?", answer: "Export clean reports anytime." }
            ]
          }
        }
      },
      {
        pricing: {
          faq: {
            items: [
              { question: "How do teams start?", answer: "Empieza con un espacio de trabajo." },
              { question: "Puedo exportar informes?", answer: "Exporta informes claros cuando quieras." }
            ]
          }
        }
      },
      "es"
    );

    expect(copied.map((item) => item.key)).toEqual(["pricing.faq.items.0.question"]);
    expect(copied.map((item) => item.key)).not.toContain("pricing.faq.items");
  });

  it("splits copied English accounting between launch and draft locales", () => {
    const audit = {
      messages: {
        copiedEnglishByLocale: {
          ar: [{ key: "tools.a.description" }],
          es: [],
          fr: [{ key: "tools.b.description" }, { key: "tools.c.description" }],
          hi: [],
          ja: [],
          pt: [],
          ru: [],
          "zh-hans": [],
          "zh-hant": []
        }
      }
    };

    const accounting = auditCopiedEnglishByPhase(audit.messages.copiedEnglishByLocale);

    expect(accounting.launch).toMatchObject({
      locales: ["es", "zh-hans", "zh-hant"],
      total: 0
    });
    expect(accounting.draft).toMatchObject({
      locales: ["ar", "fr", "hi", "ja", "pt", "ru"],
      total: 3
    });
    expect(accounting.byLocale.fr).toMatchObject({ phase: "draft", count: 2 });
    expect(accounting.byLocale.es).toMatchObject({ phase: "launch", count: 0 });
  });

  it("scans hardcoded JSX text and absolute href literals from source text", () => {
    const scan = scanSourceText(
      `
        export function Example() {
          return <a aria-label="Open tool" href="/tools/json-repair">Open workspace</a>;
        }
      `,
      "src/app/[locale]/tools/example/page.tsx"
    );

    expect(scan.hardcodedText.map((item) => item.text)).toEqual(["Open tool", "Open workspace"]);
    expect(scan.absoluteHrefs.map((item) => item.href)).toEqual(["/tools/json-repair"]);
  });

  it("does not mistake an arrow function body for a JSX text node", () => {
    const scan = scanSourceText(
      `
        const localizedHref = (href) => localizePath(href, localeCode);
        return <a>{t("nav.explore")}</a>;
      `,
      "src/components/example.tsx"
    );

    expect(scan.hardcodedText).toEqual([]);
  });

  it("does not mistake a TypeScript generic closing token for a JSX text node", () => {
    const scan = scanSourceText(
      `
        const [toast, setToast] = useState<AccountToast | null>(null);
        return <span>{t("auth.signOut.signedOut")}</span>;
      `,
      "src/components/example.tsx"
    );

    expect(scan.hardcodedText).toEqual([]);
  });

  it("audits the real Toolars message files without requiring a clean translation state", async () => {
    const audit = await createI18nAudit({ siteRoot });

    expect(audit.summary.locales).toEqual(
      expect.arrayContaining(["en", "ar", "es", "fr", "hi", "ja", "pt", "ru", "zh-hans", "zh-hant"])
    );
    expect(audit.summary.messageKeyMismatches).toBe(0);
    expect(audit.summary.copiedEnglishStrings).toBeGreaterThanOrEqual(0);
    expect(audit.summary.copiedEnglishStringsByPhase).toEqual({
      launch: audit.messages.copiedEnglishAccounting.launch.total,
      draft: audit.messages.copiedEnglishAccounting.draft.total
    });
    expect(audit.messages.copiedEnglishAccounting.draft.locales).toEqual(["ar", "fr", "hi", "ja", "pt", "ru"]);
    expect(audit.summary.hardcodedTextCandidates).toBe(0);
    expect(audit.summary.absoluteHrefCandidates).toBe(0);
  }, 90_000);
});
