export type GuardrailAction = "block" | "warn" | "redact";

export interface GuardrailContentFilter {
  enabled: boolean;
  threshold: number;
  action: Exclude<GuardrailAction, "redact">;
}

export interface GuardrailPiiRule {
  enabled: boolean;
  action: Extract<GuardrailAction, "redact" | "warn">;
}

export interface AiGuardrailConfig {
  name: string;
  contentFilters: {
    violence: GuardrailContentFilter;
    hateSpeech: GuardrailContentFilter;
    selfHarm: GuardrailContentFilter;
    sexual: GuardrailContentFilter;
  };
  piiProtection: {
    email: GuardrailPiiRule;
    phone: GuardrailPiiRule;
    ssn: GuardrailPiiRule;
    creditCard: GuardrailPiiRule;
  };
  rateLimits: {
    requestsPerMinute: number;
    tokensPerMinute: number;
    maxTokensPerRequest: number;
  };
  jailbreakProtection: {
    enabled: boolean;
    threshold: number;
  };
  outputGuardrails: {
    blockRefusals: boolean;
    maxRetries: number;
    fallbackMessage: string;
  };
}

export interface BuildAiGuardrailConfigInput {
  name?: string;
  fallbackMessage?: string;
  requestsPerMinute?: number;
  tokensPerMinute?: number;
  maxTokensPerRequest?: number;
  hateSpeechAction?: GuardrailContentFilter["action"];
}

export interface AiGuardrailExportConfig {
  name: string;
  version: "1.0";
  content_filters: Record<string, { threshold: number; action: string }>;
  pii_protection: Record<string, { action: string }>;
  rate_limits: {
    requests_per_minute: number;
    tokens_per_minute: number;
    max_tokens_per_request: number;
  };
  jailbreak_protection: {
    enabled: boolean;
    threshold: number;
  };
  output_guardrails: {
    block_refusals: boolean;
    max_retries: number;
    fallback_message: string;
  };
}

export interface AiGuardrailConfigResult {
  config: AiGuardrailConfig;
  exportConfig: AiGuardrailExportConfig;
  enabledProtectionCount: number;
  reviewChecklist: string[];
  summary: string;
  privacyNote: string;
}

const privacyNote = "Local guardrail config builder only; policy drafts stay in the browser.";

export const defaultAiGuardrailConfig: AiGuardrailConfig = {
  name: "",
  contentFilters: {
    violence: { enabled: true, threshold: 0.7, action: "block" },
    hateSpeech: { enabled: true, threshold: 0.7, action: "block" },
    selfHarm: { enabled: true, threshold: 0.8, action: "block" },
    sexual: { enabled: true, threshold: 0.7, action: "block" }
  },
  piiProtection: {
    email: { enabled: true, action: "redact" },
    phone: { enabled: true, action: "redact" },
    ssn: { enabled: true, action: "redact" },
    creditCard: { enabled: true, action: "redact" }
  },
  rateLimits: {
    requestsPerMinute: 60,
    tokensPerMinute: 100000,
    maxTokensPerRequest: 4096
  },
  jailbreakProtection: {
    enabled: true,
    threshold: 0.8
  },
  outputGuardrails: {
    blockRefusals: false,
    maxRetries: 3,
    fallbackMessage: "I cannot assist with that request."
  }
};

export function buildAiGuardrailConfig(input: BuildAiGuardrailConfigInput = {}): AiGuardrailConfigResult {
  const config: AiGuardrailConfig = {
    ...structuredClone(defaultAiGuardrailConfig),
    name: input.name?.trim() ?? defaultAiGuardrailConfig.name,
    contentFilters: {
      ...structuredClone(defaultAiGuardrailConfig.contentFilters),
      hateSpeech: {
        ...defaultAiGuardrailConfig.contentFilters.hateSpeech,
        action: input.hateSpeechAction ?? defaultAiGuardrailConfig.contentFilters.hateSpeech.action
      }
    },
    rateLimits: {
      requestsPerMinute: clampInteger(input.requestsPerMinute ?? defaultAiGuardrailConfig.rateLimits.requestsPerMinute, 1, 10000),
      tokensPerMinute: clampInteger(input.tokensPerMinute ?? defaultAiGuardrailConfig.rateLimits.tokensPerMinute, 100, 10000000),
      maxTokensPerRequest: clampInteger(input.maxTokensPerRequest ?? defaultAiGuardrailConfig.rateLimits.maxTokensPerRequest, 1, 1000000)
    },
    outputGuardrails: {
      ...defaultAiGuardrailConfig.outputGuardrails,
      fallbackMessage: input.fallbackMessage?.trim() || defaultAiGuardrailConfig.outputGuardrails.fallbackMessage
    }
  };

  const exportConfig = buildExportConfig(config);
  const enabledProtectionCount =
    Object.values(config.contentFilters).filter((filter) => filter.enabled).length +
    Object.values(config.piiProtection).filter((rule) => rule.enabled).length +
    (config.jailbreakProtection.enabled ? 1 : 0);

  return {
    config,
    exportConfig,
    enabledProtectionCount,
    reviewChecklist: [
      "Review refusal fallback before release.",
      "Confirm PII redaction matches data handling policy.",
      "Pair jailbreak threshold with prompt-injection tests.",
      "Validate rate limits against expected launch traffic."
    ],
    summary: `${config.name || "Guardrail config"} enables ${enabledProtectionCount.toLocaleString("en-US")} local protections.`,
    privacyNote
  };
}

export function buildExportConfig(config: AiGuardrailConfig): AiGuardrailExportConfig {
  return {
    name: `${slugify(config.name || "guardrails-config")}-guardrails`.replace(/-guardrails-guardrails$/, "-guardrails"),
    version: "1.0",
    content_filters: {
      ...(config.contentFilters.violence.enabled && {
        violence: {
          threshold: config.contentFilters.violence.threshold,
          action: config.contentFilters.violence.action
        }
      }),
      ...(config.contentFilters.hateSpeech.enabled && {
        hate_speech: {
          threshold: config.contentFilters.hateSpeech.threshold,
          action: config.contentFilters.hateSpeech.action
        }
      }),
      ...(config.contentFilters.selfHarm.enabled && {
        self_harm: {
          threshold: config.contentFilters.selfHarm.threshold,
          action: config.contentFilters.selfHarm.action
        }
      }),
      ...(config.contentFilters.sexual.enabled && {
        sexual: {
          threshold: config.contentFilters.sexual.threshold,
          action: config.contentFilters.sexual.action
        }
      })
    },
    pii_protection: {
      ...(config.piiProtection.email.enabled && { email: { action: config.piiProtection.email.action } }),
      ...(config.piiProtection.phone.enabled && { phone: { action: config.piiProtection.phone.action } }),
      ...(config.piiProtection.ssn.enabled && { ssn: { action: config.piiProtection.ssn.action } }),
      ...(config.piiProtection.creditCard.enabled && { credit_card: { action: config.piiProtection.creditCard.action } })
    },
    rate_limits: {
      requests_per_minute: config.rateLimits.requestsPerMinute,
      tokens_per_minute: config.rateLimits.tokensPerMinute,
      max_tokens_per_request: config.rateLimits.maxTokensPerRequest
    },
    jailbreak_protection: {
      enabled: config.jailbreakProtection.enabled,
      threshold: config.jailbreakProtection.threshold
    },
    output_guardrails: {
      block_refusals: config.outputGuardrails.blockRefusals,
      max_retries: config.outputGuardrails.maxRetries,
      fallback_message: config.outputGuardrails.fallbackMessage
    }
  };
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "guardrails-config";
}

function clampInteger(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.round(value)));
}
