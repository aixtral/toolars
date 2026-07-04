import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { IntermittentFastingWorkspace } from "./intermittent-fasting-workspace";

const intermittentFastingSourceFile =
  "src/app/[locale]/tools/intermittent-fasting/intermittent-fasting-workspace.tsx";

function scanIntermittentFastingWorkspaceSource() {
  return scanSourceText(readFileSync(intermittentFastingSourceFile, "utf8"), intermittentFastingSourceFile);
}

const localizedWorkspaceCopy = {
  eyebrow: "ES VitalCalc fasting workspace",
  title: "ES Intermittent Fasting Calculator",
  subtitle: "ES Plan eating and fasting windows from local protocol data.",
  modelTitle: "ES Local schedule model",
  detailsLink: "ES Tool details",
  badges: {
    local: "ES Local",
    schedule: "ES Schedule"
  },
  trustRows: {
    local: {
      label: "ES Local",
      text: "ES Protocol and meal time stay in this browser session"
    },
    health: {
      label: "ES Health",
      text: "ES Fasting is not appropriate for every medical or nutrition context"
    },
    private: {
      label: "ES Private",
      text: "ES Save stores only this local fasting plan"
    }
  },
  inputSection: {
    title: "ES Schedule inputs",
    description: "ES Choose a protocol and the time your last meal ended."
  },
  fields: {
    protocol: "ES Fasting protocol",
    lastMealTime: "ES Last meal time"
  },
  protocolOptions: {
    sixteenEight: "ES 16:8 (Most popular)",
    eighteenSix: "ES 18:6",
    twentyFour: "ES 20:4 (Warrior diet)",
    fourteenTen: "ES 14:10 (Gentle)",
    omad: "ES OMAD (One meal)",
    fiveTwo: "ES 5:2 (2 low-cal days)"
  },
  actions: {
    save: "ES Save fasting plan",
    calculate: "ES Calculate windows"
  },
  resultSection: {
    title: "ES Fasting result",
    emptyDescription: "ES Run calculation to show next meal, eating window, and fasting window.",
    summary: "ES {protocol} plan from {time}"
  },
  metrics: {
    nextMeal: "ES Next meal",
    fastingDuration: "ES Fasting duration",
    eatingWindow: "ES Eating window",
    fastingWindow: "ES Fasting window"
  },
  formats: {
    hours: "{count} ES hours",
    timeRangeNextDay: "{start} - {end} ES next day"
  },
  timeline: {
    protocol52Label: "ES 5:2 protocol",
    protocol52Value: "ES Eat normally 5 days and use 2 non-consecutive lower-calorie days.",
    lastMealEnds: "ES Last meal ends",
    fastingBegins: "ES Fasting begins",
    youMayEat: "ES You may eat",
    eatingWindowCloses: "ES Eating window closes"
  },
  callout: {
    waitingTitle: "ES Waiting for calculation",
    waitingDescription: "ES Calculate first to build the fasting timeline.",
    calculatedDescription: "ES Treat fasting windows as a planning aid, not a medical directive."
  },
  recommendations: {
    standard: "ES Keep hydration and sleep steady; stop if fasting triggers dizziness or disordered eating patterns.",
    protocol52: "ES Plan the two lower-calorie days away from hard training or long shifts."
  },
  review: {
    eyebrow: "ES Review checklist",
    title: "ES Fasting notes",
    notes: {
      windows: "ES VitalCalc maps 16:8, 18:6, 20:4, and 14:10 directly to fasting and eating windows.",
      omad: "ES OMAD uses 23 fasting hours and 1 eating hour.",
      fiveTwo: "ES 5:2 is treated as 5 normal days plus 2 non-consecutive lower-calorie days."
    }
  },
  recommendation: {
    title: "ES Local-first",
    body: "ES Avoid fasting during pregnancy, adolescent growth, eating-disorder risk, or diabetes medication changes without care guidance."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "intermittent-fasting": {
      ...en.tools["intermittent-fasting"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithSpanish(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe("IntermittentFastingWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanIntermittentFastingWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc intermittent fasting workspace sections", () => {
    renderWithIntl(<IntermittentFastingWorkspace />);

    expect(screen.getByRole("heading", { name: "Intermittent Fasting Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Schedule inputs")).toBeInTheDocument();
    expect(screen.getByText("Fasting result")).toBeInTheDocument();
    expect(screen.getByText("Fasting notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Last meal time")).toHaveValue("20:00");
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/intermittent-fasting/about");
  });

  it("calculates the default window and saves the fasting plan locally", () => {
    renderWithIntl(<IntermittentFastingWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate windows" }));

    expect(screen.getAllByText("12:00").length).toBeGreaterThan(0);
    expect(screen.getByText("12:00 - 20:00")).toBeInTheDocument();
    expect(screen.getByText("20:00 - 12:00 (next day)")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save fasting plan" }));

    expect(window.localStorage.getItem("toolars.intermittent-fasting.plan:v1")).toContain("16:8");
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    renderWithSpanish(<IntermittentFastingWorkspace />);

    expect(screen.getByRole("heading", { name: "ES Intermittent Fasting Calculator" })).toBeInTheDocument();
    expect(screen.getByText("ES Schedule inputs")).toBeInTheDocument();
    expect(screen.getByLabelText("ES Last meal time")).toHaveValue("20:00");
    expect(screen.getByRole("button", { name: "ES Calculate windows" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ES Tool details" })).toHaveAttribute(
      "href",
      "/es/tools/intermittent-fasting/about"
    );
    expect(screen.queryByText("Schedule inputs")).not.toBeInTheDocument();
  });
});
