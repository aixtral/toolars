import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import en from "../../../../../messages/en.json";
import { InvestmentGoalWorkspace } from "./investment-goal-workspace";

const investmentGoalSourceFile = "src/app/[locale]/tools/investment-goal/investment-goal-workspace.tsx";

function scanInvestmentGoalWorkspaceSource() {
  return scanSourceText(readFileSync(investmentGoalSourceFile, "utf8"), investmentGoalSourceFile);
}

const localizedWorkspaceCopy = {
  eyebrow: "ES VitalCalc goal-planning workspace",
  title: "ES Investment Goal Calculator",
  subtitle: "ES Estimate the monthly investment needed to reach a target amount.",
  modelTitle: "ES Local calculation model",
  detailsLink: "ES Tool details",
  trustRows: {
    local: {
      label: "ES Local",
      text: "ES Goal, balance, return, and timeline stay in this browser session"
    },
    noGuarantee: {
      label: "ES No guarantee",
      text: "ES Market returns are assumptions, not promised outcomes"
    },
    private: {
      label: "ES Private",
      text: "ES Save only stores the goal plan locally when you choose it"
    }
  },
  inputSection: {
    title: "ES Goal inputs",
    description: "ES Use goal amount, starting balance, expected return, and timeline."
  },
  badges: {
    local: "ES Local",
    goal: "ES Goal",
    covered: "ES covered",
    needsContribution: "ES needs contribution"
  },
  fields: {
    goalAmount: "ES Goal amount",
    startingBalance: "ES Starting balance",
    annualReturn: "ES Annual return",
    years: "ES Years to goal"
  },
  actions: {
    save: "ES Save goal plan",
    calculate: "ES Calculate monthly investment"
  },
  resultSection: {
    title: "ES Monthly investment summary",
    emptyDescription: "ES Run calculation to see required monthly investment.",
    summaryCovered: "ES Starting balance can reach {goalAmount} in {years} years",
    summaryNeedsContribution: "ES {monthlyInvestment} per month to reach {goalAmount} in {years} years",
    waitingTitle: "ES Waiting for calculation",
    waitingDescription: "ES Calculate first to review the monthly plan.",
    startingBalanceDetail: "ES {startingBalance} starting balance over {years} years."
  },
  metrics: {
    monthlyInvestment: "ES Monthly investment",
    totalInvested: "ES Total invested",
    startingBalanceGrowth: "ES Starting balance growth",
    goalGap: "ES Goal gap"
  },
  review: {
    eyebrow: "ES Review checklist",
    title: "ES Market assumption notes",
    notes: {
      formula: "ES VitalCalc uses the future value of an annuity formula to solve required monthly investment.",
      gap: "ES Starting balance is compounded first, then the remaining goal gap is funded monthly.",
      variables: "ES Returns, fees, taxes, and contribution timing can make real-world results differ."
    }
  },
  recommendation: {
    title: "ES No guarantee",
    body: "ES Use this as planning math only; update assumptions as fees, taxes, income, and market returns change."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "investment-goal": {
      ...en.tools["investment-goal"],
      workspace: localizedWorkspaceCopy
    }
  }
};

describe("InvestmentGoalWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanInvestmentGoalWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    render(
      <NextIntlClientProvider locale="es" messages={localizedMessages}>
        <InvestmentGoalWorkspace />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.goalAmount)).toHaveValue(500000);
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.emptyDescription)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.metrics.monthlyInvestment)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.recommendation.body)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: localizedWorkspaceCopy.detailsLink })).toHaveAttribute(
      "href",
      "/es/tools/investment-goal/about"
    );

    fireEvent.click(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate }));

    expect(screen.getByText("ES $765 per month to reach $500,000 in 20 years")).toBeInTheDocument();
    expect(screen.getByText("ES $10,000 starting balance over 20 years.")).toBeInTheDocument();
  });

  it("renders the local VitalCalc investment goal workspace sections", () => {
    renderWithIntl(<InvestmentGoalWorkspace />);

    expect(screen.getByRole("heading", { name: "Investment Goal Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Goal inputs")).toBeInTheDocument();
    expect(screen.getByText("Monthly investment summary")).toBeInTheDocument();
    expect(screen.getByText("Market assumption notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Goal amount")).toHaveValue(500000);
    expect(screen.getByLabelText("Starting balance")).toHaveValue(10000);
    expect(screen.getByLabelText("Annual return")).toHaveValue(8);
    expect(screen.getByLabelText("Years to goal")).toHaveValue(20);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/investment-goal/about"
    );
  });

  it("calculates the default monthly investment and saves assumptions locally", () => {
    renderWithIntl(<InvestmentGoalWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate monthly investment" }));

    expect(screen.getByText("$765")).toBeInTheDocument();
    expect(screen.getByText("$193,654")).toBeInTheDocument();
    expect(screen.getByText("$49,268")).toBeInTheDocument();
    expect(screen.getByText("$450,732")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save goal plan" }));

    expect(window.localStorage.getItem("toolars.investment-goal.plan")).toContain("500000");
  });
});
