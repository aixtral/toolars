export type SlugSeparator = "-" | "_" | ".";

export interface SlugGeneratorOptions {
  separator?: SlugSeparator;
  lowercase?: boolean;
  transliterate?: boolean;
  maxLength?: number;
  deduplicate?: boolean;
}

export interface NormalizedSlugGeneratorOptions {
  separator: SlugSeparator;
  lowercase: boolean;
  transliterate: boolean;
  maxLength: number;
  deduplicate: boolean;
}

export interface SlugGenerationRow {
  source: string;
  baseSlug: string;
  slug: string;
  duplicateIndex: number;
}

export interface SlugBatchResult {
  rows: SlugGenerationRow[];
  output: string;
  slugCount: number;
  duplicateCount: number;
  emptyCount: number;
  options: NormalizedSlugGeneratorOptions;
  summary: string;
  privacyNote: string;
}

export interface SlugHistoryEntry {
  slug: string;
  source: string;
}

const transliterationMap: Record<string, string> = {
  ß: "ss",
  ø: "o",
  Ø: "O",
  æ: "ae",
  Æ: "AE",
  œ: "oe",
  Œ: "OE",
  ł: "l",
  Ł: "L",
  đ: "d",
  Đ: "D"
};

const defaultOptions: NormalizedSlugGeneratorOptions = {
  separator: "-",
  lowercase: true,
  transliterate: true,
  maxLength: 0,
  deduplicate: true
};

const privacyNote = "Local slug generation only; source titles stay in the browser.";

export function transliterateSlugText(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x00-\x7F]/g, (character) => transliterationMap[character] ?? "");
}

export function generateSlug(input: string, options: SlugGeneratorOptions = {}): string {
  const normalized = normalizeSlugOptions(options);
  let text = input.trim();

  if (normalized.transliterate) {
    text = transliterateSlugText(text);
  }

  text = text.replace(/[-_./\\]+/g, " ");
  text = text.replace(/[^\w\s]/g, " ");
  text = text.replace(/\s+/g, " ").trim();

  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";

  const slug = words.join(normalized.separator);
  return truncateSlug(normalized.lowercase ? slug.toLowerCase() : slug, normalized.maxLength, normalized.separator);
}

export function generateSlugBatch(input: string, options: SlugGeneratorOptions = {}): SlugBatchResult {
  const normalized = normalizeSlugOptions(options);
  const lines = input
    .split(/\r\n|\r|\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const usedSlugs = new Set<string>();
  const baseCounts = new Map<string, number>();
  let duplicateCount = 0;
  let emptyCount = 0;

  const rows = lines.map((source) => {
    const baseSlug = generateSlug(source, normalized);
    if (!baseSlug) {
      emptyCount += 1;
      return { source, baseSlug, slug: "", duplicateIndex: 0 };
    }

    const unique = normalized.deduplicate ? makeUniqueSlug(baseSlug, normalized, baseCounts, usedSlugs) : { slug: baseSlug, duplicateIndex: 0 };
    if (unique.duplicateIndex > 0) duplicateCount += 1;

    return {
      source,
      baseSlug,
      slug: unique.slug,
      duplicateIndex: unique.duplicateIndex
    };
  });
  const output = rows
    .map((row) => row.slug)
    .filter(Boolean)
    .join("\n");
  const slugCount = rows.filter((row) => row.slug).length;

  return {
    rows,
    output,
    slugCount,
    duplicateCount,
    emptyCount,
    options: normalized,
    summary: buildSlugSummary(slugCount, duplicateCount),
    privacyNote
  };
}

export function buildSlugHistory(existing: SlugHistoryEntry[], entries: SlugHistoryEntry[], limit = 10): SlugHistoryEntry[] {
  let next = [...existing];

  for (const entry of entries) {
    if (!entry.slug) continue;
    next = next.filter((item) => item.slug !== entry.slug);
    next.unshift(entry);
  }

  return next.slice(0, limit);
}

function normalizeSlugOptions(options: SlugGeneratorOptions): NormalizedSlugGeneratorOptions {
  const maxLength = Number.isFinite(options.maxLength) ? Math.max(0, Math.floor(options.maxLength ?? 0)) : defaultOptions.maxLength;

  return {
    separator: options.separator ?? defaultOptions.separator,
    lowercase: options.lowercase ?? defaultOptions.lowercase,
    transliterate: options.transliterate ?? defaultOptions.transliterate,
    maxLength,
    deduplicate: options.deduplicate ?? defaultOptions.deduplicate
  };
}

function makeUniqueSlug(
  baseSlug: string,
  options: NormalizedSlugGeneratorOptions,
  baseCounts: Map<string, number>,
  usedSlugs: Set<string>
): { slug: string; duplicateIndex: number } {
  const nextCount = (baseCounts.get(baseSlug) ?? 0) + 1;
  baseCounts.set(baseSlug, nextCount);

  if (nextCount === 1 && !usedSlugs.has(baseSlug)) {
    usedSlugs.add(baseSlug);
    return { slug: baseSlug, duplicateIndex: 0 };
  }

  let duplicateIndex = nextCount;
  let candidate = appendDuplicateSuffix(baseSlug, duplicateIndex, options);

  while (usedSlugs.has(candidate)) {
    duplicateIndex += 1;
    candidate = appendDuplicateSuffix(baseSlug, duplicateIndex, options);
  }

  usedSlugs.add(candidate);
  return { slug: candidate, duplicateIndex };
}

function appendDuplicateSuffix(slug: string, duplicateIndex: number, options: NormalizedSlugGeneratorOptions): string {
  const suffix = `${options.separator}${duplicateIndex}`;
  if (options.maxLength <= 0) return `${slug}${suffix}`;
  if (options.maxLength <= String(duplicateIndex).length) return String(duplicateIndex).slice(0, options.maxLength);

  const stemLength = Math.max(1, options.maxLength - suffix.length);
  const stem = trimTrailingSeparator(slug.slice(0, stemLength), options.separator);
  return `${stem}${suffix}`;
}

function truncateSlug(slug: string, maxLength: number, separator: SlugSeparator): string {
  if (maxLength <= 0 || slug.length <= maxLength) return slug;
  return trimTrailingSeparator(slug.slice(0, maxLength), separator);
}

function trimTrailingSeparator(value: string, separator: SlugSeparator): string {
  return value.replace(new RegExp(`${escapeRegExp(separator)}+$`), "");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildSlugSummary(slugCount: number, duplicateCount: number): string {
  const slugLabel = slugCount === 1 ? "slug" : "slugs";
  if (duplicateCount === 0) return `${slugCount} ${slugLabel} generated.`;
  const duplicateLabel = duplicateCount === 1 ? "duplicate" : "duplicates";
  return `${slugCount} ${slugLabel} generated; ${duplicateCount} ${duplicateLabel} resolved.`;
}
