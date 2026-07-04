export interface EmbeddingPlaygroundInput {
  query: string;
  chunks: string[];
}

export interface EmbeddingComparisonRow {
  index: number;
  text: string;
  score: number;
  sharedTokens: string[];
  tokenCount: number;
}

export interface EmbeddingPlaygroundResult {
  queryTokens: string[];
  rows: EmbeddingComparisonRow[];
  summary: string;
  privacyNote: string;
}

const stopWords = new Set(["a", "an", "and", "are", "for", "is", "of", "the", "to", "with", "within"]);

export function compareEmbeddingChunks(input: EmbeddingPlaygroundInput): EmbeddingPlaygroundResult {
  const queryTokens = tokenizeForSimilarity(input.query);
  const chunks = input.chunks.map((chunk) => chunk.trim()).filter(Boolean);

  if (queryTokens.length === 0 || chunks.length === 0) {
    return {
      queryTokens,
      rows: [],
      summary: "Add a query and candidate chunks to compare local similarity.",
      privacyNote: "Local lexical similarity only; no embedding text leaves the browser."
    };
  }

  const rows = chunks
    .map((chunk, index) => {
      const chunkTokens = tokenizeForSimilarity(chunk);
      const sharedTokens = queryTokens.filter((token) => chunkTokens.includes(token));
      const score = Math.round((sharedTokens.length / queryTokens.length) * 100);

      return {
        index: index + 1,
        text: chunk,
        score,
        sharedTokens,
        tokenCount: chunkTokens.length
      };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index);

  return {
    queryTokens,
    rows,
    summary: `Top match is chunk ${rows[0].index} with ${rows[0].score}% local similarity.`,
    privacyNote: "Local lexical similarity only; no embedding text leaves the browser."
  };
}

function tokenizeForSimilarity(value: string): string[] {
  const tokens = value
    .toLowerCase()
    .match(/[a-z0-9]+/g)?.map((token) => token.replace(/s$/i, "")) ?? [];

  return [...new Set(tokens.filter((token) => token.length > 1 && !stopWords.has(token)))];
}
