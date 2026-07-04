import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { Glp1NutritionWorkspace } from "./glp1-nutrition-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "Sentinel GLP-1 nutrition eyebrow",
  title: "Sentinel GLP-1 Nutrition Workspace",
  subtitle: "Sentinel GLP-1 nutrition subtitle.",
  modelTitle: "Sentinel nutrition model",
  detailsLink: "Sentinel nutrition details",
  badges: {
    local: "Sentinel local",
    medical: "Sentinel medical"
  },
  trustRows: {
    local: {
      label: "Sentinel trust local",
      text: "Sentinel nutrition context stays local."
    },
    medical: {
      label: "Sentinel trust medical",
      text: "Sentinel clinician adjustment copy."
    },
    private: {
      label: "Sentinel trust private",
      text: "Sentinel nutrition save copy."
    }
  },
  inputSection: {
    title: "Sentinel nutrition inputs",
    description: "Sentinel nutrition helper copy."
  },
  fields: {
    weightKg: "Sentinel weight",
    heightCm: "Sentinel height",
    age: "Sentinel age",
    sex: "Sentinel sex",
    medication: "Sentinel GLP-1 medication",
    activityFactor: "Sentinel activity level"
  },
  options: {
    sex: {
      male: "Sentinel male",
      female: "Sentinel female"
    },
    medication: {
      semaglutide: "Sentinel semaglutide",
      tirzepatide: "Sentinel tirzepatide",
      liraglutide: "Sentinel liraglutide",
      dulaglutide: "Sentinel dulaglutide",
      other: "Sentinel other GLP-1"
    },
    activityFactor: {
      sedentary: "Sentinel sedentary",
      light: "Sentinel light",
      moderate: "Sentinel moderate",
      veryActive: "Sentinel very active"
    }
  },
  actions: {
    save: "Sentinel save nutrition plan",
    calculate: "Sentinel calculate nutrition targets"
  },
  resultSection: {
    title: "Sentinel nutrition targets",
    emptyDescription: "Sentinel nutrition empty state."
  },
  metrics: {
    calorieFloor: "Sentinel calorie floor",
    protein: "Sentinel protein",
    hydration: "Sentinel hydration",
    fiber: "Sentinel fiber",
    bmr: "Sentinel BMR",
    medication: "Sentinel medication row",
    activity: "Sentinel activity row",
    emptyKcal: "Sentinel empty kcal",
    emptyGrams: "Sentinel empty grams",
    emptyWater: "Sentinel empty water"
  },
  callout: {
    waitingTitle: "Sentinel waiting for nutrition calculation",
    waitingDescription: "Sentinel calculate nutrition first copy.",
    calculatedTitle: "Sentinel clinician-supervised floor.",
    calculatedDescription: "Sentinel GLP-1 escalation copy."
  },
  review: {
    eyebrow: "Sentinel review checklist",
    title: "Sentinel medication notes",
    notes: {
      model: "Sentinel nutrition model note.",
      protein: "Sentinel protein and water note.",
      supervision: "Sentinel supervision note."
    }
  },
  caveat: {
    title: "Sentinel local-first",
    body: "Sentinel nutrition caveat."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "glp1-nutrition": {
      ...en.tools["glp1-nutrition"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      <Glp1NutritionWorkspace />
    </NextIntlClientProvider>
  );
}

describe("Glp1NutritionWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders visible workspace copy from localized messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.weightKg)).toHaveValue(70);
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: localizedWorkspaceCopy.detailsLink })).toHaveAttribute("href", "/es/tools/glp1-nutrition/about");
    expect(screen.getByText(localizedWorkspaceCopy.caveat.body)).toBeInTheDocument();
  });

  it("renders the local VitalCalc GLP-1 nutrition workspace sections", () => {
    renderWithIntl(<Glp1NutritionWorkspace />);

    expect(screen.getByRole("heading", { name: "GLP-1 Nutrition Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Nutrition inputs")).toBeInTheDocument();
    expect(screen.getByText("Nutrition targets")).toBeInTheDocument();
    expect(screen.getByText("Medication notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Weight (kg)")).toHaveValue(70);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/glp1-nutrition/about");
  });

  it("calculates targets and saves the local nutrition plan", () => {
    renderWithIntl(<Glp1NutritionWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate nutrition targets" }));

    expect(screen.getByText("1,642 kcal")).toBeInTheDocument();
    expect(screen.getByText("98 g")).toBeInTheDocument();
    expect(screen.getByText("2,450 ml")).toBeInTheDocument();
    expect(screen.getByText("25 g")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save nutrition plan" }));

    expect(window.localStorage.getItem("toolars.glp1-nutrition.plan:v1")).toContain("\"weightKg\":70");
  });
});
