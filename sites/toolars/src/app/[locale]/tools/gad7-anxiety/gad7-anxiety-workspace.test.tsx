import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { Gad7AnxietyWorkspace } from "./gad7-anxiety-workspace";

const gad7AnxietySourceFile = "src/app/[locale]/tools/gad7-anxiety/gad7-anxiety-workspace.tsx";

function scanGad7AnxietyWorkspaceSource() {
  return scanSourceText(readFileSync(gad7AnxietySourceFile, "utf8"), gad7AnxietySourceFile);
}

const localizedWorkspaceCopy = {
  eyebrow: "ES VitalCalc anxiety screening workspace",
  title: "ES GAD-7 Anxiety Screening",
  subtitle: "ES Score seven anxiety-frequency questions locally and review screening-only support guidance.",
  modelTitle: "ES Local screening model",
  detailsLink: "ES Tool details",
  trustRows: {
    local: { label: "ES Local", text: "ES GAD-7 answers stay in this browser session" },
    screening: { label: "ES Screening", text: "ES This is not a diagnosis or crisis service" },
    private: { label: "ES Private", text: "ES Save stores only this local screening snapshot" }
  },
  answerSection: {
    title: "ES Screening answers",
    description: "ES Answer based on the last 2 weeks. Values mirror the source GAD-7 0-3 frequency scale."
  },
  badges: {
    local: "ES Local",
    screeningOnly: "ES Screening only"
  },
  questions: en.tools["gad7-anxiety"].questions,
  answerLabels: en.tools["gad7-anxiety"].answerLabels,
  actions: {
    save: "ES Save screening snapshot",
    score: "ES Score GAD-7"
  },
  resultSection: {
    title: "ES Screening result",
    emptyDescription: "ES Run scoring to show GAD-7 total and severity band.",
    emptyScore: "0 / 21",
    waitingTitle: "ES Waiting for score",
    waitingDescription: "ES Score answers first to review support guidance.",
    guidanceDescription: "ES Discuss persistent symptoms with a doctor, therapist, or qualified clinician."
  },
  metrics: {
    totalScore: "ES GAD-7 score",
    severityBand: "ES Severity band",
    supportLevel: "ES Support level",
    diagnosticStatus: "ES Diagnostic status"
  },
  severity: en.tools["gad7-anxiety"].severity,
  review: {
    eyebrow: "ES Review checklist",
    title: "ES Support notes",
    notes: {
      scoring: "ES VitalCalc maps GAD-7 totals to minimal, mild, moderate, and severe anxiety bands.",
      clinician: "ES Persistent symptoms, impairment, panic, substance use, or physical symptoms should be reviewed with a clinician.",
      crisis: "ES If you feel at immediate risk or unsafe, contact local emergency or crisis support now."
    }
  },
  recommendation: {
    title: "ES Local-first",
    body: "ES Screening answers stay local. GAD-7 output is a reference screen, not a diagnosis or emergency service."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "gad7-anxiety": {
      ...en.tools["gad7-anxiety"],
      workspace: localizedWorkspaceCopy
    }
  }
};

describe("Gad7AnxietyWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanGad7AnxietyWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc GAD-7 workspace sections", () => {
    renderWithIntl(<Gad7AnxietyWorkspace />);

    expect(screen.getByRole("heading", { name: "GAD-7 Anxiety Screening" })).toBeInTheDocument();
    expect(screen.getByText("Screening answers")).toBeInTheDocument();
    expect(screen.getByText("Screening result")).toBeInTheDocument();
    expect(screen.getByText("Support notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Feeling nervous, anxious, or on edge")).toHaveValue("1");
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/gad7-anxiety/about");
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    render(
      <NextIntlClientProvider locale="es" messages={localizedMessages}>
        <Gad7AnxietyWorkspace />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("heading", { name: "ES GAD-7 Anxiety Screening" })).toBeInTheDocument();
    expect(screen.getByText("ES Screening answers")).toBeInTheDocument();
    expect(screen.getByText("ES Screening result")).toBeInTheDocument();
    expect(screen.getByText("ES Support notes")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ES Score GAD-7" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ES Tool details" })).toHaveAttribute(
      "href",
      "/es/tools/gad7-anxiety/about"
    );
  });

  it("scores answers and saves the local GAD-7 snapshot", () => {
    renderWithIntl(<Gad7AnxietyWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Score GAD-7" }));

    expect(screen.getAllByText("7 / 21").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Mild anxiety").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Screening only").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Save screening snapshot" }));

    expect(window.localStorage.getItem("toolars.gad7-anxiety.snapshot:v1")).toContain("\"answers\":[1,1,1,1,1,1,1]");
  });
});
