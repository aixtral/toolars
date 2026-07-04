import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { ChildGrowthWorkspace } from "./child-growth-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "Sentinel child growth eyebrow",
  title: "Sentinel Child Growth Workspace",
  subtitle: "Sentinel child growth subtitle.",
  modelTitle: "Sentinel child growth model",
  detailsLink: "Sentinel child growth details",
  badges: {
    local: "Sentinel local",
    referenceOnly: "Sentinel reference"
  },
  trustRows: {
    local: {
      label: "Sentinel trust local",
      text: "Sentinel local growth copy."
    },
    reference: {
      label: "Sentinel trust reference",
      text: "Sentinel pediatric context copy."
    },
    private: {
      label: "Sentinel trust private",
      text: "Sentinel private profile copy."
    }
  },
  inputSection: {
    title: "Sentinel growth inputs",
    description: "Sentinel input helper copy."
  },
  fields: {
    sex: "Sentinel sex",
    ageYears: "Sentinel age years",
    ageMonths: "Sentinel age months",
    heightCm: "Sentinel height",
    weightKg: "Sentinel weight"
  },
  options: {
    sex: {
      boy: "Sentinel boy",
      girl: "Sentinel girl"
    },
    ageMonths: {
      zero: "Sentinel 0 months",
      three: "Sentinel 3 months",
      six: "Sentinel 6 months",
      nine: "Sentinel 9 months"
    }
  },
  actions: {
    save: "Sentinel save growth profile",
    calculate: "Sentinel assess growth curve"
  },
  resultSection: {
    title: "Sentinel growth summary",
    emptyDescription: "Sentinel result empty state."
  },
  metrics: {
    bmiPercentile: "Sentinel percentile metric",
    bmi: "Sentinel BMI metric",
    category: "Sentinel category metric",
    referenceWeightRange: "Sentinel reference range metric",
    emptyPercentile: "Sentinel empty percentile",
    emptyBmi: "Sentinel empty BMI",
    emptyCategory: "Sentinel empty category",
    emptyWeightRange: "Sentinel empty range"
  },
  callout: {
    waitingTitle: "Sentinel waiting for calculation",
    waitingDescription: "Sentinel calculate first copy.",
    calculatedDescription: "Sentinel percentile context copy."
  },
  review: {
    eyebrow: "Sentinel review checklist",
    title: "Sentinel growth notes",
    notes: {
      bmi: "Sentinel note BMI.",
      trend: "Sentinel note trend.",
      context: "Sentinel note context."
    }
  },
  caveat: {
    title: "Sentinel local-first",
    body: "Sentinel child growth caveat."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "child-growth": {
      ...en.tools["child-growth"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      <ChildGrowthWorkspace />
    </NextIntlClientProvider>
  );
}

describe("ChildGrowthWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders visible workspace copy from localized messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.ageYears)).toHaveValue(8);
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: localizedWorkspaceCopy.detailsLink })).toHaveAttribute("href", "/es/tools/child-growth/about");
    expect(screen.getByText(localizedWorkspaceCopy.caveat.body)).toBeInTheDocument();
  });

  it("renders the local VitalCalc child growth workspace sections", () => {
    renderWithIntl(<ChildGrowthWorkspace />);

    expect(screen.getByRole("heading", { name: "Child BMI Growth Chart" })).toBeInTheDocument();
    expect(screen.getByText("Growth inputs")).toBeInTheDocument();
    expect(screen.getByText("Growth summary")).toBeInTheDocument();
    expect(screen.getByText("Growth notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Age years")).toHaveValue(8);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/child-growth/about");
  });

  it("assesses the default growth profile and saves it locally", () => {
    renderWithIntl(<ChildGrowthWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Assess growth curve" }));

    expect(screen.getByText("12.8th")).toBeInTheDocument();
    expect(screen.getByText("16.6")).toBeInTheDocument();
    expect(screen.getByText("Healthy")).toBeInTheDocument();
    expect(screen.getByText("28.9-37.5 kg")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save growth profile" }));

    expect(window.localStorage.getItem("toolars.child-growth.profile")).toContain("125");
  });
});
