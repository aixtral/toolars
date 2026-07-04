export interface TextStatsValueSet {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTime: string;
  speakingTime: string;
}

export interface TextStatsTopWord {
  word: string;
  count: number;
}

export interface TextStatsResult {
  success: boolean;
  stats: TextStatsValueSet;
  topWords: TextStatsTopWord[];
  summary: string;
  privacyNote: string;
  error?: string;
}

const emptyStats: TextStatsValueSet = {
  characters: 0,
  charactersNoSpaces: 0,
  words: 0,
  sentences: 0,
  paragraphs: 0,
  lines: 0,
  readingTime: "0 sec",
  speakingTime: "0 sec"
};

const privacyNote = "Local analysis only; source text stays in the browser.";

export function analyzeText(text: string): TextStatsResult {
  try {
    if (!text.trim()) {
      return {
        success: true,
        stats: { ...emptyStats },
        topWords: [],
        summary: "0 words analyzed.",
        privacyNote
      };
    }

    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const words = text.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const sentenceCount = text.split(/[.!?]+/).filter((sentence) => sentence.trim().length > 0).length;
    const paragraphCount = text.split(/\n\s*\n/).filter((paragraph) => paragraph.trim().length > 0).length || 1;
    const lineCount = text.split("\n").length;

    const stats: TextStatsValueSet = {
      characters,
      charactersNoSpaces,
      words: wordCount,
      sentences: sentenceCount,
      paragraphs: paragraphCount,
      lines: lineCount,
      readingTime: formatTime(wordCount / 200),
      speakingTime: formatTime(wordCount / 130)
    };

    return {
      success: true,
      stats,
      topWords: getTopWords(words),
      summary: `${wordCount} ${wordCount === 1 ? "word" : "words"} analyzed across ${paragraphCount} ${
        paragraphCount === 1 ? "paragraph" : "paragraphs"
      }.`,
      privacyNote
    };
  } catch (error) {
    return {
      success: false,
      stats: { ...emptyStats },
      topWords: [],
      summary: "Text analysis failed.",
      privacyNote,
      error: error instanceof Error ? error.message : "Failed to analyze text"
    };
  }
}

function getTopWords(words: string[]): TextStatsTopWord[] {
  const frequency = new Map<string, number>();

  for (const word of words) {
    const clean = word.toLocaleLowerCase("en-US").replace(/[^\p{L}\p{N}]+/gu, "");
    if (clean.length <= 2) continue;
    frequency.set(clean, (frequency.get(clean) ?? 0) + 1);
  }

  return Array.from(frequency.entries())
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0], "en-US"))
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));
}

function formatTime(minutes: number): string {
  if (minutes <= 0) return "0 sec";
  if (minutes < 1) return `${Math.round(minutes * 60)} sec`;
  if (minutes < 60) return `${Math.round(minutes)} min`;

  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
}
