import { execFileSync } from "node:child_process";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { BudgetRuleWorkspace } from "./budget-rule-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "ES VitalCalc finance workspace",
  title: "ES 50/30/20 Budget Rule",
  subtitle: "ES Split monthly income into needs, wants, and savings using adjustable ratios.",
  modelTitle: "ES Local calculation model",
  detailsLink: "ES Tool details",
  trustRows: {
    local: { label: "ES Local", text: "ES Income and allocation ratios stay in this browser session" },
    reference: { label: "ES Reference", text: "ES 50/30/20 is a budgeting heuristic, not a mandate" },
    private: { label: "ES Private", text: "ES Save only stores the plan locally when you choose it" }
  },
  inputSection: {
    title: "ES Budget inputs",
    description: "ES Use the VitalCalc 50/30/20 sample or tune percentages for the household."
  },
  badges: {
    local: "ES Local",
    budget: "ES Budget",
    total: "ES {percent}% total"
  },
  fields: {
    monthlyIncome: "ES Monthly income",
    needsPercent: "ES Needs percent",
    wantsPercent: "ES Wants percent",
    savingsPercent: "ES Savings percent"
  },
  actions: {
    save: "ES Save budget",
    calculate: "ES Generate budget"
  },
  resultSection: {
    title: "ES Budget allocation",
    emptyDescription: "ES Run calculation to split income into three buckets.",
    waitingTitle: "ES Waiting for calculation",
    waitingDescription: "ES Calculate first to review the allocation health.",
    envelopeDescription: "ES Use this as a monthly envelope before transaction-level tracking."
  },
  metrics: {
    monthlyIncome: "ES Monthly income",
    needs: "ES Needs",
    wants: "ES Wants",
    savings: "ES Savings"
  },
  review: {
    eyebrow: "ES Review checklist",
    title: "ES Budget notes",
    notes: {
      split: "ES VitalCalc splits income into needs, wants, and savings by percentage.",
      adjust: "ES Adjust ratios when rent, debt payoff, or savings priorities require it.",
      review: "ES A ratio total outside 100% needs review before using the allocation."
    }
  },
  recommendation: {
    title: "ES Local-first",
    body: "ES No payroll or transaction data is required. This is a local allocation planner."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "budget-rule": {
      ...en.tools["budget-rule"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function scanBudgetRuleWorkspaceSource() {
  const script = `
    import fs from "node:fs/promises";
    import { scanSourceText } from "./scripts/audit-i18n.mjs";

    const file = "src/app/[locale]/tools/budget-rule/budget-rule-workspace.tsx";
    const source = await fs.readFile(file, "utf8");
    console.log(JSON.stringify(scanSourceText(source, file)));
  `;

  return JSON.parse(execFileSync(process.execPath, ["--input-type=module", "-e", script], { encoding: "utf8" })) as {
    absoluteHrefs: Array<{ file: string; href: string }>;
    hardcodedText: Array<{ file: string; kind: string; text: string }>;
  };
}

describe("BudgetRuleWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const scan = scanBudgetRuleWorkspaceSource();

    expect(scan.hardcodedText).toEqual([]);
    expect(scan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc budget rule workspace sections", () => {
    renderWithIntl(<BudgetRuleWorkspace />);

    expect(screen.getByRole("heading", { name: "50/30/20 Budget Rule" })).toBeInTheDocument();
    expect(screen.getByText("Budget inputs")).toBeInTheDocument();
    expect(screen.getByText("Budget allocation")).toBeInTheDocument();
    expect(screen.getByText("Budget notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("5000")).toBeInTheDocument();
    expect(screen.getByDisplayValue("50")).toBeInTheDocument();
    expect(screen.getByDisplayValue("30")).toBeInTheDocument();
    expect(screen.getByDisplayValue("20")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/budget-rule/about"
    );
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    render(
      <NextIntlClientProvider locale="es" messages={localizedMessages}>
        <BudgetRuleWorkspace />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("heading", { name: "ES 50/30/20 Budget Rule" })).toBeInTheDocument();
    expect(screen.getByText("ES Budget inputs")).toBeInTheDocument();
    expect(screen.getByText("ES Budget allocation")).toBeInTheDocument();
    expect(screen.getByLabelText("ES Monthly income")).toHaveValue(5000);
    expect(screen.getByRole("button", { name: "ES Generate budget" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ES Tool details" })).toHaveAttribute(
      "href",
      "/es/tools/budget-rule/about"
    );
  });

  it("calculates the default budget split and saves assumptions locally", () => {
    renderWithIntl(<BudgetRuleWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Generate budget" }));

    expect(screen.getByText("$2,500")).toBeInTheDocument();
    expect(screen.getByText("$1,500")).toBeInTheDocument();
    expect(screen.getByText("$1,000")).toBeInTheDocument();
    expect(screen.getByText("Healthy savings rate! Keep it up.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save budget" }));

    expect(window.localStorage.getItem("toolars.budget-rule.plan")).toContain("5000");
  });
});
