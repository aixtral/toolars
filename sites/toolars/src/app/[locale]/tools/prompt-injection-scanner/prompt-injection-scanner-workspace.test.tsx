import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { PromptInjectionScannerWorkspace } from "./prompt-injection-scanner-workspace";

const promptInjectionScannerSourceFile =
  "src/app/[locale]/tools/prompt-injection-scanner/prompt-injection-scanner-workspace.tsx";

function scanPromptInjectionScannerSource() {
  return scanSourceText(readFileSync(promptInjectionScannerSourceFile, "utf8"), promptInjectionScannerSourceFile);
}

const localizedWorkspaceCopy = {
  samplePrompt: "ES Sample prompt for localized review.",
  shell: {
    reportReady: "ES Report ready",
    waiting: "ES Waiting",
    localFindings: "ES Local findings",
    consentGated: "ES Consent gated",
    runMode: "ES Heuristic scan"
  },
  eyebrow: "ES AI security",
  title: "ES Prompt Injection Scanner",
  subtitle: "ES Scan localized prompt surfaces before they reach an agent.",
  profileTitle: "ES Scan profile",
  trustRows: {
    local: {
      label: "ES Local",
      text: "ES Heuristic rules run in-browser"
    },
    ai: {
      label: "ES AI",
      text: "ES Optional deep review requires consent"
    },
    team: {
      label: "ES Team",
      text: "ES Reports can be saved to review log"
    }
  },
  actions: {
    deepReview: "ES Run AI deep review",
    details: "ES Tool details",
    saveDraft: "ES Save draft",
    scan: "ES Scan prompt",
    exportReport: "ES Export report",
    saveToLab: "ES Save to Lab stack",
    createChecklist: "ES Create checklist"
  },
  inputSection: {
    title: "ES Prompt surface",
    description: "ES Paste a localized prompt surface."
  },
  fields: {
    promptContent: "ES Prompt content"
  },
  badges: {
    scanned: "ES Scanned",
    notScanned: "ES Not scanned"
  },
  resultSection: {
    title: "ES Risk report",
    readyDescription: "ES Findings, severity, and guardrails.",
    emptyDescription: "ES Run a scan to populate findings.",
    riskScoreLabel: "ES Risk score",
    waitingTitle: "ES Waiting for scan",
    waitingDescription: "ES Findings appear here.",
    noPatterns: "ES No injection patterns detected",
    summary: {
      noContent: "ES No prompt content provided.",
      safe: "ES Low risk: local scan did not find override patterns.",
      detected: "ES {risk}: detected {patterns}."
    }
  },
  metrics: {
    riskScore: "ES Risk score"
  },
  riskLevels: {
    low: "ES Low risk",
    medium: "ES Medium risk",
    high: "ES High risk",
    critical: "ES Critical risk"
  },
  riskNames: {
    low: "ES Low risk",
    medium: "ES Medium risk",
    high: "ES High risk",
    critical: "ES Critical risk"
  },
  severity: {
    low: "ES low",
    medium: "ES medium",
    high: "ES high",
    critical: "ES critical"
  },
  patterns: {
    ignore_instructions: {
      label: "ES ignore instructions",
      description: "ES Attempts to override trusted instructions."
    },
    role_override: {
      label: "ES role override",
      description: "ES Attempts to change assistant authority."
    },
    system_prompt_leak: {
      label: "ES system prompt leak",
      description: "ES Requests hidden prompts."
    },
    context_escape: {
      label: "ES context escape",
      description: "ES Uses control tokens to escape context."
    },
    jailbreak_attempt: {
      label: "ES jailbreak attempt",
      description: "ES Attempts to bypass safety filters."
    },
    data_exposure: {
      label: "ES data exposure",
      description: "ES Includes credential-shaped fields."
    }
  },
  review: {
    eyebrow: "ES Guardrail pattern",
    title: "ES Recommended remediation",
    subtitle: "ES Turn findings into a localized checklist.",
    notes: {
      separate: "ES Separate trusted system instructions from retrieved content.",
      secrets: "ES Block requests to reveal hidden prompts or secrets.",
      callbacks: "ES Require approval before external URL callbacks."
    }
  },
  recommendations: {
    safe: "ES Keep local review enabled for untrusted inputs.",
    ignore_instructions: "ES Separate trusted system instructions from retrieved content.",
    role_override: "ES Block role-changing requests.",
    system_prompt_leak: "ES Block requests to reveal hidden prompts or secrets.",
    context_escape: "ES Sanitize model control tokens.",
    jailbreak_attempt: "ES Reject jailbreak language.",
    data_exposure: "ES Redact credentials and PII."
  },
  callout: {
    title: "ES AI only after consent",
    body: "ES Deep review is optional."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "prompt-injection-scanner": {
      ...en.tools["prompt-injection-scanner"],
      workspace: localizedWorkspaceCopy
    }
  }
};

describe("PromptInjectionScannerWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the Toolars AI security workspace sections", () => {
    renderWithIntl(<PromptInjectionScannerWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "prompt-injection-scanner");
    expect(document.querySelector(".prompt-overview-panel")).toHaveAttribute("data-prompt-mobile-density", "title-single-line-v2");
    expect(screen.getByText("Run mode")).toBeInTheDocument();
    expect(screen.getByText("Provider route")).toBeInTheDocument();
    expect(screen.getByText("Artifact state")).toBeInTheDocument();
    expect(screen.getByText("Heuristic scan")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Prompt Injection Scanner" })).toBeInTheDocument();
    expect(screen.getByText("Prompt surface")).toBeInTheDocument();
    expect(screen.getByText("Risk report")).toBeInTheDocument();
    expect(screen.getByText("Recommended remediation")).toBeInTheDocument();
    expect(screen.getByText("Heuristic rules run in-browser")).toBeInTheDocument();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanPromptInjectionScannerSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    render(
      <NextIntlClientProvider locale="es" messages={localizedMessages}>
        <PromptInjectionScannerWorkspace />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("heading", { name: "ES Prompt Injection Scanner" })).toBeInTheDocument();
    expect(screen.getByText("ES Prompt surface")).toBeInTheDocument();
    expect(screen.getByLabelText("ES Prompt content")).toHaveValue("ES Sample prompt for localized review.");
    expect(screen.getByRole("button", { name: "ES Scan prompt" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ES Create checklist" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ES Tool details" })).toHaveAttribute(
      "href",
      "/es/tools/prompt-injection-scanner/about"
    );
  });

  it("scans the sample prompt and shows a critical risk report", () => {
    renderWithIntl(<PromptInjectionScannerWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Scan prompt" }));

    expect(screen.getByText("Critical risk")).toBeInTheDocument();
    expect(screen.getByText("ignore instructions")).toBeInTheDocument();
    expect(screen.getByText("system prompt leak")).toBeInTheDocument();
    expect(screen.getByText("Create checklist")).toBeInTheDocument();
  });

  it("shows a safe local result for ordinary prompts", () => {
    renderWithIntl(<PromptInjectionScannerWorkspace />);

    fireEvent.change(screen.getByLabelText("Prompt content"), {
      target: { value: "Summarize this product changelog into three customer-friendly bullets." }
    });
    fireEvent.click(screen.getByRole("button", { name: "Scan prompt" }));

    expect(screen.getByText("Low risk")).toBeInTheDocument();
    expect(screen.getByText("No injection patterns detected")).toBeInTheDocument();
  });

  it("saves a draft without replacing the current prompt", () => {
    renderWithIntl(<PromptInjectionScannerWorkspace />);

    const textarea = screen.getByLabelText("Prompt content");
    fireEvent.change(textarea, {
      target: { value: "Custom policy prompt for review." }
    });
    fireEvent.click(screen.getByRole("button", { name: "Save draft" }));

    expect(textarea).toHaveValue("Custom policy prompt for review.");
    expect(window.localStorage.getItem("toolars.prompt-injection-scanner.draft")).toBe("Custom policy prompt for review.");
  });
});
