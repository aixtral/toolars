import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import en from "../../../../../messages/en.json";
import { Pss10StressWorkspace } from "./pss10-stress-workspace";

const pss10StressSourceFile = "src/app/[locale]/tools/pss10-stress/pss10-stress-workspace.tsx";

function scanWorkspaceSource() {
  return scanSourceText(readFileSync(pss10StressSourceFile, "utf8"), pss10StressSourceFile);
}

const localizedWorkspaceCopy = {
  eyebrow: "ES VitalCalc perceived stress workspace",
  title: "ES PSS-10 Stress Screening",
  subtitle: "ES Score ten perceived-stress questions locally with source reverse scoring.",
  modelTitle: "ES Local screening model",
  detailsLink: "ES Tool details",
  trustRows: {
    local: { label: "ES Local", text: "ES PSS-10 answers stay in this browser session" },
    screening: { label: "ES Screening", text: "ES This is not a diagnosis or crisis service" },
    private: { label: "ES Private", text: "ES Save stores only this local stress snapshot" }
  },
  answerSection: {
    title: "ES Screening answers",
    description: "ES Answer based on the last month. Reverse-scored items are handled by the local scoring model."
  },
  badges: {
    local: "ES Local",
    screeningOnly: "ES Screening only"
  },
  questions: en.tools["pss10-stress"].questions,
  answerLabels: en.tools["pss10-stress"].answerLabels,
  actions: {
    save: "ES Save stress snapshot",
    score: "ES Score PSS-10"
  },
  resultSection: {
    title: "ES Stress result",
    emptyDescription: "ES Run scoring to show PSS-10 total and perceived-stress band.",
    emptyScore: "0 / 40",
    waitingTitle: "ES Waiting for score",
    waitingDescription: "ES Score answers first to review stress guidance.",
    guidanceDescription: "ES Use this as a perceived-stress reference and seek help when stress affects daily functioning."
  },
  metrics: {
    totalScore: "ES PSS-10 score",
    stressBand: "ES Stress band",
    reverseItems: "ES Reverse items",
    diagnosticStatus: "ES Diagnostic status"
  },
  reverseItemsValue: "4, 5, 7, 9, 10",
  severity: en.tools["pss10-stress"].severity,
  review: {
    eyebrow: "ES Review checklist",
    title: "ES Support notes",
    notes: {
      scoring: "ES VitalCalc maps PSS-10 totals to low, moderate, and high perceived stress bands.",
      reverseScored: "ES Items 4, 5, 7, 9, and 10 are reverse scored before the total is calculated.",
      clinician: "ES Sustained stress, sleep disruption, panic, or safety concerns should be reviewed with a qualified clinician."
    }
  },
  recommendation: {
    title: "ES Local-first",
    body: "ES PSS-10 output is a screening reference, not a diagnosis, crisis service, or substitute for professional evaluation."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "pss10-stress": {
      ...en.tools["pss10-stress"],
      workspace: localizedWorkspaceCopy
    }
  }
};

describe("Pss10StressWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace free of i18n audit hardcoded UI text candidates", () => {
    const sourceScan = scanWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc PSS-10 workspace sections", () => {
    renderWithIntl(<Pss10StressWorkspace />);

    expect(screen.getByRole("heading", { name: "PSS-10 Stress Screening" })).toBeInTheDocument();
    expect(screen.getByText("Screening answers")).toBeInTheDocument();
    expect(screen.getByText("Stress result")).toBeInTheDocument();
    expect(screen.getByText("Support notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Upset because of something unexpected")).toHaveValue("2");
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/pss10-stress/about");
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    render(
      <NextIntlClientProvider locale="es" messages={localizedMessages}>
        <Pss10StressWorkspace />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("heading", { name: "ES PSS-10 Stress Screening" })).toBeInTheDocument();
    expect(screen.getByText("ES Screening answers")).toBeInTheDocument();
    expect(screen.getByText("ES Stress result")).toBeInTheDocument();
    expect(screen.getByText("ES Support notes")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ES Score PSS-10" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ES Tool details" })).toHaveAttribute(
      "href",
      "/es/tools/pss10-stress/about"
    );
  });

  it("scores answers and saves the local PSS-10 snapshot", () => {
    renderWithIntl(<Pss10StressWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Score PSS-10" }));

    expect(screen.getAllByText("20 / 40")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Moderate stress")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Screening only").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Save stress snapshot" }));

    expect(window.localStorage.getItem("toolars.pss10-stress.snapshot:v1")).toContain("\"answers\":[2,2,2,2,2,2,2,2,2,2]");
  });
});
