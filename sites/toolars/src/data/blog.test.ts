import { describe, expect, it } from "vitest";
import { getToolBySlug } from "./registry";
import { allArticleSlugs, getAllArticles, getArticleAvailableLocales, getArticleBySlug } from "./blog";

const vitalCalcEnglishBlogSlugs = [
  "protein-intake-guide",
  "heart-rate-zones-guide",
  "what-is-bmi",
  "how-to-calculate-bmr",
  "tdee-guide",
  "what-is-body-fat",
  "ideal-weight-guide",
  "water-and-metabolism",
  "waist-hip-ratio-guide",
  "fat-loss-vs-weight-loss",
  "what-is-compound-interest",
  "how-to-calculate-mortgage",
  "how-to-calculate-loan",
  "retirement-4-percent-rule",
  "retirement-saving-guide",
  "rule-of-72-explained",
  "what-is-roi",
  "what-is-good-roi",
  "apy-vs-apr",
  "debt-avalanche-vs-snowball"
];

describe("blog data", () => {
  it("ships at least three launch articles", async () => {
    const articles = await getAllArticles();
    expect(articles.length).toBeGreaterThanOrEqual(3);
  });

  it("exposes every article slug for static generation", async () => {
    const slugs = allArticleSlugs;
    const articles = await getAllArticles();
    expect(slugs.length).toBe(articles.length);
    expect(slugs).toContain("json-repair-guide");
  });

  it("returns an article by slug with required SEO fields", async () => {
    const article = await getArticleBySlug("json-repair-guide");
    expect(article).toBeDefined();
    expect(article?.title).toBeTruthy();
    expect(article?.description).toBeTruthy();
    expect(article?.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}/);
    expect(article?.sections.length).toBeGreaterThan(0);
    expect(article?.faq.length).toBeGreaterThan(0);
  });

  it("includes the first batch of VitalCalc English source blog slugs for static generation", () => {
    for (const slug of vitalCalcEnglishBlogSlugs) {
      expect(allArticleSlugs).toContain(slug);
    }
  });

  it("returns migrated VitalCalc articles by slug with usable content", async () => {
    for (const slug of ["what-is-bmi", "how-to-calculate-mortgage"]) {
      const article = await getArticleBySlug(slug);
      expect(article).toBeDefined();
      expect(article?.title).toBeTruthy();
      expect(article?.description).toBeTruthy();
      expect(article?.sections.length).toBeGreaterThan(0);
      expect(article?.faq.length).toBeGreaterThan(0);
      expect(article?.featuredToolSlugs.length).toBeGreaterThan(0);
    }
  });

  it("serves localized VitalCalc articles for every launch locale instead of English fallbacks", async () => {
    const englishArticle = await getArticleBySlug("what-is-bmi", "en");

    await expect(getArticleBySlug("what-is-bmi", "es")).resolves.toMatchObject({
      slug: "what-is-bmi",
      title: expect.not.stringMatching(englishArticle?.title ?? "")
    });
    await expect(getArticleBySlug("what-is-bmi", "zh-hans")).resolves.toMatchObject({
      slug: "what-is-bmi",
      title: expect.not.stringMatching(englishArticle?.title ?? "")
    });
    await expect(getArticleBySlug("what-is-bmi", "zh-hant")).resolves.toMatchObject({
      slug: "what-is-bmi",
      title: expect.not.stringMatching(englishArticle?.title ?? "")
    });
    expect(getArticleAvailableLocales("what-is-bmi")).toEqual(["en", "es", "zh-hans", "zh-hant"]);
  });

  it("keeps Traditional Chinese blog routes open with localized article content", async () => {
    await expect(getAllArticles("zh-hant")).resolves.toHaveLength(allArticleSlugs.length);
    await expect(getArticleBySlug("json-repair-guide", "zh-hant")).resolves.toMatchObject({
      slug: "json-repair-guide",
      title: expect.not.stringMatching("How to Repair Broken JSON in Seconds")
    });
    expect(getArticleAvailableLocales("json-repair-guide")).toEqual(["en", "es", "zh-hans", "zh-hant"]);
  });

  it("returns undefined for an unknown slug", async () => {
    const article = await getArticleBySlug("does-not-exist");
    expect(article).toBeUndefined();
  });

  it("links launch articles to real tool slugs that exist in the catalog", async () => {
    const articles = await getAllArticles();
    for (const article of articles) {
      expect(article.featuredToolSlugs.length).toBeGreaterThan(0);
      for (const slug of article.featuredToolSlugs) {
        expect(typeof slug).toBe("string");
        expect(slug.length).toBeGreaterThan(0);
        expect(getToolBySlug(slug), `${article.slug} links to unknown tool ${slug}`).toBeDefined();
      }
    }
  });

  it("orders articles by newest publishedAt first", async () => {
    const articles = await getAllArticles();
    for (let i = 1; i < articles.length; i += 1) {
      expect(articles[i - 1].publishedAt >= articles[i].publishedAt).toBe(true);
    }
  });
});
