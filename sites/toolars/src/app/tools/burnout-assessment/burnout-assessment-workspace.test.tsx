import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { BurnoutAssessmentWorkspace } from "./burnout-assessment-workspace";

describe("BurnoutAssessmentWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc burnout workspace sections", () => {
    render(<BurnoutAssessmentWorkspace />);

    expect(screen.getByRole("heading", { name: "Burnout Assessment" })).toBeInTheDocument();
    expect(screen.getByText("Work-state answers")).toBeInTheDocument();
    expect(screen.getByText("Assessment result")).toBeInTheDocument();
    expect(screen.getByText("Support notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Feeling physically drained and exhausted")).toHaveValue("2");
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/burnout-assessment/about");
  });

  it("scores answers and saves the local burnout snapshot", () => {
    render(<BurnoutAssessmentWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Score burnout" }));

    expect(screen.getByText("20 / 40")).toBeInTheDocument();
    expect(screen.getByText("Mild burnout")).toBeInTheDocument();
    expect(screen.getByText("12 / 24")).toBeInTheDocument();
    expect(screen.getByText("8 / 16")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save burnout snapshot" }));

    expect(window.localStorage.getItem("toolars.burnout-assessment.snapshot:v1")).toContain("\"answers\":[2,2,2,2,2,2,2,2,2,2]");
  });
});
