import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { allArticleSlugs, getAllArticles, getArticleAvailableLocales, getArticleBySlug } from "@/data/blog";
import { getToolBySlug } from "@/data/registry";
import {
  DEFAULT_LOCALE,
  isLaunchLocale,
  LAUNCH_LOCALES,
  localizePath,
  type LocaleCode
} from "@/lib/i18n";
import { buildArticleSchema, buildBreadcrumbSchema, buildFaqPageSchema, buildGraph } from "@/lib/seo/json-ld";
import { getSiteBaseUrl } from "@/lib/seo/site-config";

export function generateStaticParams() {
  return LAUNCH_LOCALES.flatMap((locale) => allArticleSlugs.map((slug) => ({ locale: locale.code, slug })));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale?: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: routeLocale, slug } = await params;
  const locale = routeLocale && isLaunchLocale(routeLocale) ? routeLocale : DEFAULT_LOCALE;
  const article = await getArticleBySlug(slug, locale);
  if (!article) return {};

  const baseUrl = getSiteBaseUrl();
  const articlePath = `/blog/${article.slug}`;
  const localizedArticlePath = localizePath(articlePath, locale);
  const alternateLanguages = getArticleAlternateLanguages(articlePath, baseUrl, article.slug);

  return {
    metadataBase: new URL(baseUrl),
    title: article.title,
    description: article.description,
    alternates: {
      canonical: localizedArticlePath,
      languages: alternateLanguages
    },
    openGraph: {
      type: "article",
      title: `${article.title} — Toolars Blog`,
      description: article.description,
      url: localizedArticlePath,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt ?? article.publishedAt,
      authors: [article.author]
    }
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = await getTranslations("blog");
  const tTools = await getTranslations("tools");
  const locale = (await getLocale()) as LocaleCode;
  const [article, articles] = await Promise.all([getArticleBySlug(slug, locale), getAllArticles(locale)]);

  if (!article) notFound();

  const articleIndex = articles.findIndex((candidate) => candidate.slug === article.slug);
  const hasArticleIndex = articleIndex !== -1;
  const previousArticle = articleIndex > 0 ? articles[articleIndex - 1] : undefined;
  const nextArticle = hasArticleIndex ? articles[articleIndex + 1] : undefined;
  const baseUrl = getSiteBaseUrl();
  const blogHref = localizePath("/blog", locale);
  const articleHref = localizePath(`/blog/${article.slug}`, locale);
  const schema = buildGraph(
    buildArticleSchema(article, baseUrl, {
      path: articleHref,
      inLanguage: getLocaleHreflang(locale)
    }),
    buildFaqPageSchema(article.faq),
    buildBreadcrumbSchema(
      [
        { name: t("breadcrumbLabel"), path: blogHref },
        { name: article.title, path: articleHref }
      ],
      baseUrl
    )
  );

  const featuredTools = article.featuredToolSlugs.flatMap((toolSlug) => {
    const tool = getToolBySlug(toolSlug);
    if (!tool) return [];
    return [
      {
        ...tool,
        localizedName: translateWithFallback(tTools, `${tool.slug}.name`, tool.name),
        localizedDescription: translateWithFallback(tTools, `${tool.slug}.description`, tool.description)
      }
    ];
  });

  return (
    <>
      <JsonLd schema={schema} />
      <ToolarsShell active="none" sidebarVariant="none">
        <article className="blog-article" data-blog-article-layout="wide-single">
          <div className="blog-article-body">
            <a className="blog-back-link" href={blogHref}>
              {t("backToBlog")}
            </a>

            <header className="blog-article-header">
              <span className="blog-article-meta">
                <strong>{t(`category.${article.category}`)}</strong>
                <small>{formatBlogDate(article.publishedAt, locale)}</small>
                <small>{t("readTime", { minutes: article.readTimeMinutes })}</small>
              </span>
              <h1>{article.title}</h1>
              <p className="subtitle">{article.description}</p>
            </header>

            {article.sections.map((section) => (
              <section key={section.heading} className="blog-section">
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </section>
            ))}

            {featuredTools.length > 0 ? (
              <section className="blog-section">
                <h2>{t("mentionedTools")}</h2>
                <ul className="blog-tool-list">
                  {featuredTools.map((tool) => (
                    <li key={tool.slug}>
                      <a href={localizePath(tool.href, locale)}>
                        <strong>{tool.localizedName}</strong>
                        <small>{tool.localizedDescription}</small>
                        <span className="blog-tool-cta">
                          {t("openTool")} <ArrowRight size={13} aria-hidden="true" />
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {article.faq.length > 0 ? (
              <section className="blog-section">
                <h2>{t("faq")}</h2>
                <dl className="blog-faq">
                  {article.faq.map((item) => (
                    <div key={item.question}>
                      <dt>{item.question}</dt>
                      <dd>{item.answer}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}

            {previousArticle || nextArticle ? (
              <nav className="blog-article-neighbors" aria-label={t("articleNavigation")}>
                {previousArticle ? (
                  <a
                    className="blog-article-neighbor blog-article-neighbor-previous"
                    href={localizePath(`/blog/${previousArticle.slug}`, locale)}
                  >
                    <span>
                      <ArrowLeft size={14} aria-hidden="true" />
                      {t("previousArticle")}
                    </span>
                    <strong>{previousArticle.title}</strong>
                  </a>
                ) : (
                  <span className="blog-article-neighbor-empty" aria-hidden="true" />
                )}
                {nextArticle ? (
                  <a
                    className="blog-article-neighbor blog-article-neighbor-next"
                    href={localizePath(`/blog/${nextArticle.slug}`, locale)}
                  >
                    <span>
                      {t("nextArticle")}
                      <ArrowRight size={14} aria-hidden="true" />
                    </span>
                    <strong>{nextArticle.title}</strong>
                  </a>
                ) : (
                  <span className="blog-article-neighbor-empty" aria-hidden="true" />
                )}
              </nav>
            ) : null}
          </div>
        </article>
      </ToolarsShell>
    </>
  );
}

function getArticleAlternateLanguages(articlePath: string, baseUrl: string, slug: string): Record<string, string> {
  const normalizedBase = baseUrl.replace(/\/+$/g, "");
  const availableLocales = getArticleAvailableLocales(slug);
  const locales = LAUNCH_LOCALES.filter((locale) => availableLocales.includes(locale.code));
  const languages = Object.fromEntries(
    locales.map((locale) => [locale.hreflang, `${normalizedBase}${localizePath(articlePath, locale.code)}`])
  );
  const defaultLocale = locales.find((locale) => locale.default) ?? locales[0];

  if (defaultLocale) {
    languages["x-default"] = `${normalizedBase}${localizePath(articlePath, defaultLocale.code)}`;
  }

  return languages;
}

function getLocaleHreflang(locale: LocaleCode): string {
  return LAUNCH_LOCALES.find((entry) => entry.code === locale)?.hreflang ?? locale;
}

type Translate = (key: string, values?: Record<string, string | number>) => string;

function translateWithFallback(t: Translate, key: string, fallback: string): string {
  try {
    const value = t(key);
    return value === key ? fallback : value;
  } catch {
    return fallback;
  }
}

function formatBlogDate(date: string, locale: LocaleCode): string {
  const normalizedDate = date.length === 10 ? `${date}T00:00:00Z` : date;
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "UTC" }).format(new Date(normalizedDate));
}
