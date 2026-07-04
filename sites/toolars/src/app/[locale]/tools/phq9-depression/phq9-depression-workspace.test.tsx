import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import en from "../../../../../messages/en.json";
import { Phq9DepressionWorkspace } from "./phq9-depression-workspace";

const phq9DepressionSourceFile = "src/app/[locale]/tools/phq9-depression/phq9-depression-workspace.tsx";

function scanPhq9DepressionWorkspaceSource() {
  return scanSourceText(readFileSync(phq9DepressionSourceFile, "utf8"), phq9DepressionSourceFile);
}

const localizedWorkspaceCopy = {
  eyebrow: "ES VitalCalc depression screening workspace",
  title: "ES PHQ-9 Depression Screening",
  subtitle: "ES Score nine PHQ-9 frequency questions locally and surface item 9 safety guidance.",
  modelTitle: "ES Local screening model",
  detailsLink: "ES Tool details",
  trustRows: {
    local: { label: "ES Local", text: "ES PHQ-9 answers stay in this browser session" },
    screening: { label: "ES Screening", text: "ES This is not a diagnosis or crisis service" },
    private: { label: "ES Private", text: "ES Save stores only this local screening snapshot" }
  },
  answerSection: {
    title: "ES Screening answers",
    description: "ES Answer based on the last 2 weeks. Item 9 is treated as a safety flag when non-zero."
  },
  badges: {
    local: "ES Local",
    screeningOnly: "ES Screening only"
  },
  questions: en.tools["phq9-depression"].questions,
  answerLabels: en.tools["phq9-depression"].answerLabels,
  actions: {
    save: "ES Save screening snapshot",
    score: "ES Score PHQ-9"
  },
  resultSection: {
    title: "ES Screening result",
    emptyDescription: "ES Run scoring to show PHQ-9 total, severity band, and item 9 status.",
    emptyScore: "0 / 27",
    waitingTitle: "ES Waiting for score",
    waitingDescription: "ES Score answers first to review PHQ-9 support guidance."
  },
  metrics: {
    totalScore: "ES PHQ-9 score",
    severityBand: "ES Severity band",
    item9Status: "ES Item 9 status",
    diagnosticStatus: "ES Diagnostic status"
  },
  item9Status: {
    flagged: "ES Flagged",
    clear: "ES No flag"
  },
  severity: en.tools["phq9-depression"].severity,
  crisisNote: en.tools["phq9-depression"].crisisNote,
  review: {
    eyebrow: "ES Review checklist",
    title: "ES Support notes",
    notes: {
      scoring: "ES VitalCalc maps PHQ-9 totals to minimal, mild, moderate, moderately severe, and severe depression bands.",
      item9: "ES A non-zero item 9 answer should be treated as urgent and reviewed with crisis, emergency, or qualified clinical support.",
      clinician: "ES Persistent symptoms, impairment, medication questions, or safety concerns should be reviewed with a qualified clinician."
    }
  },
  recommendation: {
    title: "ES Local-first",
    body: "ES PHQ-9 output is a screening reference, not a diagnosis, emergency service, or substitute for professional evaluation."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "phq9-depression": {
      ...en.tools["phq9-depression"],
      workspace: localizedWorkspaceCopy
    }
  }
};

describe("Phq9DepressionWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanPhq9DepressionWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc PHQ-9 workspace sections", () => {
    renderWithIntl(<Phq9DepressionWorkspace />);

    expect(screen.getByRole("heading", { name: "PHQ-9 Depression Screening" })).toBeInTheDocument();
    expect(screen.getByText("Screening answers")).toBeInTheDocument();
    expect(screen.getByText("Screening result")).toBeInTheDocument();
    expect(screen.getByText("Support notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Little interest or pleasure in doing things")).toHaveValue("1");
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/phq9-depression/about");
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    render(
      <NextIntlClientProvider locale="es" messages={localizedMessages}>
        <Phq9DepressionWorkspace />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("heading", { name: "ES PHQ-9 Depression Screening" })).toBeInTheDocument();
    expect(screen.getByText("ES Screening answers")).toBeInTheDocument();
    expect(screen.getByText("ES Screening result")).toBeInTheDocument();
    expect(screen.getByText("ES Support notes")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ES Score PHQ-9" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ES Tool details" })).toHaveAttribute(
      "href",
      "/es/tools/phq9-depression/about"
    );
  });

  it("scores answers and saves the local PHQ-9 snapshot", () => {
    renderWithIntl(<Phq9DepressionWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Score PHQ-9" }));

    expect(screen.getAllByText("8 / 27")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Mild depression")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Screening only").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Save screening snapshot" }));

    expect(window.localStorage.getItem("toolars.phq9-depression.snapshot:v1")).toContain("\"answers\":[1,1,1,1,1,1,1,1,0]");
  });
});
