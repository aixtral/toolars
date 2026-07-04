import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { SavingsGoalWorkspace } from "./savings-goal-workspace";

const savingsGoalSourceFile = "src/app/[locale]/tools/savings-goal/savings-goal-workspace.tsx";

function scanSavingsGoalWorkspaceSource() {
  return scanSourceText(readFileSync(savingsGoalSourceFile, "utf8"), savingsGoalSourceFile);
}

const localizedWorkspaceCopy = {
  eyebrow: "ES VitalCalc finance workspace",
  title: "ES Savings Goal Calculator",
  subtitle: "ES Estimate how long a fixed monthly savings plan takes to reach a target.",
  modelTitle: "ES Local calculation model",
  detailsLink: "ES Tool details",
  trustRows: {
    local: { label: "ES Local", text: "ES Goal, savings, and return assumptions stay in this browser session" },
    reference: { label: "ES Reference", text: "ES Returns are projections and can be zero or variable" },
    private: { label: "ES Private", text: "ES Save only stores the plan locally when you choose it" }
  },
  inputSection: {
    title: "ES Savings inputs",
    description: "ES Use the VitalCalc sample, then adjust the target, current balance, monthly savings, and return."
  },
  badges: {
    local: "ES Local",
    projection: "ES Projection"
  },
  fields: {
    goalAmount: "ES Goal amount",
    currentSavings: "ES Current savings",
    monthlySavings: "ES Monthly savings",
    annualReturn: "ES Annual return"
  },
  actions: {
    save: "ES Save savings plan",
    calculate: "ES Calculate goal"
  },
  resultSection: {
    title: "ES Goal timeline",
    emptyDescription: "ES Run calculation to estimate months, contributions, and growth.",
    summary: "ES {goal} goal with {monthly}/month",
    timeMonths: "ES {count, plural, one {# month} other {# months}}",
    timeYearsPlus: "ES 50+ years",
    emptyTime: "ES 0 months",
    waitingTitle: "ES Waiting for calculation",
    waitingDescription: "ES Calculate first to see the savings horizon.",
    targetTitle: "ES Target {amount}",
    feasibilityDescription: "ES Adjust monthly savings or return assumptions to test feasibility."
  },
  metrics: {
    timeToGoal: "ES Time to goal",
    totalContributions: "ES Total contributions",
    interestEarned: "ES Interest earned",
    finalAmount: "ES Final amount"
  },
  review: {
    eyebrow: "ES Review checklist",
    title: "ES Savings notes",
    notes: {
      fixed: "ES VitalCalc models fixed monthly contributions at month-end.",
      capped: "ES The source caps long timelines at 600 months and labels them as 50+ years.",
      nearTerm: "ES For near-term goals, consider lower-risk cash or bond-like assumptions."
    }
  },
  recommendation: {
    title: "ES Local-first",
    body: "ES No account balances leave the browser. Outputs are planning estimates."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "savings-goal": {
      ...en.tools["savings-goal"],
      workspace: localizedWorkspaceCopy
    }
  }
};

describe("SavingsGoalWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanSavingsGoalWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc savings goal workspace sections", () => {
    renderWithIntl(<SavingsGoalWorkspace />);

    expect(screen.getByRole("heading", { name: "Savings Goal Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Savings inputs")).toBeInTheDocument();
    expect(screen.getByText("Goal timeline")).toBeInTheDocument();
    expect(screen.getByText("Savings notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("50000")).toBeInTheDocument();
    expect(screen.getByDisplayValue("10000")).toBeInTheDocument();
    expect(screen.getByDisplayValue("500")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/savings-goal/about"
    );
  });

  it("calculates the default goal timeline and saves assumptions locally", () => {
    renderWithIntl(<SavingsGoalWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate goal" }));

    expect(screen.getByText("65 months")).toBeInTheDocument();
    expect(screen.getByText("$42,500")).toBeInTheDocument();
    expect(screen.getByText("$7,841")).toBeInTheDocument();
    expect(screen.getByText("$50,341")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save savings plan" }));

    expect(window.localStorage.getItem("toolars.savings-goal.plan")).toContain("50000");
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    render(
      <NextIntlClientProvider locale="es" messages={localizedMessages}>
        <SavingsGoalWorkspace />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("heading", { name: "ES Savings Goal Calculator" })).toBeInTheDocument();
    expect(screen.getByText("ES Savings inputs")).toBeInTheDocument();
    expect(screen.getByLabelText("ES Goal amount")).toHaveValue(50000);
    expect(screen.getByText("ES Run calculation to estimate months, contributions, and growth.")).toBeInTheDocument();
    expect(screen.getByText("ES Time to goal")).toBeInTheDocument();
    expect(screen.getByText("ES Savings notes")).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.recommendation.body)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ES Calculate goal" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ES Tool details" })).toHaveAttribute(
      "href",
      "/es/tools/savings-goal/about"
    );

    fireEvent.click(screen.getByRole("button", { name: "ES Calculate goal" }));

    expect(screen.getByText("ES $50,000 goal with $500/month")).toBeInTheDocument();
    expect(screen.getByText("ES 65 months")).toBeInTheDocument();
    expect(screen.getByText("ES Target $50,000")).toBeInTheDocument();
  });
});
