export type GuardSeverity = "high" | "medium" | "low";
export type GuardRiskLevel = "safe" | "low" | "medium" | "high";

export interface VulnerabilityPattern {
  regex: RegExp;
  issueKey: string;
  mitigationKey: string;
  severity: GuardSeverity;
  weight: number;
}

export interface VulnerabilityCategory {
  categoryKey: string;
  patterns: VulnerabilityPattern[];
}

export interface SystemPromptGuardVulnerability {
  categoryKey: string;
  severity: GuardSeverity;
  issueKey: string;
  mitigationKey: string;
  line?: number;
  match: string;
}

export interface SystemPromptGuardResult {
  securityScore: number;
  riskLevel: GuardRiskLevel;
  vulnerabilities: SystemPromptGuardVulnerability[];
  recommendations: string[];
  summary: string;
  privacyNote: string;
}

export const VULNERABILITY_PATTERNS: VulnerabilityCategory[] = [
  {
    categoryKey: "categoryInjection",
    patterns: [
      {
        regex: /ignore\s+(all\s+)?previous|ignore\s+(all\s+)?above|disregard\s+(all\s+)?previous/i,
        issueKey: "injectionIgnore",
        mitigationKey: "mitigationIgnore",
        severity: "high",
        weight: 40
      },
      {
        regex: /you\s+are\s+now\s+|from\s+now\s+on\s+you\s+are|pretend\s+to\s+be|act\s+as\s+if\s+you\s+are/i,
        issueKey: "injectionRoleChange",
        mitigationKey: "mitigationRoleChange",
        severity: "high",
        weight: 35
      },
      {
        regex: /\{\{.*?\}\}|\$\{.*?\}/g,
        issueKey: "injectionTemplate",
        mitigationKey: "mitigationTemplate",
        severity: "medium",
        weight: 20
      }
    ]
  },
  {
    categoryKey: "categoryLeakage",
    patterns: [
      {
        regex: /do\s+not\s+reveal|never\s+disclose|keep\s+secret|confidential|do\s+not\s+share\s+(this\s+)?prompt/i,
        issueKey: "leakageExplicit",
        mitigationKey: "mitigationLeakage",
        severity: "medium",
        weight: 25
      },
      {
        regex: /your\s+instructions?\s+are|your\s+role\s+is|you\s+must\s+always/i,
        issueKey: "leakageExposure",
        mitigationKey: "mitigationExposure",
        severity: "low",
        weight: 15
      }
    ]
  },
  {
    categoryKey: "categoryBypass",
    patterns: [
      {
        regex: /no\s+restrictions|without\s+limitations|ignore\s+safety|bypass\s+filters|override\s+restrictions/i,
        issueKey: "bypassSafety",
        mitigationKey: "mitigationBypass",
        severity: "high",
        weight: 45
      },
      {
        regex: /jailbreak|DAN\s+mode|do\s+anything\s+now|unrestricted\s+mode/i,
        issueKey: "bypassJailbreak",
        mitigationKey: "mitigationJailbreak",
        severity: "high",
        weight: 50
      }
    ]
  },
  {
    categoryKey: "categoryRoleConfusion",
    patterns: [
      {
        regex: /you\s+are\s+(?:a|an|the)\s+(?:human|user|admin|developer)/i,
        issueKey: "roleConfusion",
        mitigationKey: "mitigationRole",
        severity: "medium",
        weight: 20
      },
      {
        regex: /forget\s+(?:that\s+)?you\s+are\s+an?\s+AI|you\s+are\s+not\s+an?\s+AI/i,
        issueKey: "roleDenial",
        mitigationKey: "mitigationRoleDenial",
        severity: "high",
        weight: 30
      }
    ]
  },
  {
    categoryKey: "categoryDataExposure",
    patterns: [
      {
        regex: /(?:api[_-]?key|secret[_-]?key|password|token|credential)\s*[:=]\s*['"][^'"]{8,}['"]/i,
        issueKey: "dataCredentials",
        mitigationKey: "mitigationCredentials",
        severity: "high",
        weight: 50
      },
      {
        regex: /(?:email|phone|address|ssn|social\s+security)\s*[:=]/i,
        issueKey: "dataPII",
        mitigationKey: "mitigationPII",
        severity: "medium",
        weight: 30
      }
    ]
  }
];

const safeRecommendation = "No guard issues detected. Keep local review enabled for sensitive system prompts.";
const privacyNote = "Local guard scan only; system prompt text stays in the browser.";

export function scanSystemPromptGuard(input: string): SystemPromptGuardResult {
  const text = input.trim();

  if (!text) {
    return {
      securityScore: 100,
      riskLevel: "safe",
      vulnerabilities: [],
      recommendations: [safeRecommendation],
      summary: "No system prompt content provided.",
      privacyNote
    };
  }

  const lines = text.split(/\r\n|\r|\n/);
  const vulnerabilities: SystemPromptGuardVulnerability[] = [];
  let totalWeight = 0;

  for (const category of VULNERABILITY_PATTERNS) {
    for (const pattern of category.patterns) {
      const matches = findMatches(text, pattern.regex);
      if (matches.length === 0) continue;

      vulnerabilities.push({
        categoryKey: category.categoryKey,
        severity: pattern.severity,
        issueKey: pattern.issueKey,
        mitigationKey: pattern.mitigationKey,
        line: findFirstLine(lines, pattern.regex),
        match: matches[0]
      });
      totalWeight += pattern.weight * matches.length;
    }
  }

  const securityScore = computeSecurityScore(totalWeight);
  const riskLevel = getGuardRiskLevel(securityScore, vulnerabilities);

  return {
    securityScore,
    riskLevel,
    vulnerabilities,
    recommendations:
      vulnerabilities.length > 0
        ? Array.from(new Set(vulnerabilities.map((vulnerability) => vulnerability.mitigationKey)))
        : [safeRecommendation],
    summary: getSummary(riskLevel, vulnerabilities.length),
    privacyNote
  };
}

export function computeSecurityScore(totalWeight: number): number {
  const score = Math.round(100 * Math.exp(-totalWeight / 100));
  return Math.max(0, Math.min(100, score));
}

export function getScoreColor(score: number): string {
  if (score <= 30) return "#ef4444";
  if (score <= 60) return "#f97316";
  if (score <= 80) return "#eab308";
  return "#22c55e";
}

function findMatches(text: string, regex: RegExp): string[] {
  const flags = regex.flags.includes("g") ? regex.flags : `${regex.flags}g`;
  const matcher = new RegExp(regex.source, flags);
  return Array.from(text.matchAll(matcher), (match) => match[0]).filter(Boolean);
}

function findFirstLine(lines: string[], regex: RegExp): number | undefined {
  const lineRegex = new RegExp(regex.source, regex.flags.replaceAll("g", ""));
  const index = lines.findIndex((line) => lineRegex.test(line));
  return index >= 0 ? index + 1 : undefined;
}

function getGuardRiskLevel(score: number, vulnerabilities: SystemPromptGuardVulnerability[]): GuardRiskLevel {
  if (vulnerabilities.length === 0) return "safe";
  if (score <= 40 || vulnerabilities.some((item) => item.severity === "high")) return "high";
  if (score <= 70) return "medium";
  return "low";
}

function getSummary(riskLevel: GuardRiskLevel, findingCount: number): string {
  if (findingCount === 0) return "Safe: local scan did not find guard issues.";
  return `${capitalize(riskLevel)} risk: detected ${findingCount} guard findings.`;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
