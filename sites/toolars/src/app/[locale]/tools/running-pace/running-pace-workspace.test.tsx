import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import en from "../../../../../messages/en.json";
import { RunningPaceWorkspace } from "./running-pace-workspace";

const runningPaceSourceFile = "src/app/[locale]/tools/running-pace/running-pace-workspace.tsx";

function scanRunningPaceWorkspaceSource() {
  return scanSourceText(readFileSync(runningPaceSourceFile, "utf8"), runningPaceSourceFile);
}

const localizedWorkspaceCopy = {
  eyebrow: "ES VitalCalc race workspace",
  title: "ES Running Pace Calculator",
  subtitle: "ES Calculate target pace, speed, 400m split, and equivalent race performances.",
  modelTitle: "ES Local calculation model",
  detailsLink: "ES Tool details",
  trustRows: {
    local: { label: "ES Local", text: "ES Race distance and target time stay in this browser session" },
    training: { label: "ES Training", text: "ES Equivalent times are estimates and depend on conditions" },
    private: { label: "ES Private", text: "ES Save stores only this race plan locally" }
  },
  inputSection: {
    title: "ES Race inputs",
    description: "ES Choose a common race distance or enter a custom distance and time."
  },
  badges: {
    local: "ES Local",
    riegel: "ES Riegel"
  },
  fields: {
    distance: "ES Distance",
    customDistance: "ES Custom distance (km)",
    hours: "ES Target hours",
    minutes: "ES Target minutes",
    seconds: "ES Target seconds"
  },
  distanceOptions: {
    "5k": "ES 5K",
    "10k": "ES 10K",
    "half-marathon": "ES Half Marathon",
    marathon: "ES Marathon",
    custom: "ES Custom",
    customDistance: "ES {distance} km"
  },
  actions: {
    save: "ES Save race plan",
    calculate: "ES Calculate pace"
  },
  resultSection: {
    title: "ES Pace result",
    emptyDescription: "ES Run calculation to show target pace and equivalent performances.",
    summary: "ES {distance} in {time}",
    equivalentPace: "ES {time} - {pace}/km",
    targetTime: "ES Target time {time}",
    waitingTitle: "ES Waiting for calculation",
    waitingDescription: "ES Calculate first to create race splits."
  },
  metrics: {
    pacePerKm: "ES Pace per km",
    pacePerMile: "ES Pace per mile",
    speed: "ES Speed",
    lap400m: "ES 400m split"
  },
  equivalents: {
    "1k": "ES 1K",
    "3k": "ES 3K",
    "5k": "ES 5K",
    "10k": "ES 10K",
    "half-marathon": "ES Half Marathon",
    marathon: "ES Marathon"
  },
  review: {
    eyebrow: "ES Review checklist",
    title: "ES Race notes",
    notes: {
      calculation: "ES VitalCalc calculates pace as target time divided by distance.",
      riegel: "ES Equivalent performances use the Riegel formula.",
      conditions: "ES Terrain, weather, pacing, fueling, and training volume can move results."
    }
  },
  recommendation: {
    title: "ES Local-first",
    body: "ES Race targets stay local and are meant for training planning, not medical clearance.",
    equivalent: "ES Equivalent performances are estimates and conditions can shift race outcomes."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "running-pace": {
      ...en.tools["running-pace"],
      workspace: localizedWorkspaceCopy
    }
  }
};

describe("RunningPaceWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanRunningPaceWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc running pace workspace sections", () => {
    renderWithIntl(<RunningPaceWorkspace />);

    expect(screen.getByRole("heading", { name: "Running Pace Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Race inputs")).toBeInTheDocument();
    expect(screen.getByText("Pace result")).toBeInTheDocument();
    expect(screen.getByText("Race notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Target minutes")).toHaveValue(50);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/running-pace/about");
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    render(
      <NextIntlClientProvider locale="es" messages={localizedMessages}>
        <RunningPaceWorkspace />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("heading", { name: "ES Running Pace Calculator" })).toBeInTheDocument();
    expect(screen.getByText("ES Race inputs")).toBeInTheDocument();
    expect(screen.getByLabelText("ES Target minutes")).toHaveValue(50);
    expect(screen.getByRole("button", { name: "ES Calculate pace" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ES Tool details" })).toHaveAttribute("href", "/es/tools/running-pace/about");
  });

  it("calculates the default pace and saves the race plan locally", () => {
    renderWithIntl(<RunningPaceWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate pace" }));

    expect(screen.getByText("5'00\"")).toBeInTheDocument();
    expect(screen.getByText("8'03\" /mi")).toBeInTheDocument();
    expect(screen.getByText("12.0 km/h")).toBeInTheDocument();
    expect(screen.getByText("3:50:01")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save race plan" }));

    expect(window.localStorage.getItem("toolars.running-pace.plan:v1")).toContain("10k");
  });
});
