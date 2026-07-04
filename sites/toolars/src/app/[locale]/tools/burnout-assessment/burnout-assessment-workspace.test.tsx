import { execFileSync } from "node:child_process";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { BurnoutAssessmentWorkspace } from "./burnout-assessment-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "ES VitalCalc burnout screening workspace",
  title: "ES Burnout Assessment",
  subtitle: "ES Score a 10-item work-state screener with exhaustion and detachment breakdowns.",
  modelTitle: "ES Local assessment model",
  detailsLink: "ES Tool details",
  trustRows: {
    local: { label: "ES Local", text: "ES Burnout answers stay in this browser session" },
    screening: { label: "ES Screening", text: "ES This is not a mental-health diagnosis" },
    private: { label: "ES Private", text: "ES Save stores only this local assessment snapshot" }
  },
  inputSection: {
    title: "ES Work-state answers",
    description: "ES Answer based on the last month. The first 6 items score exhaustion and the last 4 score detachment."
  },
  badges: {
    local: "ES Local",
    screening: "ES Screening only"
  },
  questions: {
    "0": { label: "ES Feeling physically drained and exhausted", description: "ES Over the last month" },
    "1": { label: "ES Difficulty concentrating or feeling mentally slowed", description: "ES Over the last month" },
    "2": { label: "ES Lost enthusiasm and interest in work", description: "ES Over the last month" },
    "3": { label: "ES Feeling cold or cynical toward work", description: "ES Over the last month" },
    "4": { label: "ES Feeling exhausted at the end of each workday", description: "ES Over the last month" },
    "5": { label: "ES Feeling tired even after a full night of sleep", description: "ES Over the last month" },
    "6": { label: "ES No longer feeling proud or satisfied with work outcomes", description: "ES Detachment dimension" },
    "7": { label: "ES Feeling emotionally drained by work pressure", description: "ES Detachment dimension" },
    "8": { label: "ES Work demands feel beyond what you can handle", description: "ES Detachment dimension" },
    "9": { label: "ES Questioning the meaning and value of your work", description: "ES Detachment dimension" }
  },
  answerLabels: {
    "0": "ES Never",
    "1": "ES Rarely",
    "2": "ES Sometimes",
    "3": "ES Often",
    "4": "ES Very often"
  },
  actions: {
    save: "ES Save burnout snapshot",
    calculate: "ES Score burnout"
  },
  resultSection: {
    title: "ES Assessment result",
    emptyDescription: "ES Run scoring to show burnout total, exhaustion, and detachment scores.",
    waitingTitle: "ES Waiting for score",
    waitingDescription: "ES Score answers first to review burnout guidance.",
    guidanceDescription: "ES Use this as a work-health screening reference and seek professional help when symptoms persist."
  },
  metrics: {
    totalScore: "ES Total score",
    burnoutBand: "ES Burnout band",
    exhaustion: "ES Exhaustion",
    detachment: "ES Detachment"
  },
  severity: {
    none: {
      label: "ES No significant burnout",
      guidance: "ES Your score does not suggest significant burnout in this short screening model."
    },
    mild: {
      label: "ES Mild burnout",
      guidance: "ES Your score suggests early burnout signs."
    },
    moderate: {
      label: "ES Moderate burnout",
      guidance: "ES Your score suggests a noticeable burnout risk."
    },
    severe: {
      label: "ES Severe burnout",
      guidance: "ES Your score suggests a high burnout risk."
    }
  },
  review: {
    eyebrow: "ES Review checklist",
    title: "ES Support notes",
    notes: {
      bands: "ES VitalCalc maps burnout totals to no significant, mild, moderate, and severe burnout bands.",
      dimensions: "ES The first 6 items form the exhaustion dimension; the last 4 form the detachment dimension.",
      clinician: "ES Sustained burnout, depression, anxiety, or safety concerns should be reviewed with a qualified clinician."
    }
  },
  recommendation: {
    title: "ES Local-first",
    body: "ES Burnout output is a screening reference, not a diagnosis, crisis service, or substitute for professional evaluation."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "burnout-assessment": {
      ...en.tools["burnout-assessment"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function scanBurnoutAssessmentWorkspaceSource() {
  const script = `
    import fs from "node:fs/promises";
    import { scanSourceText } from "./scripts/audit-i18n.mjs";

    const file = "src/app/[locale]/tools/burnout-assessment/burnout-assessment-workspace.tsx";
    const source = await fs.readFile(file, "utf8");
    console.log(JSON.stringify(scanSourceText(source, file)));
  `;

  return JSON.parse(execFileSync(process.execPath, ["--input-type=module", "-e", script], { encoding: "utf8" })) as {
    absoluteHrefs: Array<{ file: string; href: string }>;
    hardcodedText: Array<{ file: string; kind: string; text: string }>;
  };
}

describe("BurnoutAssessmentWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const scan = scanBurnoutAssessmentWorkspaceSource();

    expect(scan.hardcodedText).toEqual([]);
    expect(scan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc burnout workspace sections", () => {
    renderWithIntl(<BurnoutAssessmentWorkspace />);

    expect(screen.getByRole("heading", { name: "Burnout Assessment" })).toBeInTheDocument();
    expect(screen.getByText("Work-state answers")).toBeInTheDocument();
    expect(screen.getByText("Assessment result")).toBeInTheDocument();
    expect(screen.getByText("Support notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Feeling physically drained and exhausted")).toHaveValue("2");
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/burnout-assessment/about");
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    render(
      <NextIntlClientProvider locale="es" messages={localizedMessages}>
        <BurnoutAssessmentWorkspace />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("heading", { name: "ES Burnout Assessment" })).toBeInTheDocument();
    expect(screen.getByText("ES Work-state answers")).toBeInTheDocument();
    expect(screen.getByLabelText("ES Feeling physically drained and exhausted")).toHaveValue("2");
    expect(screen.getByRole("button", { name: "ES Score burnout" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ES Tool details" })).toHaveAttribute(
      "href",
      "/es/tools/burnout-assessment/about"
    );
  });

  it("scores answers and saves the local burnout snapshot", () => {
    renderWithIntl(<BurnoutAssessmentWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Score burnout" }));

    expect(screen.getAllByText("20 / 40")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Mild burnout")[0]).toBeInTheDocument();
    expect(screen.getByText("12 / 24")).toBeInTheDocument();
    expect(screen.getByText("8 / 16")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save burnout snapshot" }));

    expect(window.localStorage.getItem("toolars.burnout-assessment.snapshot:v1")).toContain("\"answers\":[2,2,2,2,2,2,2,2,2,2]");
  });
});
