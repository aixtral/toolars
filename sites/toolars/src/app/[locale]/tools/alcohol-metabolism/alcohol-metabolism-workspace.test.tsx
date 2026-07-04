import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { AlcoholMetabolismWorkspace } from "./alcohol-metabolism-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "Sentinel alcohol safety eyebrow",
  title: "Sentinel Alcohol Metabolism Workspace",
  subtitle: "Sentinel alcohol metabolism subtitle.",
  modelTitle: "Sentinel alcohol model",
  detailsLink: "Sentinel alcohol details",
  badges: {
    local: "Sentinel local",
    safety: "Sentinel safety"
  },
  trustRows: {
    local: {
      label: "Sentinel trust local",
      text: "Sentinel drink assumptions stay local."
    },
    safety: {
      label: "Sentinel trust safety",
      text: "Sentinel driving warning copy."
    },
    private: {
      label: "Sentinel trust private",
      text: "Sentinel alcohol save copy."
    }
  },
  inputSection: {
    title: "Sentinel drink inputs",
    description: "Sentinel drink input helper copy."
  },
  fields: {
    sex: "Sentinel sex",
    weightKg: "Sentinel weight",
    drinkType: "Sentinel drink type",
    quantity: "Sentinel number of drinks",
    durationHours: "Sentinel drinking duration",
    stomach: "Sentinel stomach state"
  },
  options: {
    sex: {
      male: "Sentinel male",
      female: "Sentinel female"
    },
    drinkType: {
      beer: "Sentinel beer",
      wine: "Sentinel wine",
      spirits: "Sentinel spirits",
      cocktail: "Sentinel cocktail"
    },
    stomach: {
      ate: "Sentinel ate before drinking",
      empty: "Sentinel empty stomach"
    }
  },
  actions: {
    save: "Sentinel save alcohol scenario",
    calculate: "Sentinel calculate alcohol metabolism"
  },
  resultSection: {
    title: "Sentinel BAC summary",
    emptyDescription: "Sentinel BAC empty state."
  },
  metrics: {
    estimatedBac: "Sentinel estimated BAC",
    pureAlcohol: "Sentinel pure alcohol",
    timeTo002: "Sentinel time to 0.02%",
    fullySober: "Sentinel fully sober",
    emptyBac: "Sentinel empty BAC",
    emptyGrams: "Sentinel empty grams",
    emptyHours: "Sentinel empty hours"
  },
  callout: {
    waitingTitle: "Sentinel waiting for alcohol calculation",
    waitingDescription: "Sentinel calculate alcohol first copy.",
    calculatedDescription: "Sentinel alcohol education caveat."
  },
  review: {
    eyebrow: "Sentinel review checklist",
    title: "Sentinel safety notes",
    notes: {
      model: "Sentinel Widmark note.",
      variability: "Sentinel variability note.",
      legal: "Sentinel legal note."
    }
  },
  caveat: {
    title: "Sentinel local-first",
    body: "Sentinel alcohol caveat."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "alcohol-metabolism": {
      ...en.tools["alcohol-metabolism"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      <AlcoholMetabolismWorkspace />
    </NextIntlClientProvider>
  );
}

describe("AlcoholMetabolismWorkspace", () => {
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
    expect(screen.getByRole("link", { name: localizedWorkspaceCopy.detailsLink })).toHaveAttribute("href", "/es/tools/alcohol-metabolism/about");
    expect(screen.getByText(localizedWorkspaceCopy.caveat.body)).toBeInTheDocument();
  });

  it("renders the local VitalCalc alcohol metabolism workspace sections", () => {
    renderWithIntl(<AlcoholMetabolismWorkspace />);

    expect(screen.getByRole("heading", { name: "Alcohol Metabolism Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Drink inputs")).toBeInTheDocument();
    expect(screen.getByText("BAC summary")).toBeInTheDocument();
    expect(screen.getByText("Safety notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Weight (kg)")).toHaveValue(70);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/alcohol-metabolism/about");
  });

  it("calculates alcohol metabolism and saves the scenario locally", () => {
    renderWithIntl(<AlcoholMetabolismWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate alcohol metabolism" }));

    expect(screen.getByText("103.962%")).toBeInTheDocument();
    expect(screen.getByText("49.5 g")).toBeInTheDocument();
    expect(screen.getByText("6,930 hours")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save alcohol scenario" }));

    expect(window.localStorage.getItem("toolars.alcohol-metabolism.scenario:v1")).toContain("beer");
  });
});
