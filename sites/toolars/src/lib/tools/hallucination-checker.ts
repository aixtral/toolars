export type HallucinationRiskLevel = "low" | "medium" | "high" | "critical";
export type HallucinationClaimType =
  | "absolute"
  | "numerical"
  | "date"
  | "quote"
  | "reference"
  | "statistic"
  | "comparison"
  | "future";

export interface HallucinationClaim {
  type: HallucinationClaimType;
  text: string;
  severity: "low" | "medium" | "high" | "critical";
  supported: boolean;
}

export interface HallucinationCheckInput {
  answer: string;
  sources?: string;
}

export interface HallucinationCheckResult {
  score: number;
  riskLevel: HallucinationRiskLevel;
  claims: HallucinationClaim[];
  unsupportedClaims: number;
  summary: string;
  privacyNote: string;
}

interface HallucinationRule {
  type: HallucinationClaimType;
  pattern: RegExp;
  severity: HallucinationClaim["severity"];
  weight: number;
}

const rules: HallucinationRule[] = [
  { type: "absolute", pattern: /\b(always|never|every|all|none|definitely|certainly|undoubtedly)\b/gi, severity: "medium", weight: 12 },
  { type: "numerical", pattern: /\b\d+(?:\.\d+)?\s*(?:percent\b|%|billion\b|million\b|trillion\b)/gi, severity: "high", weight: 22 },
  { type: "date", pattern: /\b(?:in|on|since|before|after)\s+(?:\d{4}|(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:,?\s+\d{4})?)\b/gi, severity: "medium", weight: 14 },
  { type: "quote", pattern: /"[^"]{20,}"/g, severity: "high", weight: 24 },
  { type: "reference", pattern: /\b(?:according to|as stated by|research shows|studies indicate|data suggests)\b/gi, severity: "medium", weight: 14 },
  { type: "statistic", pattern: /\b(?:\d+%\s+of|majority of|most people|many experts|researchers found)\b/gi, severity: "high", weight: 22 },
  { type: "comparison", pattern: /\b(?:best|worst|largest|smallest|fastest|slowest|first|last)\s+(?:in the world|ever|of all time|in history)\b/gi, severity: "high", weight: 20 },
  { type: "future", pattern: /\b(?:will definitely|certainly will|undoubtedly will|is going to)\b/gi, severity: "high", weight: 20 }
];

const privacyNote = "Local hallucination heuristic only; answer and source text stay in the browser.";

export function checkHallucinations(input: HallucinationCheckInput): HallucinationCheckResult {
  const answer = input.answer.trim();
  const sources = input.sources?.trim() ?? "";

  if (!answer) {
    return {
      score: 0,
      riskLevel: "low",
      claims: [],
      unsupportedClaims: 0,
      summary: "Low risk: no answer text provided.",
      privacyNote
    };
  }

  const claims = rules.flatMap((rule) =>
    findMatches(answer, rule.pattern).map((match) => ({
      type: rule.type,
      text: match,
      severity: rule.severity,
      supported: isSupportedBySources(match, sources)
    }))
  );

  const cautious = /\b(not provided|not sure|i don't know|approximately|roughly|may|might|could)\b/i.test(answer);
  const unsupportedClaims = claims.filter((claim) => !claim.supported).length;
  const score = Math.max(
    0,
    Math.min(
      100,
      claims.reduce((sum, claim) => sum + getWeight(claim), 0) - (cautious ? 12 : 0)
    )
  );
  const riskLevel = getRiskLevel(score);

  return {
    score,
    riskLevel,
    claims,
    unsupportedClaims,
    summary:
      unsupportedClaims > 0
        ? `${capitalize(riskLevel)} risk: ${unsupportedClaims.toLocaleString("en-US")} unsupported claim signals need review.`
        : "Low risk: local scan found no unsupported claim signals.",
    privacyNote
  };
}

function findMatches(text: string, pattern: RegExp): string[] {
  const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
  return Array.from(text.matchAll(new RegExp(pattern.source, flags)), (match) => match[0]).filter(Boolean);
}

function isSupportedBySources(match: string, sources: string): boolean {
  if (!sources) return false;
  const normalizedSource = normalize(sources);
  const normalizedMatch = normalize(match.replace(/^"|"$/g, ""));
  if (normalizedMatch.length < 6) return false;
  if (normalizedSource.includes(normalizedMatch)) return true;

  const tokens = normalizedMatch.split(" ").filter((token) => token.length > 3);
  if (tokens.length === 0) return false;
  const covered = tokens.filter((token) => normalizedSource.includes(token)).length;
  return covered / tokens.length >= 0.8;
}

function getWeight(claim: HallucinationClaim): number {
  const rule = rules.find((item) => item.type === claim.type);
  const base = rule?.weight ?? 10;
  return claim.supported ? Math.round(base / 4) : base;
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function getRiskLevel(score: number): HallucinationRiskLevel {
  if (score >= 80) return "critical";
  if (score >= 60) return "high";
  if (score >= 40) return "medium";
  return "low";
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
