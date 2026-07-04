export type JailbreakRiskLevel = "low" | "medium" | "high" | "critical";
export type JailbreakSeverity = "medium" | "high" | "critical";

export interface JailbreakFinding {
  categoryKey: string;
  label: string;
  severity: JailbreakSeverity;
  match: string;
  mitigation: string;
  weight: number;
}

export interface JailbreakDetectionResult {
  riskScore: number;
  riskLevel: JailbreakRiskLevel;
  findings: JailbreakFinding[];
  recommendations: string[];
  summary: string;
  privacyNote: string;
}

interface JailbreakRule {
  categoryKey: string;
  label: string;
  severity: JailbreakSeverity;
  pattern: RegExp;
  weight: number;
  mitigation: string;
}

const rules: JailbreakRule[] = [
  {
    categoryKey: "instructionOverride",
    label: "Instruction override",
    severity: "critical",
    pattern: /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|rules)|disregard\s+(all\s+)?previous|forget\s+all\s+rules/i,
    weight: 34,
    mitigation: "Separate trusted instructions from untrusted content and reject override attempts."
  },
  {
    categoryKey: "jailbreakPersona",
    label: "Jailbreak persona",
    severity: "critical",
    pattern: /\bDAN\b|do\s+anything\s+now|developer\s+mode|god\s+mode|unrestricted\s+ai/i,
    weight: 34,
    mitigation: "Reject role-changing or unrestricted-mode framing before model execution."
  },
  {
    categoryKey: "safetyBypass",
    label: "Safety bypass",
    severity: "critical",
    pattern: /no\s+restrictions|bypass\s+(safety|content|ethical)\s+(filters?|rules|guidelines)|without\s+(ethical|safety)\s+limitations/i,
    weight: 30,
    mitigation: "Require explicit allowlists for safety exceptions and block bypass language."
  },
  {
    categoryKey: "roleplayEscape",
    label: "Unsafe roleplay",
    severity: "high",
    pattern: /pretend\s+you\s+have\s+no\s+safety|act\s+as\s+if\s+you\s+are\s+unrestricted|hypothetical\s+scenario.*bypass/i,
    weight: 24,
    mitigation: "Keep role-play bounded by policy and review hypothetical bypass framing."
  },
  {
    categoryKey: "promptLeak",
    label: "Prompt leak request",
    severity: "high",
    pattern: /reveal\s+(your\s+)?(system\s+prompt|hidden\s+instructions)|repeat\s+your\s+initial\s+instructions|show\s+me\s+your\s+rules/i,
    weight: 28,
    mitigation: "Block hidden-prompt disclosure requests and keep policy text outside user-visible output."
  }
];

const privacyNote = "Local jailbreak heuristic only; prompt text stays in the browser.";

export function detectJailbreakRisk(prompt: string): JailbreakDetectionResult {
  const text = prompt.trim();

  if (!text) {
    return {
      riskScore: 0,
      riskLevel: "low",
      findings: [],
      recommendations: ["Add prompt text before running jailbreak review."],
      summary: "Low risk: no prompt text provided.",
      privacyNote
    };
  }

  const findings = rules.flatMap((rule) => {
    const match = text.match(rule.pattern)?.[0];
    return match ? [{ ...rule, match }] : [];
  });
  const riskScore = Math.min(100, findings.reduce((sum, finding) => sum + finding.weight, 0));
  const riskLevel = getRiskLevel(riskScore, findings);
  const recommendations =
    findings.length > 0
      ? Array.from(new Set(findings.map((finding) => finding.mitigation)))
      : ["No jailbreak patterns detected. Keep local review enabled for untrusted prompts."];

  return {
    riskScore,
    riskLevel,
    findings,
    recommendations,
    summary: findings.length
      ? `${capitalize(riskLevel)} risk: detected ${findings.length.toLocaleString("en-US")} jailbreak signals.`
      : "Low risk: local scan did not find jailbreak patterns.",
    privacyNote
  };
}

function getRiskLevel(score: number, findings: JailbreakFinding[]): JailbreakRiskLevel {
  if (score >= 80 || findings.some((finding) => finding.severity === "critical") && score >= 60) return "critical";
  if (score >= 60) return "high";
  if (score >= 30) return "medium";
  return "low";
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
