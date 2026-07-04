import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { BloodSugarCalculatorWorkspace } from "./blood-sugar-calculator-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "Sentinel blood sugar eyebrow",
  title: "Sentinel Blood Sugar Workspace",
  subtitle: "Sentinel blood sugar subtitle.",
  modelTitle: "Sentinel blood sugar model",
  detailsLink: "Sentinel blood sugar details",
  badges: {
    local: "Sentinel local",
    referenceOnly: "Sentinel reference"
  },
  trustRows: {
    local: {
      label: "Sentinel trust local",
      text: "Sentinel local glucose copy."
    },
    reference: {
      label: "Sentinel trust reference",
      text: "Sentinel reference bands copy."
    },
    private: {
      label: "Sentinel trust private",
      text: "Sentinel private save copy."
    }
  },
  inputSection: {
    title: "Sentinel lab inputs",
    description: "Sentinel input helper copy."
  },
  fields: {
    inputMode: "Sentinel input mode",
    fastingGlucose: "Sentinel fasting glucose",
    fpgUnit: "Sentinel FPG unit",
    a1c: "Sentinel A1C",
    averageGlucose: "Sentinel average glucose",
    eagUnit: "Sentinel eAG unit"
  },
  options: {
    inputMode: {
      fpg: "Sentinel fasting mode",
      a1c: "Sentinel A1C mode",
      eag: "Sentinel average mode"
    },
    units: {
      mmoll: "Sentinel mmol unit",
      mgdl: "Sentinel mgdl unit"
    }
  },
  actions: {
    save: "Sentinel save lab values",
    calculate: "Sentinel convert blood sugar"
  },
  resultSection: {
    title: "Sentinel blood sugar summary",
    emptyDescription: "Sentinel result empty state."
  },
  metrics: {
    fastingGlucose: "Sentinel fasting metric",
    a1c: "Sentinel A1C metric",
    averageGlucose: "Sentinel average metric",
    riskBand: "Sentinel risk metric",
    emptyFastingGlucose: "Sentinel empty fasting",
    emptyA1c: "Sentinel empty A1C",
    emptyAverageGlucose: "Sentinel empty average",
    emptyRiskBand: "Sentinel empty risk"
  },
  callout: {
    waitingTitle: "Sentinel waiting for conversion",
    waitingDescription: "Sentinel convert first copy.",
    calculatedDescription: "Sentinel calculated caveat copy."
  },
  review: {
    eyebrow: "Sentinel review checklist",
    title: "Sentinel blood sugar notes",
    notes: {
      formula: "Sentinel note formula.",
      interpretation: "Sentinel note interpretation.",
      care: "Sentinel note care."
    }
  },
  caveat: {
    title: "Sentinel local-first",
    body: "Sentinel blood sugar caveat."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "blood-sugar-calculator": {
      ...en.tools["blood-sugar-calculator"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="en" messages={localizedMessages}>
      <BloodSugarCalculatorWorkspace />
    </NextIntlClientProvider>
  );
}

describe("BloodSugarCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders visible workspace copy from localized messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.fastingGlucose)).toHaveValue(5.5);
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.caveat.body)).toBeInTheDocument();
  });

  it("renders the local VitalCalc blood sugar workspace sections", () => {
    renderWithIntl(<BloodSugarCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Blood Sugar / A1C Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Lab inputs")).toBeInTheDocument();
    expect(screen.getByText("Blood sugar summary")).toBeInTheDocument();
    expect(screen.getByText("Blood sugar notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Fasting glucose")).toHaveValue(5.5);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/blood-sugar-calculator/about");
  });

  it("converts the default fasting glucose value and saves it locally", () => {
    renderWithIntl(<BloodSugarCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Convert blood sugar" }));

    expect(screen.getByText("5.5 mmol/L")).toBeInTheDocument();
    expect(screen.getByText("5.1%")).toBeInTheDocument();
    expect(screen.getByText("99 mg/dL")).toBeInTheDocument();
    expect(screen.getByText("Normal range")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save lab values" }));

    expect(window.localStorage.getItem("toolars.blood-sugar-calculator.values")).toContain("5.5");
  });
});
