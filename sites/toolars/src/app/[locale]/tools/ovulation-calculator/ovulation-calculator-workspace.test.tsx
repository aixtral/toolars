import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import en from "../../../../../messages/en.json";
import { OvulationCalculatorWorkspace } from "./ovulation-calculator-workspace";

const ovulationCalculatorSourceFile =
  "src/app/[locale]/tools/ovulation-calculator/ovulation-calculator-workspace.tsx";

function scanOvulationCalculatorWorkspaceSource() {
  return scanSourceText(readFileSync(ovulationCalculatorSourceFile, "utf8"), ovulationCalculatorSourceFile);
}

const localizedWorkspaceCopy = {
  eyebrow: "ES VitalCalc cycle workspace",
  title: "ES Ovulation Calculator",
  subtitle: "ES Estimate ovulation day, fertile window, next period, and cycle milestones locally.",
  modelTitle: "ES Local calculation model",
  detailsLink: "ES Tool details",
  badges: {
    local: "ES Local",
    reference: "ES Reference"
  },
  trustRows: {
    local: {
      label: "ES Local",
      text: "ES Cycle dates stay in this browser session"
    },
    health: {
      label: "ES Health",
      text: "ES Cycle estimates vary with irregularity and symptoms"
    },
    private: {
      label: "ES Private",
      text: "ES Save stores only this cycle sample locally"
    }
  },
  inputSection: {
    title: "ES Cycle inputs",
    description: "ES Use last period date, cycle length, and period duration for a local estimate."
  },
  fields: {
    lastPeriod: "ES First day of last period",
    cycleLength: "ES Cycle length",
    periodDuration: "ES Period duration"
  },
  formats: {
    days: "{count} ES days"
  },
  actions: {
    save: "ES Save cycle",
    calculate: "ES Calculate cycle"
  },
  resultSection: {
    title: "ES Cycle result",
    emptyDescription: "ES Run calculation to estimate fertile window and next period.",
    summary: "ES {cycleLength}-day cycle, {periodDuration}-day period"
  },
  metrics: {
    ovulation: "ES Ovulation",
    fertileWindow: "ES Fertile window",
    nextPeriod: "ES Next period",
    safePeriod: "ES Safe-period reference"
  },
  callout: {
    waitingTitle: "ES Waiting for calculation",
    waitingDescription: "ES Calculate first to create the cycle calendar.",
    calculatedDescription: "ES Use ovulation tests, basal temperature, and clinician guidance when precision matters."
  },
  review: {
    eyebrow: "ES Review checklist",
    title: "ES Cycle notes",
    notes: {
      ovulation: "ES VitalCalc estimates ovulation about 14 days before the next period.",
      fertileWindow: "ES The fertile window spans roughly 5 days before ovulation through 1 day after.",
      care: "ES This is not contraception. Irregular cycles and fertility concerns need qualified care."
    }
  },
  recommendation: {
    title: "ES Local-first",
    body: "ES Cycle dates stay local. Use this as a planning reference, not a diagnosis or contraception method."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "ovulation-calculator": {
      ...en.tools["ovulation-calculator"],
      workspace: localizedWorkspaceCopy
    }
  }
};

describe("OvulationCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanOvulationCalculatorWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc ovulation workspace sections", () => {
    renderWithIntl(<OvulationCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Ovulation Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Cycle inputs")).toBeInTheDocument();
    expect(screen.getByText("Cycle result")).toBeInTheDocument();
    expect(screen.getByText("Cycle notes")).toBeInTheDocument();
    expect(screen.getByLabelText("First day of last period")).toHaveValue("2026-06-01");
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/ovulation-calculator/about");
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    render(
      <NextIntlClientProvider locale="es" messages={localizedMessages}>
        <OvulationCalculatorWorkspace />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("heading", { name: "ES Ovulation Calculator" })).toBeInTheDocument();
    expect(screen.getByText("ES Cycle inputs")).toBeInTheDocument();
    expect(screen.getByLabelText("ES First day of last period")).toHaveValue("2026-06-01");
    expect(screen.getByRole("button", { name: "ES Calculate cycle" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ES Tool details" })).toHaveAttribute("href", "/es/tools/ovulation-calculator/about");
    expect(screen.queryByText("Cycle inputs")).not.toBeInTheDocument();
  });

  it("calculates the default fertile window and saves the cycle locally", () => {
    renderWithIntl(<OvulationCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate cycle" }));

    expect(screen.getAllByText("Jun 15").length).toBeGreaterThan(0);
    expect(screen.getByText("Jun 10 - Jun 16")).toBeInTheDocument();
    expect(screen.getByText("Jun 29")).toBeInTheDocument();
    expect(screen.getByText("Jun 17 - Jun 28")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save cycle" }));

    expect(window.localStorage.getItem("toolars.ovulation-calculator.cycle:v1")).toContain("2026-06-01");
  });
});
