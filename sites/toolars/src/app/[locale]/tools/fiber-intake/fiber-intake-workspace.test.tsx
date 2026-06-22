import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { FiberIntakeWorkspace } from "./fiber-intake-workspace";

describe("FiberIntakeWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc fiber intake workspace sections", () => {
    render(<FiberIntakeWorkspace />);

    expect(screen.getByRole("heading", { name: "Fiber Intake Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Profile inputs")).toBeInTheDocument();
    expect(screen.getByText("Fiber summary")).toBeInTheDocument();
    expect(screen.getByText("Fiber notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Weight (kg)")).toHaveValue(70);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/fiber-intake/about");
  });

  it("calculates the default fiber target and saves the profile locally", () => {
    render(<FiberIntakeWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate fiber needs" }));

    expect(screen.getByText("25 g")).toBeInTheDocument();
    expect(screen.getByText("25-28 g/day")).toBeInTheDocument();
    expect(screen.getAllByText("60%").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Save fiber profile" }));

    expect(window.localStorage.getItem("toolars.fiber-intake.profile:v1")).toContain("70");
  });
});
