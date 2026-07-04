import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { InflationCalculatorWorkspace } from "./inflation-calculator-workspace";

const inflationCalculatorSourceFile =
  "src/app/[locale]/tools/inflation-calculator/inflation-calculator-workspace.tsx";

function scanInflationCalculatorWorkspaceSource() {
  return scanSourceText(readFileSync(inflationCalculatorSourceFile, "utf8"), inflationCalculatorSourceFile);
}

const localizedWorkspaceCopy = {
  eyebrow: "ES VitalCalc purchasing power workspace",
  title: "ES Inflation Calculator",
  subtitle: "ES Estimate how inflation erodes purchasing power over a planning timeline.",
  modelTitle: "ES Local calculation model",
  detailsLink: "ES Tool details",
  trustRows: {
    local: {
      label: "ES Local",
      text: "ES Amount, rate, and timeline assumptions stay in this browser session"
    },
    scenario: {
      label: "ES Scenario",
      text: "ES Inflation results are estimates, not forecasts"
    },
    private: {
      label: "ES Private",
      text: "ES Save only stores the inflation scenario locally when you choose it"
    }
  },
  inputSection: {
    title: "ES Inflation inputs",
    description: "ES Use current amount, annual inflation rate, and years."
  },
  badges: {
    local: "ES Local",
    purchasingPower: "ES Purchasing power",
    scenario: "ES Scenario"
  },
  fields: {
    amount: "ES Current amount",
    annualInflationRate: "ES Annual inflation rate",
    years: "ES Years"
  },
  actions: {
    save: "ES Save scenario",
    calculate: "ES Calculate inflation"
  },
  resultSection: {
    title: "ES Purchasing power summary",
    emptyDescription: "ES Run calculation to see future purchasing power and inflation loss.",
    summary: "ES {originalAmount} keeps {futurePurchasingPower} of purchasing power after {years} years",
    waitingTitle: "ES Waiting for calculation",
    waitingDescription: "ES Calculate first to review purchasing-power assumptions.",
    breakEvenDetail: "ES Nominal break-even return before fees and taxes."
  },
  metrics: {
    futurePurchasingPower: "ES Future purchasing power",
    originalAmount: "ES Original amount",
    cumulativeInflation: "ES Cumulative inflation",
    purchasingPowerLoss: "ES Purchasing-power loss"
  },
  review: {
    eyebrow: "ES Review checklist",
    title: "ES Assumption notes",
    notes: {
      purchasingPower:
        "ES VitalCalc future purchasing power equals current amount divided by (1 + inflation rate)^years.",
      inflationVariation:
        "ES Inflation rates vary by country, category, time period, and personal spending basket.",
      breakEven:
        "ES Break-even return is the nominal return needed before fees and taxes to preserve purchasing power."
    }
  },
  recommendation: {
    title: "ES Local-first",
    body: "ES Inflation scenarios are calculated locally and saved only when you choose Save."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "inflation-calculator": {
      ...en.tools["inflation-calculator"],
      workspace: localizedWorkspaceCopy
    }
  }
};

describe("InflationCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanInflationCalculatorWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc inflation workspace sections", () => {
    renderWithIntl(<InflationCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Inflation Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Inflation inputs")).toBeInTheDocument();
    expect(screen.getByText("Purchasing power summary")).toBeInTheDocument();
    expect(screen.getByText("Assumption notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Current amount")).toHaveValue(1000);
    expect(screen.getByLabelText("Annual inflation rate")).toHaveValue(3);
    expect(screen.getByLabelText("Years")).toHaveValue(10);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/inflation-calculator/about"
    );
  });

  it("calculates the default purchasing-power scenario and saves assumptions locally", () => {
    renderWithIntl(<InflationCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate inflation" }));

    expect(screen.getByText("$744")).toBeInTheDocument();
    expect(screen.getByText("$1,000")).toBeInTheDocument();
    expect(screen.getByText("$256")).toBeInTheDocument();
    expect(screen.getByText("34.4%")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save scenario" }));

    expect(window.localStorage.getItem("toolars.inflation-calculator.plan")).toContain("1000");
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    render(
      <NextIntlClientProvider locale="es" messages={localizedMessages}>
        <InflationCalculatorWorkspace />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("heading", { name: "ES Inflation Calculator" })).toBeInTheDocument();
    expect(screen.getByText("ES Inflation inputs")).toBeInTheDocument();
    expect(screen.getByLabelText("ES Current amount")).toHaveValue(1000);
    expect(screen.getByText("ES Run calculation to see future purchasing power and inflation loss.")).toBeInTheDocument();
    expect(screen.getByText("ES Future purchasing power")).toBeInTheDocument();
    expect(screen.getByText("ES Assumption notes")).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.recommendation.body)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ES Calculate inflation" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ES Tool details" })).toHaveAttribute(
      "href",
      "/es/tools/inflation-calculator/about"
    );

    fireEvent.click(screen.getByRole("button", { name: "ES Calculate inflation" }));

    expect(screen.getByText("ES $1,000 keeps $744 of purchasing power after 10 years")).toBeInTheDocument();
    expect(screen.getByText("ES Nominal break-even return before fees and taxes.")).toBeInTheDocument();
  });
});
