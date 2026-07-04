import { describe, expect, it } from "vitest";
import { buildAiGuardrailConfig, defaultAiGuardrailConfig } from "./ai-guardrail-config";

describe("buildAiGuardrailConfig", () => {
  it("builds a local export config with content, PII, jailbreak, and rate-limit guardrails", () => {
    const result = buildAiGuardrailConfig({
      name: "Checkout assistant",
      fallbackMessage: "I cannot help with that request.",
      requestsPerMinute: 30,
      tokensPerMinute: 50000,
      maxTokensPerRequest: 2048
    });

    expect(result.exportConfig.name).toBe("checkout-assistant-guardrails");
    expect(result.exportConfig.content_filters.self_harm).toMatchObject({ threshold: 0.8, action: "block" });
    expect(result.exportConfig.pii_protection.email).toMatchObject({ action: "redact" });
    expect(result.exportConfig.jailbreak_protection).toMatchObject({ enabled: true, threshold: 0.8 });
    expect(result.enabledProtectionCount).toBeGreaterThanOrEqual(9);
    expect(result.reviewChecklist).toContain("Review refusal fallback before release.");
    expect(result.summary).toContain("Checkout assistant");
    expect(result.privacyNote).toBe("Local guardrail config builder only; policy drafts stay in the browser.");
  });

  it("keeps defaults immutable while allowing overrides", () => {
    const result = buildAiGuardrailConfig({ name: "Strict support bot", hateSpeechAction: "warn" });

    expect(defaultAiGuardrailConfig.contentFilters.hateSpeech.action).toBe("block");
    expect(result.exportConfig.content_filters.hate_speech).toMatchObject({ action: "warn" });
  });
});
