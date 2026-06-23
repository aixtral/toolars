import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { RunningPaceWorkspace } from "./running-pace-workspace";

describe("RunningPaceWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
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
