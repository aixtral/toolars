import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { EmergencyFundWorkspace } from "./emergency-fund-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "ES VitalCalc finance workspace",
  title: "ES Emergency Fund Calculator",
  subtitle: "ES Estimate a cash buffer from monthly expenses, target coverage, current savings, and timeline.",
  modelTitle: "ES Local calculation model",
  detailsLink: "ES Tool details",
  trustRows: {
    local: { label: "ES Local", text: "ES Expense and savings assumptions stay in this browser session" },
    reference: { label: "ES Reference", text: "ES Coverage months are planning targets, not guarantees" },
    private: { label: "ES Private", text: "ES Save only stores the plan locally when you choose it" }
  },
  inputSection: {
    title: "ES Emergency inputs",
    description: "ES Use the VitalCalc sample, then adjust coverage and timeline."
  },
  badges: {
    local: "ES Local",
    planning: "ES Planning"
  },
  fields: {
    monthlyExpenses: "ES Monthly expenses",
    coverageMonths: "ES Coverage months",
    currentSavings: "ES Current emergency savings",
    targetTimeline: "ES Time to reach goal"
  },
  actions: {
    save: "ES Save fund plan",
    calculate: "ES Calculate fund"
  },
  resultSection: {
    title: "ES Fund target",
    emptyDescription: "ES Run calculation to estimate target, gap, and monthly savings.",
    progressTitle: "ES Savings progress {progress}",
    waitingTitle: "ES Waiting for calculation",
    waitingDescription: "ES Calculate first to see the coverage gap.",
    liquidityDescription: "ES Use a dedicated high-liquidity account for this buffer."
  },
  metrics: {
    target: "ES Emergency target",
    gap: "ES Savings gap",
    monthlyNeeded: "ES Monthly needed",
    currentProgress: "ES Current progress"
  },
  review: {
    eyebrow: "ES Review checklist",
    title: "ES Emergency notes",
    notes: {
      coverage: "ES VitalCalc source recommends 3-6 months for many single earners and 6-12 months for families.",
      liquidity: "ES Keep emergency funds liquid and separate from long-term investments.",
      essential: "ES Use essential monthly expenses, not total lifestyle spending, for the base target."
    }
  },
  recommendation: {
    title: "ES Local-first",
    body: "ES No bank account or income data is required. Results are planning estimates."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "emergency-fund": {
      ...en.tools["emergency-fund"],
      workspace: localizedWorkspaceCopy
    }
  }
};

const emergencyFundSourceFile = "src/app/[locale]/tools/emergency-fund/emergency-fund-workspace.tsx";

function scanEmergencyFundWorkspaceSource() {
  return scanSourceText(readFileSync(emergencyFundSourceFile, "utf8"), emergencyFundSourceFile);
}

describe("EmergencyFundWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanEmergencyFundWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc emergency fund workspace sections", () => {
    renderWithIntl(<EmergencyFundWorkspace />);

    expect(screen.getByRole("heading", { name: "Emergency Fund Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Emergency inputs")).toBeInTheDocument();
    expect(screen.getByText("Fund target")).toBeInTheDocument();
    expect(screen.getByText("Emergency notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("3000")).toBeInTheDocument();
    expect(screen.getByDisplayValue("6")).toBeInTheDocument();
    expect(screen.getByDisplayValue("5000")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/emergency-fund/about"
    );
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    render(
      <NextIntlClientProvider locale="es" messages={localizedMessages}>
        <EmergencyFundWorkspace />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("heading", { name: "ES Emergency Fund Calculator" })).toBeInTheDocument();
    expect(screen.getByText("ES Emergency inputs")).toBeInTheDocument();
    expect(screen.getByLabelText("ES Monthly expenses")).toHaveValue(3000);
    expect(screen.getByRole("button", { name: "ES Calculate fund" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ES Tool details" })).toHaveAttribute(
      "href",
      "/es/tools/emergency-fund/about"
    );
  });

  it("calculates the default emergency target and saves assumptions locally", () => {
    renderWithIntl(<EmergencyFundWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate fund" }));

    expect(screen.getByText("$18,000")).toBeInTheDocument();
    expect(screen.getByText("$13,000")).toBeInTheDocument();
    expect(screen.getByText("$1,083")).toBeInTheDocument();
    expect(screen.getByText("Savings progress $5,000 / $18,000")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save fund plan" }));

    expect(window.localStorage.getItem("toolars.emergency-fund.plan")).toContain("3000");
  });
});
