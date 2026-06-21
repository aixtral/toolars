export type AiPromptHardeningStepBadge = "Local" | "Scan";

export interface AiPromptHardeningStep {
  title: string;
  description: string;
  badge: AiPromptHardeningStepBadge;
}

export interface AiPromptHardeningResult {
  progressPercent: number;
  statusTitle: string;
  summary: string;
  consentNote: string;
}

export function buildAiPromptHardeningSteps(): AiPromptHardeningStep[] {
  return [
    {
      title: "Paste prompt",
      description: "Runs as a local workflow step.",
      badge: "Local"
    },
    {
      title: "Scan injection risk",
      description: "Uses Prompt Injection Scanner rules and optional AI review.",
      badge: "Scan"
    },
    {
      title: "Add guardrails",
      description: "Runs as a local workflow step.",
      badge: "Local"
    },
    {
      title: "Red-team variants",
      description: "Runs as a local workflow step.",
      badge: "Local"
    }
  ];
}

export function runAiPromptHardeningWorkflow(): AiPromptHardeningResult {
  return {
    progressPercent: 82,
    statusTitle: "Hardening report ready",
    summary: "3 injection patterns found. Guardrails and red-team variants generated for review.",
    consentNote: "Optional model-assisted review should require explicit consent."
  };
}
