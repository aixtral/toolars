import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import en from "../../../../../messages/en.json";
import { PregnancyDueDateWorkspace } from "./pregnancy-due-date-workspace";

const pregnancyDueDateSourceFile = "src/app/[locale]/tools/pregnancy-due-date/pregnancy-due-date-workspace.tsx";

function scanPregnancyDueDateWorkspaceSource() {
  return scanSourceText(readFileSync(pregnancyDueDateSourceFile, "utf8"), pregnancyDueDateSourceFile);
}

const localizedWorkspaceCopy = {
  eyebrow: "ES VitalCalc health workspace",
  title: "ES Pregnancy Due Date Calculator",
  subtitle: "ES Estimate due date, conception date, gestational age, trimester, and remaining days locally.",
  modelTitle: "ES Local calculation model",
  detailsLink: "ES Tool details",
  badges: {
    local: "ES Local",
    reference: "ES Reference"
  },
  trustRows: {
    local: {
      label: "ES Local",
      text: "ES Reproductive health dates stay in this browser session"
    },
    medical: {
      label: "ES Medical",
      text: "ES Due date estimates need clinician confirmation"
    },
    privacy: {
      label: "ES Privacy",
      text: "ES Save only when you choose local timeline storage"
    }
  },
  inputSection: {
    title: "ES Pregnancy timeline",
    description: "ES Use LMP and cycle length to adjust the standard 40-week due date estimate."
  },
  fields: {
    lmp: "ES Last menstrual period",
    cycleLength: "ES Cycle length"
  },
  actions: {
    save: "ES Save timeline",
    calculate: "ES Calculate due date"
  },
  resultSection: {
    title: "ES Due date result",
    emptyDescription: "ES Run calculation to estimate pregnancy timeline.",
    summary: "ES {pregnantDays} days / {totalDays} days",
    selectBeforeToday: "ES Select an LMP date before today"
  },
  metrics: {
    dueDate: "ES Estimated due date",
    currentWeek: "ES Current week",
    trimester: "ES Trimester",
    daysUntilDue: "ES Days until due"
  },
  formats: {
    days: "{count} ES days",
    dueNow: "ES Due now",
    weekDay: "ES Week {weeks}, Day {days}",
    notPregnant: "ES Not pregnant",
    progress: "ES Pregnancy progress {percent}%"
  },
  trimesters: {
    first: "ES 1st Trimester",
    second: "ES 2nd Trimester",
    third: "ES 3rd Trimester",
    overdue: "ES Overdue",
    notPregnant: "ES Not pregnant"
  },
  callout: {
    waitingTitle: "ES Waiting for calculation",
    waitingDescription: "ES Calculate first to estimate conception date and progress."
  },
  review: {
    eyebrow: "ES Review checklist",
    title: "ES Medical reference notes",
    notes: {
      estimate: "ES Pregnancy timeline output is an estimate, not a diagnosis.",
      clinicalContext: "ES Ultrasound dating, IVF context, cycle irregularity, and clinician guidance can change the timeline.",
      urgentCare: "ES Seek urgent medical care for severe pain, bleeding, or concerning symptoms."
    }
  },
  recommendation: {
    title: "ES Local-first",
    body: "ES No account storage is required. This workspace is for pregnancy planning reference only."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "pregnancy-due-date": {
      ...en.tools["pregnancy-due-date"],
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

describe("PregnancyDueDateWorkspace", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-16T12:00:00Z"));
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanPregnancyDueDateWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc pregnancy due date workspace sections", () => {
    renderWithIntl(<PregnancyDueDateWorkspace />);

    expect(screen.getByRole("heading", { name: "Pregnancy Due Date Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Pregnancy timeline")).toBeInTheDocument();
    expect(screen.getByText("Due date result")).toBeInTheDocument();
    expect(screen.getByText("Medical reference notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2026-01-01")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/pregnancy-due-date/about"
    );
  });

  it("calculates the default due date and saves timeline locally", () => {
    renderWithIntl(<PregnancyDueDateWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate due date" }));

    expect(screen.getByText("October 10, 2026")).toBeInTheDocument();
    expect(screen.getByText("Week 23, Day 5")).toBeInTheDocument();
    expect(screen.getByText("2nd Trimester")).toBeInTheDocument();
    expect(screen.getByText("116 days")).toBeInTheDocument();
    expect(screen.getByText("Pregnancy timeline output is an estimate, not a diagnosis.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save timeline" }));

    expect(window.localStorage.getItem("toolars.pregnancy-due-date.timeline")).toContain("2026-01-01");
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    renderWithSpanish(<PregnancyDueDateWorkspace />);

    expect(screen.getByRole("heading", { name: "ES Pregnancy Due Date Calculator" })).toBeInTheDocument();
    expect(screen.getByText("ES Pregnancy timeline")).toBeInTheDocument();
    expect(screen.getByLabelText("ES Last menstrual period")).toHaveValue("2026-01-01");
    expect(screen.getByRole("button", { name: "ES Calculate due date" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ES Tool details" })).toHaveAttribute(
      "href",
      "/es/tools/pregnancy-due-date/about"
    );
    expect(screen.queryByText("Pregnancy timeline")).not.toBeInTheDocument();
  });
});
