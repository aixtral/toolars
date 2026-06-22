import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { Gad7AnxietyWorkspace } from "./gad7-anxiety-workspace";

describe("Gad7AnxietyWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc GAD-7 workspace sections", () => {
    render(<Gad7AnxietyWorkspace />);

    expect(screen.getByRole("heading", { name: "GAD-7 Anxiety Screening" })).toBeInTheDocument();
    expect(screen.getByText("Screening answers")).toBeInTheDocument();
    expect(screen.getByText("Screening result")).toBeInTheDocument();
    expect(screen.getByText("Support notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Feeling nervous, anxious, or on edge")).toHaveValue("1");
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/gad7-anxiety/about");
  });

  it("scores answers and saves the local GAD-7 snapshot", () => {
    render(<Gad7AnxietyWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Score GAD-7" }));

    expect(screen.getByText("7 / 21")).toBeInTheDocument();
    expect(screen.getByText("Mild anxiety")).toBeInTheDocument();
    expect(screen.getAllByText("Screening only").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Save screening snapshot" }));

    expect(window.localStorage.getItem("toolars.gad7-anxiety.snapshot:v1")).toContain("\"answers\":[1,1,1,1,1,1,1]");
  });
});
