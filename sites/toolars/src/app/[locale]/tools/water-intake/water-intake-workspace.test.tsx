import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import en from "../../../../../messages/en.json";
import { WaterIntakeWorkspace } from "./water-intake-workspace";

const waterIntakeSourceFile = "src/app/[locale]/tools/water-intake/water-intake-workspace.tsx";

function scanWaterIntakeWorkspaceSource() {
  return scanSourceText(readFileSync(waterIntakeSourceFile, "utf8"), waterIntakeSourceFile);
}

const localizedWorkspaceCopy = {
  eyebrow: "ES VitalCalc health workspace",
  title: "ES Water Intake Calculator",
  subtitle: "ES Calculate a daily hydration target from weight, activity, and climate.",
  modelTitle: "ES Local calculation model",
  detailsLink: "ES Tool details",
  trustRows: {
    local: { label: "ES Local", text: "ES Hydration assumptions stay in this browser session" },
    reference: { label: "ES Reference", text: "ES Water targets change with health status, sweat, and climate" },
    private: { label: "ES Private", text: "ES Save only stores the hydration plan locally" }
  },
  inputSection: {
    title: "ES Hydration inputs",
    description: "ES Use weight, activity multiplier, and climate adjustment from the VitalCalc source page."
  },
  badges: {
    local: "ES Local",
    reference: "ES Reference"
  },
  fields: {
    weight: "ES Weight (kg)",
    activity: "ES Activity level",
    climate: "ES Climate"
  },
  activityOptions: {
    sedentary: "ES Sedentary",
    moderate: "ES Moderate activity",
    active: "ES Active",
    veryActive: "ES Very active",
    custom: "ES Activity {value}"
  },
  climateOptions: {
    temperate: "ES Temperate",
    hot: "ES Hot",
    cold: "ES Cold",
    custom: "ES Custom"
  },
  actions: {
    save: "ES Save hydration plan",
    calculate: "ES Calculate water intake"
  },
  resultSection: {
    title: "ES Hydration result",
    emptyDescription: "ES Run calculation to estimate water target and adjustment split.",
    summary: "ES {weight} kg, {activity}, {climate} climate",
    waitingTitle: "ES Waiting for calculation",
    waitingDescription: "ES Calculate first to get the hydration split.",
    adjustmentDescription: "ES Use urine color, thirst, sweat rate, and clinician guidance to adjust.",
    recommendation: "ES Drink small amounts frequently and adjust for sweat, medication, and clinician guidance."
  },
  metrics: {
    dailyTarget: "ES Daily target",
    cupsValue: "ES {cups} cups",
    cups: "ES 250 ml cups",
    baseNeed: "ES Base need",
    activityExtra: "ES Activity extra",
    climateExtra: "ES Climate extra"
  },
  review: {
    eyebrow: "ES Review checklist",
    title: "ES Hydration notes",
    notes: {
      base: "ES The VitalCalc base uses 35 ml per kg of body weight before adjustments.",
      adjustments: "ES Activity and hot climates increase estimated fluid needs; cold climates reduce the adjustment.",
      medical: "ES Heart, kidney, pregnancy, medication, or endurance contexts need qualified guidance."
    }
  },
  recommendation: {
    title: "ES Local-first",
    body: "ES No account data is required. Hydration results are planning estimates and should be adjusted to real conditions."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "water-intake": {
      ...en.tools["water-intake"],
      workspace: localizedWorkspaceCopy
    }
  }
};

describe("WaterIntakeWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanWaterIntakeWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc water intake workspace sections", () => {
    renderWithIntl(<WaterIntakeWorkspace />);

    expect(screen.getByRole("heading", { name: "Water Intake Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Hydration inputs")).toBeInTheDocument();
    expect(screen.getByText("Hydration result")).toBeInTheDocument();
    expect(screen.getByText("Hydration notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("70")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/water-intake/about"
    );
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    render(
      <NextIntlClientProvider locale="es" messages={localizedMessages}>
        <WaterIntakeWorkspace />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("heading", { name: "ES Water Intake Calculator" })).toBeInTheDocument();
    expect(screen.getByText("ES Hydration inputs")).toBeInTheDocument();
    expect(screen.getByLabelText("ES Weight (kg)")).toHaveValue(70);
    expect(screen.getByRole("button", { name: "ES Calculate water intake" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ES Tool details" })).toHaveAttribute(
      "href",
      "/es/tools/water-intake/about"
    );
  });

  it("calculates water intake and saves the hydration plan locally", () => {
    renderWithIntl(<WaterIntakeWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate water intake" }));

    expect(screen.getByText("4,165 ml")).toBeInTheDocument();
    expect(screen.getByText("17 cups")).toBeInTheDocument();
    expect(screen.getByText("+490 ml")).toBeInTheDocument();
    expect(screen.getByText("+1,225 ml")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save hydration plan" }));

    expect(window.localStorage.getItem("toolars.water-intake.plan")).toContain("70");
  });
});
