import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { DrinkCaloriesWorkspace } from "./drink-calories-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "ES VitalCalc drink nutrition workspace",
  title: "ES Drink Calories Calculator",
  subtitle: "ES Estimate liquid calories, sugar, steps to burn, and daily calorie percentage.",
  modelTitle: "ES Local calculation model",
  detailsLink: "ES Tool details",
  trustRows: {
    local: { label: "ES Local", text: "ES Drink choices stay in this browser session" },
    nutrition: { label: "ES Nutrition", text: "ES Vendor recipes and portion sizes vary" },
    private: { label: "ES Private", text: "ES Save stores only this drink plan locally" }
  },
  inputSection: {
    title: "ES Drink inputs",
    description: "ES Use source drink references, serving size, and cups today."
  },
  badges: {
    local: "ES Local",
    sugarReference: "ES Sugar reference"
  },
  fields: {
    drinkType: "ES Drink type",
    servingSize: "ES Serving size (ml)",
    cups: "ES Cups drank today",
    customCalories: "ES Custom kcal / 100ml"
  },
  drinkOptions: {
    milktea: "ES Boba Tea (full sugar)",
    "milktea-half": "ES Boba Tea (half sugar)",
    americano: "ES Americano",
    latte: "ES Latte",
    cappuccino: "ES Cappuccino",
    frappuccino: "ES Frappuccino",
    cola: "ES Cola",
    juice: "ES Orange Juice",
    beer: "ES Beer",
    wine: "ES Red Wine",
    vodka: "ES Vodka (neat)",
    soda: "ES Soda Water",
    "green-tea": "ES Green Tea (unsweetened)",
    coconut: "ES Coconut Water",
    custom: "ES Custom"
  },
  actions: {
    save: "ES Save drink plan",
    calculate: "ES Calculate calories"
  },
  resultSection: {
    title: "ES Liquid calorie summary",
    emptyDescription: "ES Run calculation to show today's drink calories and sugar.",
    summary: "ES {calories} from {cups} {cupLabel}",
    waitingTitle: "ES Waiting for calculation",
    waitingDescription: "ES Calculate first to review beverage assumptions.",
    perCupDescription: "ES {drink} - {servingSize}ml x {cups}"
  },
  units: {
    cup: "cup",
    cups: "cups"
  },
  metrics: {
    totalCalories: "ES Total calories",
    sugar: "ES Sugar",
    stepsToBurn: "ES Steps to burn",
    dailyCalories: "ES Daily calories"
  },
  tips: {
    sugarHigh: "ES Sugar exceeds WHO daily recommendation (25g). Consider reducing intake.",
    caloriesHigh: "ES Today's drink calories are high, about {percent}% of daily recommendation.",
    healthy: "ES Calories are within a healthy range. Keep it up!"
  },
  review: {
    eyebrow: "ES Review checklist",
    title: "ES Drink calorie notes",
    notes: {
      references: "ES VitalCalc uses calories and sugar per 100ml from common beverage references.",
      steps: "ES Steps to burn uses the source estimate of about 0.05 kcal per step.",
      who: "ES WHO recommends keeping added sugar around 25g per day; many sweet drinks exceed that alone."
    }
  },
  recommendation: {
    title: "ES Local-first",
    body: "ES Drink plans stay local and can be paired with calorie deficit or glycemic tools."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "drink-calories": {
      ...en.tools["drink-calories"],
      workspace: localizedWorkspaceCopy
    }
  }
};

const drinkCaloriesSourceFile = "src/app/[locale]/tools/drink-calories/drink-calories-workspace.tsx";

function scanDrinkCaloriesWorkspaceSource() {
  return scanSourceText(readFileSync(drinkCaloriesSourceFile, "utf8"), drinkCaloriesSourceFile);
}

describe("DrinkCaloriesWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanDrinkCaloriesWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc drink calories workspace sections", () => {
    renderWithIntl(<DrinkCaloriesWorkspace />);

    expect(screen.getByRole("heading", { name: "Drink Calories Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Drink inputs")).toBeInTheDocument();
    expect(screen.getByText("Liquid calorie summary")).toBeInTheDocument();
    expect(screen.getByText("Drink calorie notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Cups drank today")).toHaveValue(1);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/drink-calories/about");
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    render(
      <NextIntlClientProvider locale="es" messages={localizedMessages}>
        <DrinkCaloriesWorkspace />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("heading", { name: "ES Drink Calories Calculator" })).toBeInTheDocument();
    expect(screen.getByText("ES Drink inputs")).toBeInTheDocument();
    expect(screen.getByLabelText("ES Cups drank today")).toHaveValue(1);
    expect(screen.getByRole("button", { name: "ES Calculate calories" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ES Tool details" })).toHaveAttribute(
      "href",
      "/es/tools/drink-calories/about"
    );
  });

  it("calculates the default drink calories and saves the drink plan locally", () => {
    renderWithIntl(<DrinkCaloriesWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate calories" }));

    expect(screen.getByText("325 kcal")).toBeInTheDocument();
    expect(screen.getByText("50 g")).toBeInTheDocument();
    expect(screen.getByText("6,500")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save drink plan" }));

    expect(window.localStorage.getItem("toolars.drink-calories.plan:v1")).toContain("milktea");
  });
});
