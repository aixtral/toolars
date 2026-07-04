import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  createBlogContentQualityAudit,
  createBlogCoverageAudit,
  createI18nQualityAudit,
  findBlogEnglishCandidates,
  findCjkEnglishCandidates,
  findZhHantSimplifiedGlyphCandidates,
  formatI18nQualitySummary
} from "./audit-i18n-quality.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDir, "..");

describe("i18n quality audit", () => {
  it("detects simplified Chinese glyphs in Traditional Chinese messages", () => {
    const candidates = findZhHantSimplifiedGlyphCandidates({
      auth: {
        ok: "測試期間無需信用卡。",
        mixed: "测試期間可以随時查看数據。",
        launch: "这里介绍设计严格失败标签声明紧凑推荐手脚税修订静坐煩恼金额能够琐事说明。"
      }
    });

    expect(candidates).toEqual([
      {
        key: "auth.launch",
        glyphs: [
          "这",
          "绍",
          "设",
          "计",
          "严",
          "败",
          "标",
          "签",
          "声",
          "紧",
          "凑",
          "荐",
          "脚",
          "税",
          "订",
          "静",
          "恼",
          "额",
          "够",
          "琐",
          "说"
        ],
        value: "这里介绍设计严格失败标签声明紧凑推荐手脚税修订静坐煩恼金额能够琐事说明。"
      },
      {
        key: "auth.mixed",
        glyphs: ["测", "随", "数"],
        value: "测試期間可以随時查看数據。"
      }
    ]);
  });

  it("reports CJK English candidates after stripping placeholders, tags, and technical allowlist tokens", () => {
    const candidates = findCjkEnglishCandidates(
      {
        common: {
          okTech:
            "AI JSON API Markdown User-Agent JSONPath Unicode HOMA-IR Docker Tailwind Unix JavaScript Cron kcal Base64 IPv4 PnL Coast FIRE Cooper ASRS-v1.1 Flexbox Notion Visa Drive Toolkit Web red-team border-radius box-shadow nmol mmol 工具",
          okMoreTech:
            "Developer Grid chmod beta Flex Compose Max Team Rows tokenizer Meta padding Lorem Ipsum Epley Riegel Word feed auth Webhook Slack MacBook URL-safe mmHg eAG camelCase snake kebab-case PascalCase KiB NanoID Open Graph Twitter Vision glyph keyframes viewport 工具",
          okNames: "Karvonen、Devine、Mifflin-St Jeor、William Bengen、Alice 和 Bob 是公式或示例名。",
          okHyphenatedAcronyms: "GLP-1、PHQ-9、UTF-8 和 EAN-13 是标准缩写。",
          okPlaceholder: "找到 {count} 个工具",
          okIcu: "{count, plural, one {本地保留 # 个事件} other {本地保留 # 个事件}}",
          okEmail: "billing@example.com",
          okDomain: "toolars.app example.com",
          okScope: "tools:read",
          okMaskedToken: "tk_live_••••••••••••9f3a",
          okLink: "请参阅<privacyLink>隐私政策</privacyLink>。",
          leak: "Start your workflow with one click"
        }
      },
      "zh-hans"
    );

    expect(candidates).toEqual([
      {
        key: "common.leak",
        words: ["Start", "your", "workflow", "with", "one", "click"],
        value: "Start your workflow with one click"
      }
    ]);
  });

  it("treats missing localized blog articles as launch blockers", () => {
    const audit = createBlogCoverageAudit({
      launchLocales: ["en", "es", "zh-hans", "zh-hant"],
      englishSlugs: ["json-repair-guide", "what-is-bmi", "tdee-guide"],
      localizedSlugsByLocale: {
        es: ["json-repair-guide"],
        "zh-hans": ["json-repair-guide", "what-is-bmi"],
        "zh-hant": []
      }
    });

    expect(audit.totalArticles).toBe(3);
    expect(audit.locales.en).toMatchObject({ translated: 3, missing: 0, status: "source" });
    expect(audit.locales.es).toMatchObject({ translated: 1, missing: 2, status: "needs-work" });
    expect(audit.locales["zh-hans"].missingSlugs).toEqual(["tdee-guide"]);
    expect(audit.locales["zh-hant"].missingSlugs).toEqual(["json-repair-guide", "what-is-bmi", "tdee-guide"]);
    expect(audit.blockers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ locale: "es", missing: 2 }),
        expect.objectContaining({ locale: "zh-hant", missing: 3 })
      ])
    );
  });

  it("detects high-confidence English phrases inside localized blog bodies", () => {
    const candidates = findBlogEnglishCandidates(
      [
        {
          slug: "what-is-bmi",
          title: "¿Qué es el IMC?",
          description: "Guía localizada",
          sections: [
            {
              heading: "Calcule su IMC",
              paragraphs: ["Use our free calculator to get your result instantly."]
            }
          ],
          faq: []
        }
      ],
      "es"
    );

    expect(candidates).toEqual([
      {
        key: "what-is-bmi.sections.0.paragraphs.0",
        words: ["Use our", "to get your"],
        value: "Use our free calculator to get your result instantly."
      }
    ]);
  });

  it("detects full English sentence remnants in Spanish blog content without flagging technical tokens", () => {
    const candidates = findBlogEnglishCandidates(
      [
        {
          slug: "heart-rate-zones",
          title: "Zonas de frecuencia cardiaca",
          description: "Guía localizada",
          sections: [
            {
              heading: "Estimación",
              paragraphs: [
                "But this is the mínimo.",
                "Heart rate is your body responding to work.",
                "Simple estimate: Max HR = 220 - age.",
                "JSON API AI PDF CSV archivo.csv heart_rate_max kcal mmHg",
                "Pague el mínimo de todas las deudas y destine cada dólar adicional a la deuda con la tasa de interés más alta. Una vez que esté pagada, pase a la siguiente tasa más alta."
              ]
            }
          ],
          faq: []
        }
      ],
      "es"
    );

    expect(candidates).toEqual([
      {
        key: "heart-rate-zones.sections.0.paragraphs.0",
        words: ["But", "this", "the"],
        value: "But this is the mínimo."
      },
      {
        key: "heart-rate-zones.sections.0.paragraphs.1",
        words: ["Heart", "rate", "your", "body", "responding", "work"],
        value: "Heart rate is your body responding to work."
      },
      {
        key: "heart-rate-zones.sections.0.paragraphs.2",
        words: ["Simple estimate"],
        value: "Simple estimate: Max HR = 220 - age."
      }
    ]);
  });

  it("audits localized blog content quality separately from coverage", () => {
    const audit = createBlogContentQualityAudit({
      localizedArticlesByLocale: {
        es: [
          {
            slug: "what-is-bmi",
            title: "¿Qué es el IMC?",
            description: "Guía localizada",
            sections: [{ heading: "Calcule", paragraphs: ["Use our free calculator."] }],
            faq: []
          }
        ],
        "zh-hant": [
          {
            slug: "what-is-bmi",
            title: "什麼是 BMI",
            description: "了解 BMI。",
            sections: [{ heading: "介紹", paragraphs: ["這是一段混有简体字的繁體內容。"] }],
            faq: []
          }
        ]
      }
    });

    expect(audit.byLocale.es.englishCandidates.count).toBe(1);
    expect(audit.byLocale.es.englishCandidates.items).toEqual([
      {
        key: "what-is-bmi.sections.0.paragraphs.0",
        words: ["Use our"],
        value: "Use our free calculator."
      }
    ]);
    expect(audit.byLocale["zh-hant"].simplifiedGlyphCandidates.count).toBe(1);
    expect(audit.byLocale["zh-hant"].simplifiedGlyphCandidates.items).toEqual([
      {
        key: "what-is-bmi.sections.0.paragraphs.0",
        glyphs: ["简", "体"],
        value: "這是一段混有简体字的繁體內容。"
      }
    ]);
  });

  it("keeps full candidate lists in the repo audit JSON for triage", async () => {
    const audit = await createI18nQualityAudit({ siteRoot });

    expect(Array.isArray(audit.blog.contentQuality.byLocale.es.englishCandidates.items)).toBe(true);
    expect(audit.blog.contentQuality.byLocale.es.englishCandidates.items).toHaveLength(
      audit.blog.contentQuality.byLocale.es.englishCandidates.count
    );
    expect(Array.isArray(audit.messages.byLocale["zh-hans"].cjkEnglishCandidates.items)).toBe(true);
    expect(audit.messages.byLocale["zh-hans"].cjkEnglishCandidates.items).toHaveLength(
      audit.messages.byLocale["zh-hans"].cjkEnglishCandidates.count
    );
  });

  it("creates a repo audit with launch locale quality sections", async () => {
    const audit = await createI18nQualityAudit({ siteRoot });

    expect(audit.summary.launchLocales).toEqual(["en", "es", "zh-hans", "zh-hant"]);
    expect(audit.blog.totalArticles).toBeGreaterThan(0);
    expect(audit.blog.contentQuality.byLocale.es.englishCandidates.count).toBeGreaterThanOrEqual(0);
    expect(audit.messages.byLocale["zh-hant"].simplifiedGlyphCandidates.count).toBeGreaterThanOrEqual(0);
    expect(["pass", "needs-work"]).toContain(audit.status);
  });

  it("requires full localized blog coverage for every launch locale", async () => {
    const audit = await createI18nQualityAudit({ siteRoot });

    expect(audit.blog.locales.es).toMatchObject({ translated: audit.blog.totalArticles, missing: 0, status: "pass" });
    expect(audit.blog.locales["zh-hans"]).toMatchObject({ translated: audit.blog.totalArticles, missing: 0, status: "pass" });
    expect(audit.blog.locales["zh-hant"]).toMatchObject({ translated: audit.blog.totalArticles, missing: 0, status: "pass" });
    expect(audit.blog.blockers).toEqual([]);
  });

  it("formats a concise quality summary", () => {
    const summary = formatI18nQualitySummary({
      status: "needs-work",
      summary: {
        launchLocales: ["en", "es", "zh-hans", "zh-hant"],
        blockers: 2,
        reviewItems: 1
      },
      blog: {
        totalArticles: 3,
        locales: {
          en: { translated: 3, missing: 0 },
          es: { translated: 1, missing: 2 },
          "zh-hans": { translated: 2, missing: 1 },
          "zh-hant": { translated: 0, missing: 3 }
        },
        contentQuality: {
          byLocale: {
            es: { englishCandidates: { count: 3 }, simplifiedGlyphCandidates: { count: 0 } },
            "zh-hans": { englishCandidates: { count: 4 }, simplifiedGlyphCandidates: { count: 0 } },
            "zh-hant": { englishCandidates: { count: 5 }, simplifiedGlyphCandidates: { count: 2 } }
          }
        }
      },
      messages: {
        byLocale: {
          es: { cjkEnglishCandidates: { count: 0 }, simplifiedGlyphCandidates: { count: 0 } },
          "zh-hans": { cjkEnglishCandidates: { count: 1 }, simplifiedGlyphCandidates: { count: 0 } },
          "zh-hant": { cjkEnglishCandidates: { count: 2 }, simplifiedGlyphCandidates: { count: 8 } }
        }
      }
    });

    expect(summary).toContain("Toolars i18n quality audit: needs-work");
    expect(summary).toContain("Blog localized coverage: en=3/3, es=1/3, zh-hans=2/3, zh-hant=0/3");
    expect(summary).toContain("Blog content English candidates: es=3, zh-hans=4, zh-hant=5");
    expect(summary).toContain("Blog zh-hant simplified glyph candidates: 2");
    expect(summary).toContain("zh-hant simplified glyph candidates: 8");
  });
});
