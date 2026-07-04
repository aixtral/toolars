import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { StudentLoanCalculatorWorkspace } from "./student-loan-calculator-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "Sentinel student loan eyebrow",
  title: "Sentinel Student Loan Workspace",
  subtitle: "Sentinel student loan subtitle.",
  modelTitle: "Sentinel student loan model",
  detailsLink: "Sentinel student loan details",
  badges: {
    local: "Sentinel local",
    loan: "Sentinel loan"
  },
  trustRows: {
    local: {
      label: "Sentinel trust local",
      text: "Sentinel loan stays local."
    },
    estimate: {
      label: "Sentinel trust estimate",
      text: "Sentinel estimate copy."
    },
    private: {
      label: "Sentinel trust private",
      text: "Sentinel save copy."
    }
  },
  inputSection: {
    title: "Sentinel repayment inputs",
    description: "Sentinel repayment helper copy."
  },
  fields: {
    loanAmount: "Sentinel loan amount",
    annualInterestRate: "Sentinel annual rate",
    repaymentTermYears: "Sentinel repayment term",
    graceMonths: "Sentinel grace period"
  },
  options: {
    repaymentTermYears: {
      years5: "Sentinel 5 years",
      years10Standard: "Sentinel 10 years",
      years15: "Sentinel 15 years",
      years20: "Sentinel 20 years",
      years25: "Sentinel 25 years"
    },
    graceMonths: {
      none: "Sentinel no grace",
      months6: "Sentinel 6 months",
      months12: "Sentinel 12 months"
    }
  },
  actions: {
    save: "Sentinel save repayment plan",
    calculate: "Sentinel calculate repayment"
  },
  resultSection: {
    title: "Sentinel repayment summary",
    emptyDescription: "Sentinel repayment empty state."
  },
  metrics: {
    monthlyPayment: "Sentinel monthly payment",
    totalInterest: "Sentinel total interest",
    totalRepayment: "Sentinel total repayment",
    yearOneEndingBalance: "Sentinel year one balance",
    emptyCurrency: "Sentinel empty currency"
  },
  callout: {
    waitingTitle: "Sentinel waiting for calculation",
    waitingDescription: "Sentinel calculate first copy.",
    calculatedDescription: "Sentinel principal {annualPrincipal} plus interest {annualInterest}."
  },
  review: {
    eyebrow: "Sentinel review checklist",
    title: "Sentinel repayment notes",
    notes: {
      formula: "Sentinel formula note.",
      grace: "Sentinel grace note.",
      alternatives: "Sentinel alternatives note."
    }
  },
  caveat: {
    title: "Sentinel loan caveat",
    body: "Sentinel student loan caveat."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "student-loan-calculator": {
      ...en.tools["student-loan-calculator"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="en" messages={localizedMessages}>
      <StudentLoanCalculatorWorkspace />
    </NextIntlClientProvider>
  );
}

describe("StudentLoanCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders visible workspace copy from localized messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.loanAmount)).toHaveValue(50000);
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.caveat.body)).toBeInTheDocument();
  });

  it("renders the local VitalCalc student loan workspace sections", () => {
    renderWithIntl(<StudentLoanCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Student Loan Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Repayment inputs")).toBeInTheDocument();
    expect(screen.getByText("Repayment summary")).toBeInTheDocument();
    expect(screen.getByText("Repayment notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Loan amount")).toHaveValue(50000);
    expect(screen.getByLabelText("Grace period")).toHaveValue("6");
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/student-loan-calculator/about"
    );
  });

  it("calculates the default student loan repayment plan and saves assumptions locally", () => {
    renderWithIntl(<StudentLoanCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate repayment plan" }));

    expect(screen.getByText("$543")).toBeInTheDocument();
    expect(screen.getByText("$15,116")).toBeInTheDocument();
    expect(screen.getByText("$65,116")).toBeInTheDocument();
    expect(screen.getByText("Repayment starts after 6 months grace period")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save repayment plan" }));

    expect(window.localStorage.getItem("toolars.student-loan-calculator.plan")).toContain("50000");
  });
});
