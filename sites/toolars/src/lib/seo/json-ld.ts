import type { BlogArticle } from "@/data/blog";
import type { ToolDefinition } from "@/data/registry";
import type { ToolDetailDefinition } from "@/data/tool-details";

export interface JsonLdGraph {
  "@context": "https://schema.org";
  "@graph": object[];
}

function joinUrl(baseUrl: string, path: string): string {
  const normalizedBase = baseUrl.replace(/\/+$/g, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

function applicationCategoryFor(tool: ToolDefinition): string {
  if (tool.group === "AI Developer Lab") return "DeveloperApplication";
  if (tool.category === "PDF") return "BusinessApplication";
  return "UtilitiesApplication";
}

/**
 * schema.org WebApplication for a tool page. AI engines use this to understand
 * what a tool is and whether it is free.
 */
export function buildWebApplicationSchema(tool: ToolDefinition, baseUrl: string) {
  return {
    "@type": "WebApplication",
    name: tool.name,
    url: joinUrl(baseUrl, tool.href),
    description: tool.description,
    applicationCategory: applicationCategoryFor(tool),
    operatingSystem: "Any (web browser)",
    offers: [
      {
        "@type": "Offer",
        price: tool.pricing === "free" ? "0" : undefined,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock"
      }
    ],
    featureList: tool.processing.map((mode) =>
      mode === "local" ? "Runs locally in your browser" : mode === "cloud" ? "Cloud processing" : "AI-assisted step"
    ),
    keywords: [tool.category, ...tool.tags].join(", ")
  };
}

/**
 * schema.org HowTo from the tool's howItWorks steps. GEO engines frequently
 * surface step-by-step instructions for "how to" queries.
 */
export function buildHowToSchema(detail: ToolDetailDefinition, baseUrl: string) {
  const stepCount = detail.howItWorks.length;
  return {
    "@type": "HowTo",
    name: detail.tool.name,
    description: detail.overview ?? detail.summary,
    url: joinUrl(baseUrl, detail.workspaceHref ?? detail.tool.href),
    totalTime: `PT${Math.max(1, stepCount)}M`,
    step: detail.howItWorks.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.description
    })),
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: detail.tool.pricing === "free" ? "0" : undefined
    }
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

/**
 * schema.org BreadcrumbList. Helps both classic search rich results and AI
 * engines understand site hierarchy.
 */
export function buildBreadcrumbSchema(items: BreadcrumbItem[], baseUrl: string) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: joinUrl(baseUrl, item.path)
    }))
  };
}

/**
 * schema.org ItemList for a directory/index page (e.g. /explore/pdf).
 */
export function buildItemListSchema(
  parent: { name: string; path: string },
  tools: ToolDefinition[],
  baseUrl: string
) {
  return {
    "@type": "ItemList",
    name: parent.name,
    url: joinUrl(baseUrl, parent.path),
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: joinUrl(baseUrl, tool.href),
      name: tool.name
    }))
  };
}

/**
 * schema.org Organization for site-wide identity.
 */
export function buildOrganizationSchema(baseUrl: string) {
  return {
    "@type": "Organization",
    name: "Toolars",
    url: baseUrl,
    description: "All tools. One workspace.",
    slogan: "All tools. One workspace."
  };
}

/**
 * schema.org WebSite with a SearchAction. Enables the Google sitelinks search
 * box and helps AI engines discover the site's search capability.
 */
export function buildWebSiteSchema(baseUrl: string) {
  return {
    "@type": "WebSite",
    name: "Toolars",
    url: baseUrl,
    potentialAction: [
      {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: joinUrl(baseUrl, "/?q={search_term_string}")
        },
        "query-input": "required name=search_term_string"
      }
    ]
  };
}

/**
 * Wrap multiple schemas into a single @graph block for one <script> tag.
 */
export function buildGraph(...schemas: object[]): JsonLdGraph {
  return {
    "@context": "https://schema.org",
    "@graph": schemas
  };
}

export interface ArticleSchemaOptions {
  path?: string;
  inLanguage?: string;
}

/**
 * schema.org Article for a blog post, plus an embedded FAQPage when the article
 * has FAQ entries. GEO engines surface both article answers and FAQ answers.
 */
export function buildArticleSchema(article: BlogArticle, baseUrl: string, options: ArticleSchemaOptions = {}) {
  const url = joinUrl(baseUrl, options.path ?? `/blog/${article.slug}`);
  return {
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url,
    mainEntityOfPage: url,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: {
      "@type": "Organization",
      name: article.author
    },
    publisher: {
      "@type": "Organization",
      name: "Toolars"
    },
    articleSection: article.category,
    keywords: article.featuredToolSlugs.join(", "),
    ...(options.inLanguage ? { inLanguage: options.inLanguage } : {})
  };
}

/**
 * schema.org FAQPage from a blog article's FAQ entries. Standalone FAQPage
 * markup is eligible for FAQ rich results in classic search.
 */
export function buildFaqPageSchema(items: Array<{ question: string; answer: string }>) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}
