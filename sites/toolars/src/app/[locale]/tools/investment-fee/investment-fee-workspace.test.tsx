import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { InvestmentFeeWorkspace } from "./investment-fee-workspace";

const investmentFeeSourceFile =
  "src/app/[locale]/tools/investment-fee/investment-fee-workspace.tsx";

function scanInvestmentFeeWorkspaceSource() {
  return scanSourceText(readFileSync(investmentFeeSourceFile, "utf8"), investmentFeeSourceFile);
}

const localizedWorkspaceCopy = {
  eyebrow: "ES VitalCalc fee-drag workspace",
  title: "ES Investment Fee Calculator",
  subtitle: "ES Compare long-term growth before and after annual management fees.",
  modelTitle: "ES Local calculation model",
  detailsLink: "ES Tool details",
  trustRows: {
    local: { label: "ES Local", text: "ES Investment assumptions stay in this browser session" },
    noAdvice: { label: "ES No advice", text: "ES Fee drag math is not fund selection or investment advice" },
    private: { label: "ES Private", text: "ES Save only stores the scenario locally when you choose it" }
  },
  inputSection: {
    title: "ES Fee drag inputs",
    description: "ES Use starting amount, monthly contribution, return, period, and annual fee."
  },
  badges: {
    local: "ES Local",
    fees: "ES Fees",
    low: "ES low",
    medium: "ES medium",
    high: "ES high"
  },
  fields: {
    initialInvestment: "ES Initial investment",
    monthlyContribution: "ES Monthly contribution",
    annualReturn: "ES Expected annual return",
    years: "ES Investment period",
    annualFee: "ES Annual management fee"
  },
  actions: {
    save: "ES Save fee scenario",
    calculate: "ES Calculate fee impact"
  },
  resultSection: {
    title: "ES Fee impact summary",
    emptyDescription: "ES Run calculation to see long-term fee drag.",
    summary: "ES {fee} annual fee may reduce ending value by {drag}",
    waitingTitle: "ES Waiting for calculation",
    waitingDescription: "ES Calculate first to compare fee and no-fee paths.",
    investedDetail: "ES {feeAsInvested} of total invested; real return {realReturn}."
  },
  metrics: {
    totalFeesEroded: "ES Total fees eroded",
    withoutFees: "ES Without fees",
    withFees: "ES With fees",
    feeAsEndValue: "ES Fee as end value"
  },
  review: {
    eyebrow: "ES Review checklist",
    title: "ES Fee context notes",
    notes: {
      compare: "ES VitalCalc compares the same investment path with and without annual management fees.",
      subtract: "ES The model subtracts the fee from annual return before monthly compounding.",
      variables: "ES Real returns, expense ratios, taxes, loads, and trading fees can change outcomes."
    }
  },
  recommendation: {
    title: "ES No advice",
    body: "ES Use the output as scenario math; compare official expense ratios and disclosures before investing."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "investment-fee": {
      ...en.tools["investment-fee"],
      workspace: localizedWorkspaceCopy
    }
  }
};

describe("InvestmentFeeWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanInvestmentFeeWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc investment fee workspace sections", () => {
    renderWithIntl(<InvestmentFeeWorkspace />);

    expect(screen.getByRole("heading", { name: "Investment Fee Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Fee drag inputs")).toBeInTheDocument();
    expect(screen.getByText("Fee impact summary")).toBeInTheDocument();
    expect(screen.getByText("Fee context notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Initial investment")).toHaveValue(10000);
    expect(screen.getByLabelText("Monthly contribution")).toHaveValue(500);
    expect(screen.getByLabelText("Expected annual return")).toHaveValue(7);
    expect(screen.getByLabelText("Investment period")).toHaveValue(30);
    expect(screen.getByLabelText("Annual management fee")).toHaveValue(1);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/investment-fee/about"
    );
  });

  it("calculates the default fee drag and saves assumptions locally", () => {
    renderWithIntl(<InvestmentFeeWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate fee impact" }));

    expect(screen.getByText("$128,667")).toBeInTheDocument();
    expect(screen.getByText("$691,150")).toBeInTheDocument();
    expect(screen.getByText("$562,483")).toBeInTheDocument();
    expect(screen.getByText("18.6%")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save fee scenario" }));

    expect(window.localStorage.getItem("toolars.investment-fee.plan")).toContain("10000");
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    render(
      <NextIntlClientProvider locale="es" messages={localizedMessages}>
        <InvestmentFeeWorkspace />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("heading", { name: "ES Investment Fee Calculator" })).toBeInTheDocument();
    expect(screen.getByText("ES Fee drag inputs")).toBeInTheDocument();
    expect(screen.getByLabelText("ES Initial investment")).toHaveValue(10000);
    expect(screen.getByText("ES Run calculation to see long-term fee drag.")).toBeInTheDocument();
    expect(screen.getByText("ES Total fees eroded")).toBeInTheDocument();
    expect(screen.getByText("ES Fee context notes")).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.recommendation.body)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ES Calculate fee impact" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ES Tool details" })).toHaveAttribute(
      "href",
      "/es/tools/investment-fee/about"
    );

    fireEvent.click(screen.getByRole("button", { name: "ES Calculate fee impact" }));

    expect(screen.getByText("ES 1.00% annual fee may reduce ending value by $128,667")).toBeInTheDocument();
    expect(screen.getByText("ES 67.7% of total invested; real return 6.00%.")).toBeInTheDocument();
  });
});
