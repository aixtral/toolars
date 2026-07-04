import fs from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { TdeeCalculatorWorkspace } from "./tdee-calculator-workspace";

const workspacePath = "src/app/[locale]/tools/tdee-calculator/tdee-calculator-workspace.tsx";

const localizedWorkspaceCopy = {
  eyebrow: "ES VitalCalc health workspace",
  title: "ES TDEE Calculator",
  subtitle: "ES Calculate total daily energy expenditure from BMR and activity level.",
  modelTitle: "ES Local calculation model",
  detailsLink: "ES Tool details",
  trustRows: {
    local: { label: "ES Local", text: "ES BMR and activity assumptions stay in this browser session" },
    reference: { label: "ES Reference", text: "ES TDEE is a planning baseline, not a metabolic measurement" },
    privacy: { label: "ES Privacy", text: "ES Save only when you choose local profile storage" }
  },
  inputSection: {
    title: "ES Energy inputs",
    description: "ES Use the VitalCalc sample BMR and choose the closest activity multiplier."
  },
  badges: {
    local: "ES Local",
    reference: "ES Reference"
  },
  fields: {
    bmr: "ES BMR",
    activity: "ES Activity level"
  },
  activityLevels: {
    sedentary: "ES Sedentary",
    light: "ES Light",
    moderate: "ES Moderate",
    very: "ES Very active",
    extra: "ES Extra active"
  },
  actions: {
    save: "ES Save profile",
    calculate: "ES Calculate TDEE"
  },
  resultSection: {
    title: "ES Daily energy result",
    emptyDescription: "ES Run calculation to estimate maintenance and planning targets.",
    summary: "ES BMR {bmr} × activity {activity}",
    waitingTitle: "ES Waiting for calculation",
    waitingDescription: "ES Calculate first to get planning targets.",
    baselineDescription: "ES Use the result as a baseline, then adjust by weight trend and training response."
  },
  metrics: {
    tdee: "ES TDEE",
    activityBurn: "ES Activity burn",
    fatLossTarget: "ES Fat-loss target",
    muscleGainTarget: "ES Muscle-gain target"
  },
  review: {
    eyebrow: "ES Review checklist",
    title: "ES Nutrition planning notes",
    notes: {
      estimate: "ES TDEE estimates maintenance calories from BMR and activity multiplier.",
      trend: "ES Fat-loss and muscle-gain targets should be adjusted from weekly trend data.",
      medical: "ES Medical conditions, pregnancy, medication, and eating-disorder history need qualified care."
    }
  },
  recommendation: {
    title: "ES Local-first",
    body: "ES No account storage is required. TDEE results are planning estimates, not a clinical nutrition plan.",
    result: "ES Maintenance baseline with planning targets."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "tdee-calculator": {
      ...en.tools["tdee-calculator"],
      workspace: localizedWorkspaceCopy
    }
  }
};

describe("TdeeCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("does not expose i18n audit hardcoded UI text or absolute href candidates", () => {
    const scan = scanSourceText(fs.readFileSync(workspacePath, "utf8"), workspacePath);

    expect(scan.hardcodedText).toEqual([]);
    expect(scan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc TDEE workspace sections", () => {
    renderWithIntl(<TdeeCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "TDEE Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Energy inputs")).toBeInTheDocument();
    expect(screen.getByText("Daily energy result")).toBeInTheDocument();
    expect(screen.getByText("Nutrition planning notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1500")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/tdee-calculator/about"
    );
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    render(
      <NextIntlClientProvider locale="es" messages={localizedMessages}>
        <TdeeCalculatorWorkspace />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("heading", { name: "ES TDEE Calculator" })).toBeInTheDocument();
    expect(screen.getByText("ES Energy inputs")).toBeInTheDocument();
    expect(screen.getByLabelText("ES BMR")).toHaveValue(1500);
    expect(screen.getByRole("button", { name: "ES Calculate TDEE" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ES Tool details" })).toHaveAttribute(
      "href",
      "/es/tools/tdee-calculator/about"
    );
  });

  it("calculates the default TDEE targets and saves the profile locally", () => {
    renderWithIntl(<TdeeCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate TDEE" }));

    expect(screen.getByText("2,325")).toBeInTheDocument();
    expect(screen.getByText("825 kcal")).toBeInTheDocument();
    expect(screen.getByText("1,825")).toBeInTheDocument();
    expect(screen.getByText("2,575")).toBeInTheDocument();
    expect(screen.getByText("BMR 1,500 × activity 1.55")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save profile" }));

    expect(window.localStorage.getItem("toolars.tdee-calculator.profile")).toContain("1500");
  });
});
