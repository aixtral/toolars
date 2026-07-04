import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { getAllArticles } from "@/data/blog";
import { DEFAULT_LOCALE, getAlternateLanguageLinks, isLaunchLocale, localizePath, type LocaleCode } from "@/lib/i18n";
import { getSiteBaseUrl } from "@/lib/seo/site-config";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale?: string }>;
}): Promise<Metadata> {
  const { locale: routeLocale } = await params;
  const locale = routeLocale && isLaunchLocale(routeLocale) ? routeLocale : DEFAULT_LOCALE;
  const t = await getTranslations("blog");
  const baseUrl = getSiteBaseUrl();
  const blogPath = "/blog";
  const localizedBlogPath = localizePath(blogPath, locale);
  const alternateLanguages = Object.fromEntries(
    getAlternateLanguageLinks(blogPath, baseUrl).map((link) => [link.hreflang, link.href])
  );

  return {
    metadataBase: new URL(baseUrl),
    title: `${t("title")} — ${t("subtitle")}`,
    description: t("intro"),
    alternates: {
      canonical: localizedBlogPath,
      languages: alternateLanguages
    },
    openGraph: {
      type: "website",
      title: t("title"),
      description: t("subtitle"),
      url: localizedBlogPath
    }
  };
}

export default async function BlogIndexPage() {
  const t = await getTranslations("blog");
  const tCommon = await getTranslations("common");
  const locale = (await getLocale()) as LocaleCode;
  const articles = await getAllArticles(locale);

  return (
    <ToolarsShell active="none" sidebarVariant="none">
      <div className="blog-index" data-blog-index-layout="wide-single">
        <section className="section">
          <h1 className="title">{t("subtitle")}</h1>
          <p className="subtitle">{t("intro")}</p>

          <ul className="blog-article-list">
            {articles.map((article) => (
              <li key={article.slug} className="blog-article-card">
                <a href={localizePath(`/blog/${article.slug}`, locale)}>
                  <span className="blog-article-meta">
                    <strong>{t(`category.${article.category}`)}</strong>
                    <small>{formatBlogDate(article.publishedAt, locale)}</small>
                    <small>{t("readTime", { minutes: article.readTimeMinutes })}</small>
                  </span>
                  <h2>{article.title}</h2>
                  <p>{article.description}</p>
                  <span className="blog-article-cta">
                    {tCommon("readArticle")} <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </ToolarsShell>
  );
}

function formatBlogDate(date: string, locale: LocaleCode): string {
  const normalizedDate = date.length === 10 ? `${date}T00:00:00Z` : date;
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "UTC" }).format(new Date(normalizedDate));
}
