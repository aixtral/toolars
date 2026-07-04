export interface LoremIpsumOptions {
  paragraphs?: number;
  wordsPerParagraph?: number;
  startWithLorem?: boolean;
}

export type LoremIpsumErrorType = "paragraph-range" | "word-range" | "generation-failed";

export interface LoremIpsumError {
  type: LoremIpsumErrorType;
  message: string;
}

export interface LoremIpsumStats {
  paragraphs: number;
  words: number;
  characters: number;
}

export interface LoremIpsumResult {
  success: boolean;
  text: string;
  stats: LoremIpsumStats;
  error?: LoremIpsumError;
  summary: string;
  privacyNote: string;
}

const loremWords = [
  "lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit",
  "sed",
  "do",
  "eiusmod",
  "tempor",
  "incididunt",
  "ut",
  "labore",
  "et",
  "dolore",
  "magna",
  "aliqua",
  "enim",
  "ad",
  "minim",
  "veniam",
  "quis",
  "nostrud",
  "exercitation",
  "ullamco",
  "laboris",
  "nisi",
  "aliquip",
  "ex",
  "ea",
  "commodo",
  "consequat",
  "duis",
  "aute",
  "irure",
  "in",
  "reprehenderit",
  "voluptate",
  "velit",
  "esse",
  "cillum",
  "fugiat",
  "nulla",
  "pariatur",
  "excepteur",
  "sint",
  "occaecat",
  "cupidatat",
  "non",
  "proident",
  "sunt",
  "culpa",
  "qui",
  "officia",
  "deserunt",
  "mollit",
  "anim",
  "id",
  "est",
  "laborum"
];

const privacyNote = "Local placeholder generation only; copy is created in the browser.";

export function generateLoremIpsum(options: LoremIpsumOptions = {}): LoremIpsumResult {
  const paragraphs = normalizeCount(options.paragraphs ?? 3);
  const wordsPerParagraph = normalizeCount(options.wordsPerParagraph ?? 50);
  const startWithLorem = options.startWithLorem ?? true;

  if (paragraphs < 1 || paragraphs > 100) {
    return buildLoremError("paragraph-range", "Paragraphs must be between 1 and 100.");
  }

  if (wordsPerParagraph < 5 || wordsPerParagraph > 500) {
    return buildLoremError("word-range", "Words per paragraph must be between 5 and 500.");
  }

  try {
    const text = Array.from({ length: paragraphs }, (_, paragraphIndex) =>
      buildParagraph(wordsPerParagraph, paragraphIndex, startWithLorem)
    ).join("\n\n");
    const words = paragraphs * wordsPerParagraph;
    const paragraphLabel = paragraphs === 1 ? "paragraph" : "paragraphs";
    const wordLabel = words === 1 ? "word" : "words";

    return {
      success: true,
      text,
      stats: {
        paragraphs,
        words,
        characters: text.length
      },
      summary: `${paragraphs.toLocaleString("en-US")} ${paragraphLabel} generated with ${words.toLocaleString("en-US")} ${wordLabel}.`,
      privacyNote
    };
  } catch (error) {
    return buildLoremError("generation-failed", error instanceof Error ? error.message : "Lorem ipsum generation failed.");
  }
}

function buildParagraph(wordsPerParagraph: number, paragraphIndex: number, startWithLorem: boolean): string {
  const words: string[] = [];
  const offset = startWithLorem ? paragraphIndex * 11 : paragraphIndex * 11 + 7;

  if (paragraphIndex === 0 && startWithLorem) {
    words.push("Lorem", "ipsum", "dolor", "sit", "amet");
  }

  while (words.length < wordsPerParagraph) {
    const sourceIndex = (offset + words.length) % loremWords.length;
    words.push(loremWords[sourceIndex]);
  }

  words[0] = capitalize(words[0] ?? "");
  return `${words.join(" ")}.`;
}

function normalizeCount(value: number): number {
  return Number.isFinite(value) ? Math.floor(value) : 0;
}

function capitalize(value: string): string {
  if (!value) return value;
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

function buildLoremError(type: LoremIpsumErrorType, message: string): LoremIpsumResult {
  return {
    success: false,
    text: "",
    stats: {
      paragraphs: 0,
      words: 0,
      characters: 0
    },
    error: { type, message },
    summary: "Lorem ipsum generation failed.",
    privacyNote
  };
}
