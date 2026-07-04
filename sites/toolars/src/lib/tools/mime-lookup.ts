export interface MimeLookupInput {
  query: string;
}

export interface MimeRow {
  extension: string;
  mime: string;
  category: "Application" | "Image" | "Text" | "Audio" | "Video" | "Font";
  description: string;
}

export interface MimeLookupResult {
  matches: MimeRow[];
  summary: string;
  privacyNote: string;
}

const mimeRows: MimeRow[] = [
  { extension: ".json", mime: "application/json", category: "Application", description: "JSON API payload or config file." },
  { extension: ".pdf", mime: "application/pdf", category: "Application", description: "Portable Document Format." },
  { extension: ".zip", mime: "application/zip", category: "Application", description: "ZIP archive." },
  { extension: ".html", mime: "text/html", category: "Text", description: "HTML document." },
  { extension: ".css", mime: "text/css", category: "Text", description: "CSS stylesheet." },
  { extension: ".csv", mime: "text/csv", category: "Text", description: "Comma-separated values." },
  { extension: ".txt", mime: "text/plain", category: "Text", description: "Plain text." },
  { extension: ".png", mime: "image/png", category: "Image", description: "PNG image." },
  { extension: ".jpg", mime: "image/jpeg", category: "Image", description: "JPEG image." },
  { extension: ".jpeg", mime: "image/jpeg", category: "Image", description: "JPEG image." },
  { extension: ".svg", mime: "image/svg+xml", category: "Image", description: "SVG vector image." },
  { extension: ".webp", mime: "image/webp", category: "Image", description: "WebP image." },
  { extension: ".mp3", mime: "audio/mpeg", category: "Audio", description: "MP3 audio." },
  { extension: ".mp4", mime: "video/mp4", category: "Video", description: "MP4 video." },
  { extension: ".woff2", mime: "font/woff2", category: "Font", description: "WOFF2 web font." }
];

export function lookupMimeTypes({ query }: MimeLookupInput): MimeLookupResult {
  const normalized = query.trim().toLowerCase().replace(/^\*/, "");
  const matches = mimeRows.filter(
    (row) =>
      !normalized ||
      row.extension.includes(normalized.startsWith(".") ? normalized : `.${normalized}`) ||
      row.mime.toLowerCase().includes(normalized) ||
      row.category.toLowerCase().includes(normalized) ||
      row.description.toLowerCase().includes(normalized)
  );

  return {
    matches,
    summary: `${matches.length.toLocaleString("en-US")} MIME ${matches.length === 1 ? "type" : "types"} found.`,
    privacyNote: "MIME lookup runs locally in the browser."
  };
}
