import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { FreelanceRateWorkspace } from "./freelance-rate-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "Sentinel rate-floor eyebrow",
  title: "Sentinel Freelance Rate Workspace",
  subtitle: "Sentinel freelance rate subtitle.",
  modelTitle: "Sentinel freelance model",
  detailsLink: "Sentinel freelance details",
  badges: {
    local: "Sentinel local",
    rate: "Sentinel rate"
  },
  trustRows: {
    local: {
      label: "Sentinel trust local",
      text: "Sentinel income inputs stay local."
    },
    pricing: {
      label: "Sentinel trust pricing",
      text: "Sentinel rate output caveat."
    },
    private: {
      label: "Sentinel trust private",
      text: "Sentinel saved plan copy."
    }
  },
  inputSection: {
    title: "Sentinel rate inputs",
    description: "Sentinel rate input helper copy."
  },
  fields: {
    goalIncome: "Sentinel target annual income",
    vacationDays: "Sentinel paid vacation days",
    weeklyWorkHours: "Sentinel weekly work hours",
    nonBillableRatio: "Sentinel non-billable time",
    taxRate: "Sentinel combined tax rate",
    insuranceCost: "Sentinel insurance annual cost",
    operatingCost: "Sentinel operating cost",
    locationFactor: "Sentinel location factor"
  },
  options: {
    nonBillable: {
      stable: "Sentinel 20% stable",
      normal: "Sentinel 30% normal",
      heavy: "Sentinel 40% heavy",
      transition: "Sentinel 50% transition"
    },
    locationFactor: {
      remote: "Sentinel remote 1.0x",
      tier2: "Sentinel tier 2 1.2x",
      tier1: "Sentinel tier 1 1.4x",
      intl: "Sentinel intl 1.8x"
    }
  },
  actions: {
    save: "Sentinel save rate plan",
    calculate: "Sentinel calculate rate floor"
  },
  resultSection: {
    title: "Sentinel rate floor summary",
    emptyDescription: "Sentinel rate empty state."
  },
  metrics: {
    hourlyRate: "Sentinel hourly rate",
    dailyRate: "Sentinel daily rate",
    projectRate: "Sentinel project rate",
    premiumRate: "Sentinel premium rate",
    emptyCurrency: "Sentinel empty currency"
  },
  callout: {
    waitingTitle: "Sentinel waiting for rate calculation",
    waitingDescription: "Sentinel calculate first utilization copy.",
    calculatedDescription: "Sentinel {nonBillableHours} non-billable from {totalWorkHours} total work time."
  },
  review: {
    eyebrow: "Sentinel review checklist",
    title: "Sentinel pricing notes",
    notes: {
      billable: "Sentinel note billable.",
      revenue: "Sentinel note revenue.",
      project: "Sentinel note project."
    }
  },
  caveat: {
    title: "Sentinel pricing caveat",
    body: "Sentinel freelance pricing caveat."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "freelance-rate": {
      ...en.tools["freelance-rate"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="en" messages={localizedMessages}>
      <FreelanceRateWorkspace />
    </NextIntlClientProvider>
  );
}

describe("FreelanceRateWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders visible workspace copy from localized messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.goalIncome)).toHaveValue(200000);
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.caveat.body)).toBeInTheDocument();
  });

  it("renders the local VitalCalc freelance rate workspace sections", () => {
    renderWithIntl(<FreelanceRateWorkspace />);

    expect(screen.getByRole("heading", { name: "Freelance Rate Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Rate inputs")).toBeInTheDocument();
    expect(screen.getByText("Rate floor summary")).toBeInTheDocument();
    expect(screen.getByText("Pricing notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Target annual income")).toHaveValue(200000);
    expect(screen.getByLabelText("Non-billable time")).toHaveValue("0.3");
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/freelance-rate/about"
    );
  });

  it("calculates the default rate floor and saves assumptions locally", () => {
    renderWithIntl(<FreelanceRateWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate rate floor" }));

    expect(screen.getByText("¥241")).toBeInTheDocument();
    expect(screen.getByText("¥1,928")).toBeInTheDocument();
    expect(screen.getByText("¥9,640")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save rate plan" }));

    expect(window.localStorage.getItem("toolars.freelance-rate.plan")).toContain("200000");
  });
});
