export type InjectionSeverity = "low" | "medium" | "high" | "critical";
export type InjectionRiskLevel = "low" | "medium" | "high" | "critical";

export interface InjectionPattern {
  type: string;
  label: string;
  description: string;
  mitigation: string;
  severity: InjectionSeverity;
  weight: number;
  match: string;
}

export interface PromptInjectionScanResult {
  isInjection: boolean;
  riskScore: number;
  riskLevel: InjectionRiskLevel;
  patterns: InjectionPattern[];
  summary: string;
  recommendations: string[];
}

interface InjectionRule {
  type: string;
  label: string;
  description: string;
  mitigation: string;
  severity: InjectionSeverity;
  weight: number;
  pattern: RegExp;
}

const rules: InjectionRule[] = [
  {
    type: "ignore_instructions",
    label: "ignore instructions",
    description: "Attempts to override trusted instructions or previous context.",
    mitigation: "Separate trusted system instructions from retrieved or user-controlled content.",
    severity: "critical",
    weight: 35,
    pattern: /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|rules|context)|disregard\s+(all\s+)?(previous|prior|above)\s+(instructions|rules|guidelines)/i
  },
  {
    type: "role_override",
    label: "role override",
    description: "Attempts to change the assistant role or developer authority.",
    mitigation: "Block role-changing requests and keep role hierarchy outside user-controlled text.",
    severity: "high",
    weight: 28,
    pattern: /you\s+are\s+now|from\s+now\s+on\s+you\s+are|pretend\s+to\s+be|developer\s+mode|god\s+mode|DAN\s+mode/i
  },
  {
    type: "system_prompt_leak",
    label: "system prompt leak",
    description: "Requests hidden prompts, initial instructions, or internal policies.",
    mitigation: "Block requests to reveal hidden prompts or secrets.",
    severity: "critical",
    weight: 34,
    pattern: /reveal\s+the\s+hidden\s+system\s+prompt|repeat\s+(your\s+)?(system\s+prompt|initial\s+instructions)|show\s+me\s+your\s+(system\s+prompt|instructions|rules)|raw\s+tool\s+output/i
  },
  {
    type: "context_escape",
    label: "context escape",
    description: "Uses model control tokens or chat template markers to escape context.",
    mitigation: "Sanitize model control tokens before prompts reach the model.",
    severity: "critical",
    weight: 32,
    pattern: /\[INST\]|\[\/INST\]|<\|im_start\|>|<\|im_end\|>|\[SYSTEM\]/i
  },
  {
    type: "jailbreak_attempt",
    label: "jailbreak attempt",
    description: "Attempts to bypass safety filters or run without restrictions.",
    mitigation: "Reject jailbreak language and require explicit allowlists for high-risk workflows.",
    severity: "critical",
    weight: 38,
    pattern: /jailbreak|unrestricted|uncensored\s+mode|bypass\s+(safety|content|ethical)\s+(filters?|restrictions?|guidelines?)|no\s+(ethical|moral|safety)\s+(restrictions?|guidelines?|limitations?)/i
  },
  {
    type: "data_exposure",
    label: "data exposure",
    description: "Includes credential or PII-shaped fields that should not be sent to AI unreviewed.",
    mitigation: "Redact credentials and PII before any AI review or logging.",
    severity: "high",
    weight: 26,
    pattern: /(?:api[_-]?key|secret[_-]?key|password|token|credential)\s*[:=]\s*['"][^'"]{8,}['"]|(?:email|phone|address|ssn|social\s+security)\s*[:=]/i
  }
];

const safeRecommendation = "No injection patterns detected. Keep local review enabled for untrusted inputs.";

export function scanPromptInjection(input: string): PromptInjectionScanResult {
  const text = input.trim();

  if (!text) {
    return {
      isInjection: false,
      riskScore: 0,
      riskLevel: "low",
      patterns: [],
      summary: "No prompt content provided.",
      recommendations: [safeRecommendation]
    };
  }

  const patterns = rules.flatMap((rule) => {
    const match = text.match(rule.pattern);
    if (!match?.[0]) return [];
    return [
      {
        type: rule.type,
        label: rule.label,
        description: rule.description,
        mitigation: rule.mitigation,
        severity: rule.severity,
        weight: rule.weight,
        match: match[0]
      }
    ];
  });

  const totalWeight = patterns.reduce((sum, pattern) => sum + pattern.weight, 0);
  const criticalBonus = patterns.filter((pattern) => pattern.severity === "critical").length * 10;
  const riskScore = Math.min(100, totalWeight + criticalBonus);
  const riskLevel = getRiskLevel(riskScore, patterns);
  const recommendations = patterns.length > 0 ? Array.from(new Set(patterns.map((pattern) => pattern.mitigation))) : [safeRecommendation];

  return {
    isInjection: riskScore >= 40,
    riskScore,
    riskLevel,
    patterns,
    summary: getSummary(patterns, riskLevel),
    recommendations
  };
}

function getRiskLevel(score: number, patterns: InjectionPattern[]): InjectionRiskLevel {
  if (patterns.some((pattern) => pattern.severity === "critical") && score >= 80) return "critical";
  if (score >= 70) return "high";
  if (score >= 35) return "medium";
  return "low";
}

function getSummary(patterns: InjectionPattern[], riskLevel: InjectionRiskLevel): string {
  if (patterns.length === 0) return "Low risk: local scan did not find override, leak, or escape patterns.";
  const labels = Array.from(new Set(patterns.map((pattern) => pattern.label)));
  return `${capitalize(riskLevel)} risk: detected ${labels.join(", ")}.`;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
