import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { Phq9DepressionWorkspace } from "./phq9-depression-workspace";

describe("Phq9DepressionWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc PHQ-9 workspace sections", () => {
    render(<Phq9DepressionWorkspace />);

    expect(screen.getByRole("heading", { name: "PHQ-9 Depression Screening" })).toBeInTheDocument();
    expect(screen.getByText("Screening answers")).toBeInTheDocument();
    expect(screen.getByText("Screening result")).toBeInTheDocument();
    expect(screen.getByText("Support notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Little interest or pleasure in doing things")).toHaveValue("1");
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/phq9-depression/about");
  });

  it("scores answers and saves the local PHQ-9 snapshot", () => {
    render(<Phq9DepressionWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Score PHQ-9" }));

    expect(screen.getByText("8 / 27")).toBeInTheDocument();
    expect(screen.getByText("Mild depression")).toBeInTheDocument();
    expect(screen.getAllByText("Screening only").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Save screening snapshot" }));

    expect(window.localStorage.getItem("toolars.phq9-depression.snapshot:v1")).toContain("\"answers\":[1,1,1,1,1,1,1,1,0]");
  });
});
