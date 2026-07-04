import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { BiologicalAgeWorkspace } from "./biological-age-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "Sentinel biological age eyebrow",
  title: "Sentinel Biological Age Workspace",
  subtitle: "Sentinel biological age subtitle.",
  modelTitle: "Sentinel biological age model",
  detailsLink: "Sentinel biological age details",
  badges: {
    local: "Sentinel local",
    referenceOnly: "Sentinel reference",
    tip: "Sentinel tip"
  },
  trustRows: {
    local: {
      label: "Sentinel trust local",
      text: "Sentinel local storage copy."
    },
    reference: {
      label: "Sentinel trust reference",
      text: "Sentinel reference model copy."
    },
    private: {
      label: "Sentinel trust private",
      text: "Sentinel private save copy."
    }
  },
  inputSection: {
    title: "Sentinel lifestyle inputs",
    description: "Sentinel input helper copy."
  },
  fields: {
    chronologicalAge: "Sentinel chronological age",
    bmi: "Sentinel BMI",
    systolicBp: "Sentinel systolic BP",
    exerciseDays: "Sentinel exercise days",
    sleepHours: "Sentinel sleep hours",
    smoking: "Sentinel smoking",
    alcohol: "Sentinel alcohol",
    stress: "Sentinel stress"
  },
  options: {
    smoking: {
      no: "Sentinel no",
      former: "Sentinel former",
      yes: "Sentinel yes"
    },
    alcohol: {
      never: "Sentinel never",
      rare: "Sentinel rarely",
      weekly: "Sentinel weekly",
      daily: "Sentinel daily"
    },
    stress: {
      low: "Sentinel low",
      moderate: "Sentinel moderate",
      high: "Sentinel high"
    }
  },
  actions: {
    save: "Sentinel save lifestyle sample",
    calculate: "Sentinel calculate biological age"
  },
  resultSection: {
    title: "Sentinel biological age result",
    emptyDescription: "Sentinel result empty state."
  },
  metrics: {
    biologicalAge: "Sentinel biological age metric",
    ageDifference: "Sentinel age difference metric",
    lifestyleDelta: "Sentinel lifestyle delta metric",
    status: "Sentinel status metric",
    emptyYears: "Sentinel empty years",
    emptyDifference: "Sentinel empty difference",
    emptyDelta: "Sentinel empty delta",
    emptyStatus: "Sentinel empty status"
  },
  callout: {
    waitingTitle: "Sentinel waiting for calculation",
    waitingDescription: "Sentinel calculate first copy.",
    calculatedDescription: "Sentinel calculated caveat copy."
  },
  review: {
    eyebrow: "Sentinel review checklist",
    title: "Sentinel lifestyle notes",
    notes: {
      model: "Sentinel note model.",
      factors: "Sentinel note factors.",
      biomarkers: "Sentinel note biomarkers."
    }
  },
  caveat: {
    title: "Sentinel local-first",
    body: "Sentinel biological age caveat."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "biological-age": {
      ...en.tools["biological-age"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="en" messages={localizedMessages}>
      <BiologicalAgeWorkspace />
    </NextIntlClientProvider>
  );
}

describe("BiologicalAgeWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders visible workspace copy from localized messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.chronologicalAge)).toHaveValue(35);
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.caveat.body)).toBeInTheDocument();
  });

  it("renders the local VitalCalc biological age workspace sections", () => {
    renderWithIntl(<BiologicalAgeWorkspace />);

    expect(screen.getByRole("heading", { name: "Biological Age Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Lifestyle inputs")).toBeInTheDocument();
    expect(screen.getByText("Biological age result")).toBeInTheDocument();
    expect(screen.getByText("Lifestyle notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Chronological age")).toHaveValue(35);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/biological-age/about");
  });

  it("calculates biological age and saves the lifestyle sample locally", () => {
    renderWithIntl(<BiologicalAgeWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate biological age" }));

    expect(screen.getByText("31 years")).toBeInTheDocument();
    expect(screen.getByText("4 years younger")).toBeInTheDocument();
    expect(screen.getByText("Keep up your healthy lifestyle!")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save lifestyle sample" }));

    expect(window.localStorage.getItem("toolars.biological-age.sample:v1")).toContain("\"chronologicalAge\":35");
  });
});
