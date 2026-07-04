export type ToxicityRiskLevel = "safe" | "low" | "medium" | "high" | "critical";

export interface ToxicityCategory {
  key: string;
  label: string;
  flagged: boolean;
  score: number;
  matches: string[];
}

export interface ToxicityScanResult {
  safetyScore: number;
  riskLevel: ToxicityRiskLevel;
  categories: ToxicityCategory[];
  recommendations: string[];
  summary: string;
  privacyNote: string;
}

const dictionaries: Record<string, { label: string; words: string[]; weight: number }> = {
  toxicity: { label: "Toxicity", words: ["stupid", "idiot", "moron", "dumb", "hate you", "loser", "garbage", "trash"], weight: 16 },
  severe_toxicity: { label: "Severe toxicity", words: ["kill yourself", "kys", "drop dead", "end yourself"], weight: 42 },
  insult: { label: "Insult", words: ["ugly", "fat", "stupid", "dumb", "moron", "fool"], weight: 12 },
  profanity: { label: "Profanity", words: ["fuck", "shit", "damn", "bitch", "bastard"], weight: 9 },
  threat: { label: "Threat", words: ["i will kill", "going to hurt", "beat you", "hurt you", "attack you", "kill your"], weight: 45 },
  identity_attack: { label: "Identity attack", words: ["go back to your country", "racial slur", "ethnic insult"], weight: 36 }
};

const privacyNote = "Local toxicity scan only; text stays in the browser.";

export function scanToxicity(text: string): ToxicityScanResult {
  const lower = text.toLowerCase();
  let totalWeight = 0;
  const categories = Object.entries(dictionaries).map(([key, dictionary]) => {
    const matches = dictionary.words.filter((word) => lower.includes(word.toLowerCase()));
    const flagged = matches.length > 0;
    if (flagged) totalWeight += dictionary.weight * matches.length;
    return {
      key,
      label: dictionary.label,
      flagged,
      score: flagged ? Math.min(1, matches.length * 0.35) : 0,
      matches
    };
  });
  const safetyScore = computeSafetyScore(totalWeight);
  const riskLevel = getRiskLevel(safetyScore, categories);

  return {
    safetyScore,
    riskLevel,
    categories,
    recommendations:
      categories.some((category) => category.key === "threat" && category.flagged)
        ? ["Route severe threat or harassment findings to a human reviewer.", "Preserve context before moderation or escalation."]
        : ["Review context before taking automated moderation action."],
    summary: categories.some((category) => category.flagged)
      ? `${capitalize(riskLevel)} risk: flagged ${categories.filter((category) => category.flagged).length.toLocaleString("en-US")} moderation categories.`
      : "Safe: local scan found no toxicity keywords.",
    privacyNote
  };
}

export function computeSafetyScore(totalWeight: number): number {
  return Math.max(0, Math.min(100, Math.round(100 * Math.exp(-totalWeight / 80))));
}

function getRiskLevel(score: number, categories: ToxicityCategory[]): ToxicityRiskLevel {
  if (!categories.some((category) => category.flagged)) return "safe";
  if (score <= 25) return "critical";
  if (score <= 45) return "high";
  if (score <= 70) return "medium";
  return "low";
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
