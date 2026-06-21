import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { Pss10StressWorkspace } from "./pss10-stress-workspace";

describe("Pss10StressWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc PSS-10 workspace sections", () => {
    render(<Pss10StressWorkspace />);

    expect(screen.getByRole("heading", { name: "PSS-10 Stress Screening" })).toBeInTheDocument();
    expect(screen.getByText("Screening answers")).toBeInTheDocument();
    expect(screen.getByText("Stress result")).toBeInTheDocument();
    expect(screen.getByText("Support notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Upset because of something unexpected")).toHaveValue("2");
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/pss10-stress/about");
  });

  it("scores answers and saves the local PSS-10 snapshot", () => {
    render(<Pss10StressWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Score PSS-10" }));

    expect(screen.getByText("20 / 40")).toBeInTheDocument();
    expect(screen.getByText("Moderate stress")).toBeInTheDocument();
    expect(screen.getAllByText("Screening only").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Save stress snapshot" }));

    expect(window.localStorage.getItem("toolars.pss10-stress.snapshot:v1")).toContain("\"answers\":[2,2,2,2,2,2,2,2,2,2]");
  });
});
