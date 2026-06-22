import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { getAllArticles } from "@/data/blog";

export const metadata: Metadata = {
  title: "Blog — Guides for calculators, AI tools, and developer workflows",
  description:
    "Practical guides from the Toolars team: JSON repair, combining free calculators with AI tools, prompt injection testing, and more.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    title: "Toolars Blog",
    description: "Guides for calculators, AI tools, and developer workflows.",
    url: "/blog"
  }
};

export default async function BlogIndexPage() {
  const t = await getTranslations("blog");
  const tCommon = await getTranslations("common");
  const locale = await getLocale();
  const articles = await getAllArticles(locale);

  return (
    <ToolarsShell active="explore" sidebarVariant="none">
      <div className="page-grid blog-index">
        <section className="section">
          <p className="subtitle">{t("title")}</p>
          <h1 className="title">{t("subtitle")}</h1>
          <p className="subtitle">{t("intro")}</p>

          <ul className="blog-article-list">
            {articles.map((article) => (
              <li key={article.slug} className="blog-article-card">
                <a href={`/blog/${article.slug}`}>
                  <span className="blog-article-meta">
                    <strong>{article.category}</strong>
                    <small>{article.publishedAt}</small>
                    <small>{article.readTimeMinutes} min read</small>
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
