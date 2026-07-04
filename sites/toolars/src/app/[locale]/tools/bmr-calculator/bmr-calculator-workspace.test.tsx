import { execFileSync } from "node:child_process";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { BmrCalculatorWorkspace } from "./bmr-calculator-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "ES VitalCalc health workspace",
  title: "ES BMR Calculator",
  subtitle: "ES Calculate basal metabolic rate using the Mifflin-St Jeor formula.",
  modelTitle: "ES Local calculation model",
  detailsLink: "ES Tool details",
  trustRows: {
    local: { label: "ES Local", text: "ES Age, height, weight, and sex stay in this browser session" },
    formula: { label: "ES Formula", text: "ES Mifflin-St Jeor is a planning estimate, not a metabolic test" },
    private: { label: "ES Private", text: "ES Save only stores assumptions in local browser storage" }
  },
  inputSection: {
    title: "ES Metabolism inputs",
    description: "ES Use the VitalCalc sample profile, then adjust age, sex, height, and weight."
  },
  badges: {
    local: "ES Local",
    formula: "ES Formula"
  },
  fields: {
    sex: "ES Sex",
    age: "ES Age",
    height: "ES Height (cm)",
    weight: "ES Weight (kg)"
  },
  sexOptions: {
    male: "ES Male",
    female: "ES Female"
  },
  actions: {
    save: "ES Save assumptions",
    calculate: "ES Calculate BMR"
  },
  resultSection: {
    title: "ES BMR result",
    emptyDescription: "ES Run calculation to estimate resting energy needs.",
    maintainValue: "ES Maintain: {value}",
    waitingTitle: "ES Waiting for calculation",
    waitingDescription: "ES Calculate first to get a local reference.",
    baselineDescription: "ES BMR is only the resting baseline; activity changes total daily needs."
  },
  metrics: {
    bmr: "ES BMR",
    maintain: "ES Maintain",
    lossTarget: "ES Loss target",
    gainTarget: "ES Gain target"
  },
  review: {
    eyebrow: "ES Review checklist",
    title: "ES Formula notes",
    notes: {
      resting: "ES BMR estimates resting energy needs before activity is included.",
      tdee: "ES Use the TDEE workspace when you need activity-adjusted maintenance calories.",
      medical: "ES Medical conditions, medication, and body composition can shift measured energy needs."
    }
  },
  recommendation: {
    title: "ES Local-first",
    body: "ES No account data is required. Results are planning estimates, not a clinical metabolic measurement.",
    result: "ES Use BMR as resting energy, then use TDEE for activity-adjusted planning."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "bmr-calculator": {
      ...en.tools["bmr-calculator"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function scanBmrCalculatorWorkspaceSource() {
  const script = `
    import fs from "node:fs/promises";
    import { scanSourceText } from "./scripts/audit-i18n.mjs";

    const file = "src/app/[locale]/tools/bmr-calculator/bmr-calculator-workspace.tsx";
    const source = await fs.readFile(file, "utf8");
    console.log(JSON.stringify(scanSourceText(source, file)));
  `;

  return JSON.parse(execFileSync(process.execPath, ["--input-type=module", "-e", script], { encoding: "utf8" })) as {
    absoluteHrefs: Array<{ file: string; href: string }>;
    hardcodedText: Array<{ file: string; kind: string; text: string }>;
  };
}

describe("BmrCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const scan = scanBmrCalculatorWorkspaceSource();

    expect(scan.hardcodedText).toEqual([]);
    expect(scan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc BMR workspace sections", () => {
    renderWithIntl(<BmrCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "BMR Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Metabolism inputs")).toBeInTheDocument();
    expect(screen.getByText("BMR result")).toBeInTheDocument();
    expect(screen.getByText("Formula notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("175")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/bmr-calculator/about"
    );
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    render(
      <NextIntlClientProvider locale="es" messages={localizedMessages}>
        <BmrCalculatorWorkspace />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("heading", { name: "ES BMR Calculator" })).toBeInTheDocument();
    expect(screen.getByText("ES Metabolism inputs")).toBeInTheDocument();
    expect(screen.getByLabelText("ES Height (cm)")).toHaveValue(175);
    expect(screen.getByRole("button", { name: "ES Calculate BMR" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ES Tool details" })).toHaveAttribute(
      "href",
      "/es/tools/bmr-calculator/about"
    );
  });

  it("calculates the default BMR targets and saves assumptions locally", () => {
    renderWithIntl(<BmrCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate BMR" }));

    expect(screen.getByText("1,649 kcal")).toBeInTheDocument();
    expect(screen.getByText("1,149 kcal")).toBeInTheDocument();
    expect(screen.getByText("1,899 kcal")).toBeInTheDocument();
    expect(screen.getByText("Male, 30 years, 175 cm, 70 kg")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save assumptions" }));

    expect(window.localStorage.getItem("toolars.bmr-calculator.assumptions")).toContain("175");
  });
});
