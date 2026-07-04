import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { TestosteroneCalculatorWorkspace } from "./testosterone-calculator-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "Sentinel lab eyebrow",
  title: "Sentinel Testosterone Workspace",
  subtitle: "Sentinel testosterone subtitle.",
  modelTitle: "Sentinel testosterone model",
  detailsLink: "Sentinel testosterone details",
  badges: {
    local: "Sentinel local",
    referenceOnly: "Sentinel reference only"
  },
  trustRows: {
    local: {
      label: "Sentinel trust local",
      text: "Sentinel lab values stay local."
    },
    medical: {
      label: "Sentinel trust medical",
      text: "Sentinel clinician context copy."
    },
    private: {
      label: "Sentinel trust private",
      text: "Sentinel saved lab copy."
    }
  },
  inputSection: {
    title: "Sentinel lab inputs",
    description: "Sentinel lab helper copy."
  },
  fields: {
    totalTestosterone: "Sentinel total testosterone",
    totalUnit: "Sentinel total unit",
    shbg: "Sentinel SHBG",
    shbgUnit: "Sentinel SHBG unit",
    albumin: "Sentinel albumin",
    albuminUnit: "Sentinel albumin unit",
    sex: "Sentinel sex"
  },
  options: {
    totalUnit: {
      ngdl: "Sentinel ng/dL",
      nmoll: "Sentinel nmol/L"
    },
    shbgUnit: {
      nmoll: "Sentinel SHBG nmol/L",
      ngdl: "Sentinel SHBG ng/dL"
    },
    albuminUnit: {
      gdl: "Sentinel g/dL",
      gl: "Sentinel g/L"
    },
    sex: {
      male: "Sentinel male",
      female: "Sentinel female"
    }
  },
  actions: {
    save: "Sentinel save lab values",
    calculate: "Sentinel calculate testosterone"
  },
  resultSection: {
    title: "Sentinel hormone result",
    emptyDescription: "Sentinel hormone empty state."
  },
  metrics: {
    freeTestosterone: "Sentinel free testosterone",
    bioavailableTestosterone: "Sentinel bioavailable T",
    freePercent: "Sentinel free T percent",
    referenceStatus: "Sentinel reference status",
    emptyFreeTestosterone: "Sentinel empty free T",
    emptyBioavailableTestosterone: "Sentinel empty bioavailable T",
    emptyFreePercent: "Sentinel empty percent",
    emptyStatus: "Sentinel empty status"
  },
  callout: {
    waitingTitle: "Sentinel waiting for testosterone calculation",
    waitingDescription: "Sentinel calculate first reference copy.",
    calculatedDescription: "Sentinel reference range: {referenceRange}"
  },
  review: {
    eyebrow: "Sentinel review checklist",
    title: "Sentinel clinical notes",
    notes: {
      conversion: "Sentinel note conversion.",
      estimate: "Sentinel note estimate.",
      diagnosis: "Sentinel note diagnosis."
    }
  },
  caveat: {
    title: "Sentinel local-first",
    body: "Sentinel hormone caveat."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "testosterone-calculator": {
      ...en.tools["testosterone-calculator"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      <TestosteroneCalculatorWorkspace />
    </NextIntlClientProvider>
  );
}

describe("TestosteroneCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders visible workspace copy from localized messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.totalTestosterone)).toHaveValue(500);
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: localizedWorkspaceCopy.detailsLink })).toHaveAttribute("href", "/es/tools/testosterone-calculator/about");
    expect(screen.getByText(localizedWorkspaceCopy.caveat.body)).toBeInTheDocument();
  });

  it("renders the local VitalCalc testosterone workspace sections", () => {
    renderWithIntl(<TestosteroneCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Testosterone Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Lab inputs")).toBeInTheDocument();
    expect(screen.getByText("Hormone result")).toBeInTheDocument();
    expect(screen.getByText("Clinical notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Total testosterone")).toHaveValue(500);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/testosterone-calculator/about");
  });

  it("calculates the source estimate and saves lab values locally", () => {
    renderWithIntl(<TestosteroneCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate testosterone" }));

    expect(screen.getByText("0.0 ng/dL")).toBeInTheDocument();
    expect(screen.getByText("150.0 ng/dL")).toBeInTheDocument();
    expect(screen.getByText("Low")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save lab values" }));

    expect(window.localStorage.getItem("toolars.testosterone-calculator.lab:v1")).toContain("\"totalTestosterone\":500");
  });
});
