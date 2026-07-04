import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { MortgageRefinanceCalculatorWorkspace } from "./mortgage-refinance-calculator-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "Sentinel refinance eyebrow",
  title: "Sentinel Mortgage Refinance Workspace",
  subtitle: "Sentinel refinance subtitle.",
  modelTitle: "Sentinel refinance model",
  detailsLink: "Sentinel refinance details",
  badges: {
    local: "Sentinel local",
    refi: "Sentinel refi"
  },
  trustRows: {
    local: {
      label: "Sentinel trust local",
      text: "Sentinel loan inputs stay local."
    },
    scenario: {
      label: "Sentinel trust scenario",
      text: "Sentinel break-even assumption."
    },
    private: {
      label: "Sentinel trust private",
      text: "Sentinel saved case copy."
    }
  },
  inputSection: {
    title: "Sentinel refinance inputs",
    description: "Sentinel refinance input helper copy."
  },
  fields: {
    currentBalance: "Sentinel current loan balance",
    currentAnnualInterestRate: "Sentinel current interest rate",
    currentRemainingYears: "Sentinel remaining term",
    newAnnualInterestRate: "Sentinel new interest rate",
    newLoanTermYears: "Sentinel new loan term",
    refinancingCost: "Sentinel refinancing costs"
  },
  termOptions: {
    years5: "Sentinel 5 years",
    years10: "Sentinel 10 years",
    years15: "Sentinel 15 years",
    years20: "Sentinel 20 years",
    years25: "Sentinel 25 years",
    years30: "Sentinel 30 years"
  },
  actions: {
    save: "Sentinel save refinance case",
    calculate: "Sentinel calculate refinance savings"
  },
  resultSection: {
    title: "Sentinel refinance summary",
    emptyDescription: "Sentinel refinance empty state."
  },
  metrics: {
    monthlySavings: "Sentinel monthly savings",
    oldPayment: "Sentinel old payment",
    newPayment: "Sentinel new payment",
    breakEven: "Sentinel break-even",
    emptyCurrency: "Sentinel empty currency",
    emptyBreakEven: "Sentinel empty break-even"
  },
  callout: {
    waitingTitle: "Sentinel waiting for refinance calculation",
    waitingDescription: "Sentinel calculate first refinance copy.",
    calculatedDescription: "Sentinel current interest {oldInterest}; new interest {newInterest}."
  },
  review: {
    eyebrow: "Sentinel review checklist",
    title: "Sentinel refinance notes",
    notes: {
      comparison: "Sentinel note comparison.",
      interest: "Sentinel note interest.",
      caveats: "Sentinel note caveats."
    }
  },
  caveat: {
    title: "Sentinel refinance caveat",
    body: "Sentinel lender comparison caveat."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "mortgage-refinance-calculator": {
      ...en.tools["mortgage-refinance-calculator"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="en" messages={localizedMessages}>
      <MortgageRefinanceCalculatorWorkspace />
    </NextIntlClientProvider>
  );
}

describe("MortgageRefinanceCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders visible workspace copy from localized messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.currentBalance)).toHaveValue(800000);
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.caveat.body)).toBeInTheDocument();
  });

  it("renders the local VitalCalc mortgage refinance workspace sections", () => {
    renderWithIntl(<MortgageRefinanceCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Mortgage Refinance Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Refinance inputs")).toBeInTheDocument();
    expect(screen.getByText("Refinance summary")).toBeInTheDocument();
    expect(screen.getByText("Refinance notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Current loan balance")).toHaveValue(800000);
    expect(screen.getByLabelText("New interest rate")).toHaveValue(3.5);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/mortgage-refinance-calculator/about"
    );
  });

  it("calculates default refinance savings and saves assumptions locally", () => {
    renderWithIntl(<MortgageRefinanceCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate refinance savings" }));

    expect(screen.getByText("$461")).toBeInTheDocument();
    expect(screen.getByText("44 months")).toBeInTheDocument();
    expect(screen.getByText("$146,005")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save refinance case" }));

    expect(window.localStorage.getItem("toolars.mortgage-refinance-calculator.plan")).toContain("800000");
  });
});
