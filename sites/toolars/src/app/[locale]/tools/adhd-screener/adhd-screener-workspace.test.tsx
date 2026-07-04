import { execFileSync } from "node:child_process";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { AdhdScreenerWorkspace } from "./adhd-screener-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "ES VitalCalc adult ADHD screening workspace",
  title: "ES ADHD Adult Screener",
  subtitle: "ES Score the ASRS-v1.1 six-question adult ADHD screener with local dimensional breakdowns.",
  modelTitle: "ES Local screening model",
  detailsLink: "ES Tool details",
  trustRows: {
    local: { label: "ES Local", text: "ES ASRS answers stay in this browser session" },
    screening: { label: "ES Screening", text: "ES This is not an ADHD diagnosis" },
    private: { label: "ES Private", text: "ES Save stores only this local screener snapshot" }
  },
  answerSection: {
    title: "ES ASRS answers",
    description: "ES Answer based on the last 6 months. Scores of 2 or higher count toward the source positive-answer threshold."
  },
  badges: {
    local: "ES Local",
    screeningOnly: "ES Screening only"
  },
  questions: en.tools["adhd-screener"].questions,
  answerLabels: en.tools["adhd-screener"].answerLabels,
  actions: {
    save: "ES Save screener snapshot",
    score: "ES Score ASRS"
  },
  resultSection: {
    title: "ES Screening result",
    emptyDescription: "ES Run scoring to show ASRS positive-answer count and dimensional scores.",
    waitingTitle: "ES Waiting for score",
    waitingDescription: "ES Score answers first to review ASRS guidance.",
    guidanceDescription: "ES Use this as a screening reference and seek professional evaluation when symptoms impair life."
  },
  metrics: {
    totalScore: "ES Total score",
    sourceOutcome: "ES Source outcome",
    positiveAnswers: "ES Positive answers",
    diagnosticStatus: "ES Diagnostic status",
    inattentionScore: "ES Inattention score",
    hyperactivityScore: "ES Hyperactivity score"
  },
  outcome: en.tools["adhd-screener"].outcome,
  review: {
    eyebrow: "ES Review checklist",
    title: "ES Support notes",
    notes: {
      asrs: "ES VitalCalc uses the ASRS-v1.1 6-question screener and counts answers scored 2 or higher.",
      threshold: "ES Four or more positive answers maps to the source screening-positive outcome.",
      clinician: "ES Only a qualified clinician can diagnose ADHD after interview, history, impairment review, and differential assessment."
    }
  },
  recommendation: {
    title: "ES Local-first",
    body: "ES ASRS output is a screening reference, not a diagnosis, crisis service, or substitute for professional evaluation."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "adhd-screener": {
      ...en.tools["adhd-screener"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function scanAdhdScreenerWorkspaceSource() {
  const script = `
    import fs from "node:fs/promises";
    import { scanSourceText } from "./scripts/audit-i18n.mjs";

    const file = "src/app/[locale]/tools/adhd-screener/adhd-screener-workspace.tsx";
    const source = await fs.readFile(file, "utf8");
    console.log(JSON.stringify(scanSourceText(source, file)));
  `;

  return JSON.parse(execFileSync(process.execPath, ["--input-type=module", "-e", script], { encoding: "utf8" })) as {
    absoluteHrefs: Array<{ file: string; href: string }>;
    hardcodedText: Array<{ file: string; kind: string; text: string }>;
  };
}

describe("AdhdScreenerWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const scan = scanAdhdScreenerWorkspaceSource();

    expect(scan.hardcodedText).toEqual([]);
    expect(scan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc ADHD screener workspace sections", () => {
    renderWithIntl(<AdhdScreenerWorkspace />);

    expect(screen.getByRole("heading", { name: "ADHD Adult Screener" })).toBeInTheDocument();
    expect(screen.getByText("ASRS answers")).toBeInTheDocument();
    expect(screen.getByText("Screening result")).toBeInTheDocument();
    expect(screen.getByText("Support notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Trouble wrapping up final details")).toHaveValue("2");
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/adhd-screener/about");
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    render(
      <NextIntlClientProvider locale="es" messages={localizedMessages}>
        <AdhdScreenerWorkspace />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("heading", { name: "ES ADHD Adult Screener" })).toBeInTheDocument();
    expect(screen.getByText("ES ASRS answers")).toBeInTheDocument();
    expect(screen.getByText("ES Screening result")).toBeInTheDocument();
    expect(screen.getByText("ES Support notes")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ES Score ASRS" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ES Tool details" })).toHaveAttribute(
      "href",
      "/es/tools/adhd-screener/about"
    );
  });

  it("scores answers and saves the local ADHD snapshot", () => {
    renderWithIntl(<AdhdScreenerWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Score ASRS" }));

    expect(screen.getAllByText("10 / 24")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Screening positive")[0]).toBeInTheDocument();
    expect(screen.getByText("4 / 6")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save screener snapshot" }));

    expect(window.localStorage.getItem("toolars.adhd-screener.snapshot:v1")).toContain("\"answers\":[2,2,2,2,1,1]");
  });
});
