import { describe, expect, it } from "vitest";
import { allArticleSlugs, getAllArticles, getArticleBySlug } from "./blog";

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
