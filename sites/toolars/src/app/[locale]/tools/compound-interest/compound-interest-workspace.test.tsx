import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { CompoundInterestWorkspace } from "./compound-interest-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "ES VitalCalc finance workspace",
  title: "ES Compound Interest Calculator",
  subtitle: "ES Model investment growth with monthly contributions and monthly compounding.",
  modelTitle: "ES Local calculation model",
  detailsLink: "ES Tool details",
  trustRows: {
    local: { label: "ES Local", text: "ES Investment assumptions stay in this browser session" },
    risk: { label: "ES Risk", text: "ES Projected returns are not guaranteed" },
    export: { label: "ES Export", text: "ES Save assumptions with date and return caveats" }
  },
  inputSection: {
    title: "ES Investment inputs",
    description: "ES Use the VitalCalc sample, then adjust initial balance, contribution, return, and years."
  },
  badges: {
    local: "ES Local"
  },
  fields: {
    initialInvestment: "ES Initial investment",
    monthlyContribution: "ES Monthly contribution",
    annualReturn: "ES Annual return",
    years: "ES Years"
  },
  actions: {
    save: "ES Save plan",
    calculate: "ES Calculate growth",
    export: "ES Export table"
  },
  resultSection: {
    title: "ES Growth summary",
    emptyDescription: "ES Run calculation to project future value and interest earned.",
    projectionTitle: "ES Monthly compounding projection",
    waitingTitle: "ES Waiting for calculation",
    waitingDescription: "ES Calculate first to see year-one growth.",
    firstYearDetail: "ES Year 1 balance {balance} with {interest} interest"
  },
  metrics: {
    futureValue: "ES Future value",
    totalContributions: "ES Total contributions",
    interestEarned: "ES Interest earned",
    yearRows: "ES Year rows"
  },
  review: {
    eyebrow: "ES Review checklist",
    title: "ES Investment notes",
    notes: {
      compounding: "ES Monthly compounding follows the VitalCalc source formula.",
      returns: "ES Long-term returns can vary widely by asset mix, fees, taxes, and sequence risk.",
      advice: "ES Use nominal projections as planning estimates, not investment advice."
    }
  },
  recommendation: {
    title: "ES Local-first",
    body: "ES No brokerage, account, or tax data is required for this projection prototype."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "compound-interest": {
      ...en.tools["compound-interest"],
      workspace: localizedWorkspaceCopy
    }
  }
};

const compoundInterestSourceFile = "src/app/[locale]/tools/compound-interest/compound-interest-workspace.tsx";

function scanCompoundInterestWorkspaceSource() {
  return scanSourceText(readFileSync(compoundInterestSourceFile, "utf8"), compoundInterestSourceFile);
}

describe("CompoundInterestWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanCompoundInterestWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc compound interest workspace sections", () => {
    renderWithIntl(<CompoundInterestWorkspace />);

    expect(screen.getByRole("heading", { name: "Compound Interest Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Investment inputs")).toBeInTheDocument();
    expect(screen.getByText("Growth summary")).toBeInTheDocument();
    expect(screen.getByText("Investment notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("10000")).toBeInTheDocument();
    expect(screen.getByDisplayValue("500")).toBeInTheDocument();
    expect(screen.getByDisplayValue("7")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/compound-interest/about"
    );
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    render(
      <NextIntlClientProvider locale="es" messages={localizedMessages}>
        <CompoundInterestWorkspace />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("heading", { name: "ES Compound Interest Calculator" })).toBeInTheDocument();
    expect(screen.getByText("ES Investment inputs")).toBeInTheDocument();
    expect(screen.getByLabelText("ES Initial investment")).toHaveValue(10000);
    expect(screen.getByRole("button", { name: "ES Calculate growth" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ES Tool details" })).toHaveAttribute(
      "href",
      "/es/tools/compound-interest/about"
    );
  });

  it("calculates the default growth plan and saves it locally", () => {
    renderWithIntl(<CompoundInterestWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate growth" }));

    expect(screen.getByText("$300,851")).toBeInTheDocument();
    expect(screen.getByText("$120,000")).toBeInTheDocument();
    expect(screen.getByText("$170,851")).toBeInTheDocument();
    expect(screen.getByText("Year 1 balance $16,919 with $919 interest")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save plan" }));

    expect(window.localStorage.getItem("toolars.compound-interest.plan")).toContain("10000");
  });
});
