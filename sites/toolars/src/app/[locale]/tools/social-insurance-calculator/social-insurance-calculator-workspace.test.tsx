import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { SocialInsuranceCalculatorWorkspace } from "./social-insurance-calculator-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "ES VitalCalc payroll workspace",
  title: "ES China Social Insurance Calculator",
  subtitle: "ES Estimate five-insurances, housing fund, individual tax, employer cost, and net salary.",
  modelTitle: "ES Local calculation model",
  detailsLink: "ES Tool details",
  trustRows: {
    local: { label: "ES Local", text: "ES Salary and contribution assumptions stay in this browser session" },
    policy: { label: "ES Policy", text: "ES City rules and employer policy can change actual payroll" },
    private: { label: "ES Private", text: "ES Save only stores the payroll case locally when you choose it" }
  },
  inputSection: {
    title: "ES Salary assumptions",
    description: "ES Use salary, housing fund rate, and optional local contribution base limits."
  },
  badges: {
    local: "ES Local",
    payroll: "ES Payroll"
  },
  tones: {
    low: "ES Low",
    medium: "ES Medium",
    high: "ES High"
  },
  fields: {
    salary: "ES Monthly pre-tax salary",
    housingFundRate: "ES Housing fund rate",
    baseMin: "ES Contribution base min",
    baseMax: "ES Contribution base max",
    autoPlaceholder: "ES Auto"
  },
  actions: {
    save: "ES Save payroll case",
    calculate: "ES Calculate contributions"
  },
  resultSection: {
    title: "ES Contribution summary",
    emptyDescription: "ES Run calculation to review payroll deductions and employer contributions.",
    summary: "ES {netSalary} estimated monthly net salary after contributions and tax",
    housingFundDetail: "ES {base} contribution base; housing fund includes employee plus employer portions.",
    waitingTitle: "ES Waiting for calculation",
    waitingDescription: "ES Calculate first to review the housing fund deposit."
  },
  metrics: {
    netSalary: "ES Net salary",
    employeeContribution: "ES Employee contribution",
    employerContribution: "ES Employer contribution",
    individualIncomeTax: "ES Individual income tax"
  },
  review: {
    eyebrow: "ES Review checklist",
    title: "ES Policy notes",
    notes: {
      contributionBase: "ES VitalCalc clamps the contribution base between optional local min and max limits.",
      employee: "ES Employee contributions include pension, medical, unemployment, and housing fund.",
      employer: "ES Work injury and maternity are employer-only in this model; local payroll policy may vary."
    }
  },
  recommendation: {
    title: "ES Policy caveat",
    body: "ES Check local base limits, employer policy, and payroll rules before making a salary decision."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "social-insurance-calculator": {
      ...en.tools["social-insurance-calculator"],
      workspace: localizedWorkspaceCopy
    }
  }
};

const socialInsuranceCalculatorSourceFile =
  "src/app/[locale]/tools/social-insurance-calculator/social-insurance-calculator-workspace.tsx";

function scanSocialInsuranceCalculatorWorkspaceSource() {
  return scanSourceText(readFileSync(socialInsuranceCalculatorSourceFile, "utf8"), socialInsuranceCalculatorSourceFile);
}

describe("SocialInsuranceCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanSocialInsuranceCalculatorWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc social insurance workspace sections", () => {
    renderWithIntl(<SocialInsuranceCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "China Social Insurance Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Salary assumptions")).toBeInTheDocument();
    expect(screen.getByText("Contribution summary")).toBeInTheDocument();
    expect(screen.getByText("Policy notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Monthly pre-tax salary")).toHaveValue(15000);
    expect(screen.getByLabelText("Housing fund rate")).toHaveValue("0.12");
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/social-insurance-calculator/about"
    );
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    render(
      <NextIntlClientProvider locale="es" messages={localizedMessages}>
        <SocialInsuranceCalculatorWorkspace />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("heading", { name: "ES China Social Insurance Calculator" })).toBeInTheDocument();
    expect(screen.getByText("ES Salary assumptions")).toBeInTheDocument();
    expect(screen.getByLabelText("ES Monthly pre-tax salary")).toHaveValue(15000);
    expect(screen.getByRole("button", { name: "ES Calculate contributions" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ES Tool details" })).toHaveAttribute(
      "href",
      "/es/tools/social-insurance-calculator/about"
    );
  });

  it("calculates the default contribution estimate and saves assumptions locally", () => {
    renderWithIntl(<SocialInsuranceCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate contributions" }));

    expect(screen.getByText("¥1.12万")).toBeInTheDocument();
    expect(screen.getByText("¥3,375")).toBeInTheDocument();
    expect(screen.getByText("¥5,670")).toBeInTheDocument();
    expect(screen.getByText("¥453")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save payroll case" }));

    expect(window.localStorage.getItem("toolars.social-insurance-calculator.plan")).toContain("15000");
  });
});
