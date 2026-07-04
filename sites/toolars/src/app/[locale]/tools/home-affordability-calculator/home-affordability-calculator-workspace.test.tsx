import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { HomeAffordabilityCalculatorWorkspace } from "./home-affordability-calculator-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "Sentinel affordability eyebrow",
  title: "Sentinel Home Affordability Workspace",
  subtitle: "Sentinel affordability subtitle.",
  modelTitle: "Sentinel affordability model",
  detailsLink: "Sentinel affordability details",
  badges: {
    local: "Sentinel local",
    housing: "Sentinel housing"
  },
  trustRows: {
    local: {
      label: "Sentinel trust local",
      text: "Sentinel income stays local."
    },
    scenario: {
      label: "Sentinel trust scenario",
      text: "Sentinel scenario math copy."
    },
    private: {
      label: "Sentinel trust private",
      text: "Sentinel save copy."
    }
  },
  inputSection: {
    title: "Sentinel affordability inputs",
    description: "Sentinel input helper copy."
  },
  fields: {
    monthlyHouseholdIncome: "Sentinel monthly income",
    existingMonthlyDebt: "Sentinel monthly debt",
    downPaymentRatio: "Sentinel down payment",
    annualInterestRate: "Sentinel mortgage rate",
    loanTermYears: "Sentinel loan term",
    dtiLimit: "Sentinel DTI limit"
  },
  options: {
    downPaymentRatio: {
      percent15: "Sentinel 15 percent",
      percent20: "Sentinel 20 percent",
      percent30Recommended: "Sentinel 30 percent",
      percent40: "Sentinel 40 percent",
      percent50: "Sentinel 50 percent"
    },
    loanTermYears: {
      years20: "Sentinel 20 years",
      years25: "Sentinel 25 years",
      years30: "Sentinel 30 years"
    },
    dtiLimit: {
      conservative28: "Sentinel conservative",
      moderate35: "Sentinel moderate",
      flexible40: "Sentinel flexible"
    }
  },
  actions: {
    save: "Sentinel save affordability case",
    calculate: "Sentinel calculate affordability"
  },
  resultSection: {
    title: "Sentinel affordability summary",
    emptyDescription: "Sentinel result empty state."
  },
  metrics: {
    maxAffordablePrice: "Sentinel max price",
    monthlyPaymentCeiling: "Sentinel payment ceiling",
    loanAmount: "Sentinel loan amount",
    totalDtiRatio: "Sentinel total DTI",
    emptyCurrency: "Sentinel empty currency",
    emptyDti: "Sentinel empty DTI"
  },
  callout: {
    waitingTitle: "Sentinel waiting for calculation",
    waitingDescription: "Sentinel calculate first copy.",
    calculatedDescription: "{downPayment} sentinel down payment. {guidance}"
  },
  review: {
    eyebrow: "Sentinel review checklist",
    title: "Sentinel mortgage notes",
    notes: {
      formula: "Sentinel formula note.",
      rule: "Sentinel lender rule note.",
      costs: "Sentinel housing costs note."
    }
  },
  caveat: {
    title: "Sentinel housing caveat",
    body: "Sentinel affordability caveat."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "home-affordability-calculator": {
      ...en.tools["home-affordability-calculator"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="en" messages={localizedMessages}>
      <HomeAffordabilityCalculatorWorkspace />
    </NextIntlClientProvider>
  );
}

describe("HomeAffordabilityCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders visible workspace copy from localized messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.monthlyHouseholdIncome)).toHaveValue(20000);
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.caveat.body)).toBeInTheDocument();
  });

  it("renders the local VitalCalc home affordability workspace sections", () => {
    renderWithIntl(<HomeAffordabilityCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Home Affordability Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Affordability inputs")).toBeInTheDocument();
    expect(screen.getByText("Affordability summary")).toBeInTheDocument();
    expect(screen.getByText("Mortgage readiness notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Monthly household income")).toHaveValue(20000);
    expect(screen.getByLabelText("Debt-to-income limit")).toHaveValue("0.35");
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/home-affordability-calculator/about"
    );
  });

  it("calculates the default affordability estimate and saves assumptions locally", () => {
    renderWithIntl(<HomeAffordabilityCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate affordability" }));

    expect(screen.getByText("¥214.6万")).toBeInTheDocument();
    expect(screen.getByText("¥7,000")).toBeInTheDocument();
    expect(screen.getByText("35.0%")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save affordability case" }));

    expect(window.localStorage.getItem("toolars.home-affordability-calculator.plan")).toContain("20000");
  });
});
