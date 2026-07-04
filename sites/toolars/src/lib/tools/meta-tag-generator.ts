export interface MetaTagInput {
  title: string;
  description: string;
  url: string;
  image: string;
  siteName: string;
  twitterHandle?: string;
}

export interface MetaTagResult {
  html: string;
  tagCount: number;
  warnings: string[];
}

export function generateMetaTags(input: MetaTagInput): MetaTagResult {
  const title = input.title.trim();
  const description = input.description.trim();
  const url = input.url.trim();
  const image = input.image.trim();
  const siteName = input.siteName.trim();
  const twitterHandle = input.twitterHandle?.trim();
  const rows = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeAttribute(description)}" />`,
    `<link rel="canonical" href="${escapeAttribute(url)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escapeAttribute(title)}" />`,
    `<meta property="og:description" content="${escapeAttribute(description)}" />`,
    `<meta property="og:url" content="${escapeAttribute(url)}" />`,
    `<meta property="og:image" content="${escapeAttribute(image)}" />`,
    `<meta property="og:site_name" content="${escapeAttribute(siteName)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttribute(title)}" />`,
    `<meta name="twitter:description" content="${escapeAttribute(description)}" />`,
    `<meta name="twitter:image" content="${escapeAttribute(image)}" />`,
    ...(twitterHandle ? [`<meta name="twitter:site" content="${escapeAttribute(twitterHandle)}" />`] : [])
  ];
  const warnings = [
    ...(title.length > 60 ? ["Title is longer than common SERP display ranges."] : []),
    ...(description.length > 160 ? ["Description may truncate in search previews."] : []),
    ...(!url.startsWith("https://") ? ["Canonical URL should use HTTPS for production pages."] : [])
  ];

  return {
    html: rows.join("\n"),
    tagCount: rows.length,
    warnings
  };
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttribute(value: string): string {
  return escapeHtml(value).replace(/"/g, "&quot;");
}
