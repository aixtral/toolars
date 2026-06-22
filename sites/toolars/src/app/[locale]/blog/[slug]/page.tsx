import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { allArticleSlugs, getArticleBySlug } from "@/data/blog";
import { getToolBySlug } from "@/data/registry";
import { buildArticleSchema, buildBreadcrumbSchema, buildFaqPageSchema, buildGraph } from "@/lib/seo/json-ld";
import { getSiteBaseUrl } from "@/lib/seo/site-config";

export function generateStaticParams() {
  return allArticleSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      type: "article",
      title: `${article.title} — Toolars Blog`,
      description: article.description,
      url: `/blog/${article.slug}`,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt ?? article.publishedAt,
      authors: [article.author]
    }
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = await getTranslations("blog");
  const locale = await getLocale();
  const article = await getArticleBySlug(slug, locale);

  if (!article) notFound();

  const baseUrl = getSiteBaseUrl();
  const schema = buildGraph(
    buildArticleSchema(article, baseUrl),
    buildFaqPageSchema(article.faq),
    buildBreadcrumbSchema(
      [
        { name: "Blog", path: "/blog" },
        { name: article.title, path: `/blog/${article.slug}` }
      ],
      baseUrl
    )
  );

  const featuredTools = article.featuredToolSlugs
    .map((toolSlug) => getToolBySlug(toolSlug))
    .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool));

  return (
    <>
      <JsonLd schema={schema} />
      <ToolarsShell active="explore" sidebarVariant="none">
        <article className="page-grid blog-article">
          <div className="blog-article-body">
            <a className="blog-back-link" href="/blog">
              {t("backToBlog")}
            </a>

            <header className="blog-article-header">
              <span className="blog-article-meta">
                <strong>{article.category}</strong>
                <small>{article.publishedAt}</small>
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
                      <a href={tool.href}>
                        <strong>{tool.name}</strong>
                        <small>{tool.description}</small>
                        <span className="blog-tool-cta">
                          Open tool <ArrowRight size={13} aria-hidden="true" />
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
          </div>
        </article>
      </ToolarsShell>
    </>
  );
}
