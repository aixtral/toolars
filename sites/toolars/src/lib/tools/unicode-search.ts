export interface UnicodeSearchInput {
  query: string;
}

export interface UnicodeCharacterRow {
  char: string;
  name: string;
  codePoint: string;
  decimal: string;
  htmlEntity: string;
  category: "Symbol" | "Letter" | "Currency" | "Punctuation" | "Emoji";
}

export interface UnicodeSearchResult {
  matches: UnicodeCharacterRow[];
  summary: string;
  privacyNote: string;
}

const unicodeRows: UnicodeCharacterRow[] = [
  row("\u00A9", "Copyright Sign", "Symbol"),
  row("\u00AE", "Registered Sign", "Symbol"),
  row("\u2122", "Trade Mark Sign", "Symbol"),
  row("\u03A9", "Greek Capital Letter Omega", "Letter"),
  row("\u03C0", "Greek Small Letter Pi", "Letter"),
  row("\u20AC", "Euro Sign", "Currency"),
  row("\u00A3", "Pound Sign", "Currency"),
  row("\u00A5", "Yen Sign", "Currency"),
  row("\u2192", "Rightwards Arrow", "Symbol"),
  row("\u2713", "Check Mark", "Symbol"),
  row("\u0026", "Ampersand", "Punctuation"),
  row("\u2022", "Bullet", "Punctuation"),
  row("\u{1F600}", "Grinning Face", "Emoji")
];

export function searchUnicodeCharacters({ query }: UnicodeSearchInput): UnicodeSearchResult {
  const normalized = query.trim().toLowerCase();
  const matches = unicodeRows.filter(
    (item) =>
      !normalized ||
      item.char === query.trim() ||
      item.name.toLowerCase().includes(normalized) ||
      item.codePoint.toLowerCase() === normalized ||
      item.category.toLowerCase().includes(normalized)
  );

  return {
    matches,
    summary: `${matches.length.toLocaleString("en-US")} ${matches.length === 1 ? "character" : "characters"} found.`,
    privacyNote: "Unicode character lookup runs locally in the browser."
  };
}

function row(char: string, name: string, category: UnicodeCharacterRow["category"]): UnicodeCharacterRow {
  const decimal = char.codePointAt(0) ?? 0;
  return {
    char,
    name,
    codePoint: `U+${decimal.toString(16).toUpperCase().padStart(4, "0")}`,
    decimal: String(decimal),
    htmlEntity: `&#${decimal};`,
    category
  };
}
