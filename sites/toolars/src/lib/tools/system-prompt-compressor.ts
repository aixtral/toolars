export type PromptCompressionSuggestionType = "redundancy" | "verbose" | "filler";
export type PromptPreservationStatus = "kept" | "review";

export interface PromptCompressionSuggestion {
  type: PromptCompressionSuggestionType;
  original: string;
  suggestion: string;
  savings: number;
}

export interface PromptPreservationCheck {
  key: "role" | "policy" | "format";
  label: string;
  status: PromptPreservationStatus;
  detail: string;
}

export interface SystemPromptCompressionInput {
  text: string;
}

export interface SystemPromptCompressionResult {
  originalText: string;
  compressedText: string;
  originalTokens: number;
  compressedTokens: number;
  tokensSaved: number;
  compressionRatio: number;
  suggestions: PromptCompressionSuggestion[];
  preservationChecks: PromptPreservationCheck[];
  summary: string;
  privacyNote: string;
}

interface CompressionRule {
  pattern: RegExp;
  replacement: string;
  type: PromptCompressionSuggestionType;
}

const compressionRules: CompressionRule[] = [
  { pattern: /\bplease\s+please\b/gi, replacement: "please", type: "redundancy" },
  { pattern: /\bvery\s+very\b/gi, replacement: "very", type: "redundancy" },
  { pattern: /\breally\s+really\b/gi, replacement: "really", type: "redundancy" },
  { pattern: /\bin\s+order\s+to\b/gi, replacement: "to", type: "verbose" },
  { pattern: /\bdue\s+to\s+the\s+fact\s+that\b/gi, replacement: "because", type: "verbose" },
  { pattern: /\bat\s+this\s+point\s+in\s+time\b/gi, replacement: "now", type: "verbose" },
  { pattern: /\bin\s+the\s+event\s+that\b/gi, replacement: "if", type: "verbose" },
  { pattern: /\bfor\s+the\s+purpose\s+of\b/gi, replacement: "to", type: "verbose" },
  { pattern: /\bit\s+is\s+important\s+to\s+note\s+that\b/gi, replacement: "", type: "filler" },
  { pattern: /\bit\s+should\s+be\s+noted\s+that\b/gi, replacement: "", type: "filler" },
  { pattern: /\bas\s+a\s+matter\s+of\s+fact\b/gi, replacement: "", type: "filler" },
  { pattern: /\bin\s+today's\s+world\b/gi, replacement: "", type: "filler" },
  { pattern: /\bit\s+goes\s+without\s+saying\b/gi, replacement: "", type: "filler" },
  { pattern: /\byou\s+are\s+an?\s+AI\s+assistant\s+that\s+/gi, replacement: "You ", type: "verbose" },
  { pattern: /\byou\s+are\s+a\s+helpful\s+assistant\s+that\s+/gi, replacement: "You ", type: "verbose" },
  { pattern: /\bas\s+an\s+AI\s+language\s+model,?\s*/gi, replacement: "", type: "filler" },
  { pattern: /\bbasically,?\s*/gi, replacement: "", type: "filler" },
  { pattern: /\bactually,?\s*/gi, replacement: "", type: "filler" },
  { pattern: /\bsimply\s+/gi, replacement: "", type: "filler" },
  { pattern: /\bjust\s+/gi, replacement: "", type: "filler" },
  { pattern: /\bmake\s+sure\s+to\b/gi, replacement: "", type: "verbose" },
  { pattern: /\bensure\s+that\s+you\b/gi, replacement: "", type: "verbose" },
  { pattern: /\bplease\s+remember\s+to\b/gi, replacement: "", type: "verbose" },
  { pattern: /\bdo\s+not\s+forget\s+to\b/gi, replacement: "", type: "verbose" }
];

export function analyzeSystemPromptCompression(input: SystemPromptCompressionInput): SystemPromptCompressionResult {
  const originalText = input.text.trim();

  if (!originalText) {
    return {
      originalText: "",
      compressedText: "",
      originalTokens: 0,
      compressedTokens: 0,
      tokensSaved: 0,
      compressionRatio: 0,
      suggestions: [],
      preservationChecks: buildPreservationChecks("", ""),
      summary: "0 estimated tokens after compression.",
      privacyNote: "Local compression only; prompt text stays in the browser."
    };
  }

  const compressedText = compressSystemPrompt(originalText);
  const originalTokens = estimatePromptTokens(originalText);
  const compressedTokens = estimatePromptTokens(compressedText);
  const tokensSaved = Math.max(0, originalTokens - compressedTokens);
  const compressionRatio = originalTokens > 0 ? Math.round((tokensSaved / originalTokens) * 100) : 0;

  return {
    originalText,
    compressedText,
    originalTokens,
    compressedTokens,
    tokensSaved,
    compressionRatio,
    suggestions: analyzeSuggestions(originalText),
    preservationChecks: buildPreservationChecks(originalText, compressedText),
    summary: `${originalTokens.toLocaleString("en-US")} estimated tokens compressed to ${compressedTokens.toLocaleString("en-US")} estimated tokens.`,
    privacyNote: "Local compression only; prompt text stays in the browser."
  };
}

export function estimatePromptTokens(text: string): number {
  const trimmed = text.trim();
  return trimmed.length > 0 ? Math.ceil(trimmed.length / 4) : 0;
}

function analyzeSuggestions(text: string): PromptCompressionSuggestion[] {
  const suggestions: PromptCompressionSuggestion[] = [];
  const seen = new Set<string>();

  for (const rule of compressionRules) {
    const matches = text.match(rule.pattern);
    if (!matches) continue;

    for (const match of matches) {
      const original = match.trim();
      const key = `${rule.type}:${original.toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const replacement = rule.replacement.trim();
      suggestions.push({
        type: rule.type,
        original,
        suggestion: replacement || "(remove)",
        savings: Math.max(0, estimatePromptTokens(original) - estimatePromptTokens(replacement))
      });
    }
  }

  return suggestions.sort((a, b) => b.savings - a.savings);
}

function compressSystemPrompt(text: string): string {
  return compressionRules
    .reduce((result, rule) => result.replace(rule.pattern, rule.replacement), text)
    .replace(/\s+/g, " ")
    .replace(/\s+([.,;:!?])/g, "$1")
    .trim();
}

function buildPreservationChecks(originalText: string, compressedText: string): PromptPreservationCheck[] {
  return [
    buildCheck({
      key: "role",
      label: "Role definition",
      originalText,
      compressedText,
      pattern: /\b(you are|act as|role|assistant|agent)\b/i,
      keptDetail: "Role wording is still visible after compression.",
      reviewDetail: "Review whether the compressed prompt still defines the assistant role."
    }),
    buildCheck({
      key: "policy",
      label: "Policy constraints",
      originalText,
      compressedText,
      pattern: /\b(policy|must|never|refuse|constraint|require|do not|unsafe)\b/i,
      keptDetail: "Policy or refusal constraints remain visible after compression.",
      reviewDetail: "Review safety, refusal, and policy constraints before reuse."
    }),
    buildCheck({
      key: "format",
      label: "Output format",
      originalText,
      compressedText,
      pattern: /\b(format|json|markdown|bullet|schema|output|field)\b/i,
      keptDetail: "Output-format instructions remain visible after compression.",
      reviewDetail: "Review output-format requirements before reuse."
    })
  ];
}

function buildCheck({
  key,
  label,
  originalText,
  compressedText,
  pattern,
  keptDetail,
  reviewDetail
}: {
  key: PromptPreservationCheck["key"];
  label: string;
  originalText: string;
  compressedText: string;
  pattern: RegExp;
  keptDetail: string;
  reviewDetail: string;
}): PromptPreservationCheck {
  const needsCheck = pattern.test(originalText);
  const kept = !needsCheck || pattern.test(compressedText);

  return {
    key,
    label,
    status: kept ? "kept" : "review",
    detail: kept ? keptDetail : reviewDetail
  };
}
