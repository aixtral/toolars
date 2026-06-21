import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { BiologicalAgeWorkspace } from "./biological-age-workspace";

describe("BiologicalAgeWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc biological age workspace sections", () => {
    render(<BiologicalAgeWorkspace />);

    expect(screen.getByRole("heading", { name: "Biological Age Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Lifestyle inputs")).toBeInTheDocument();
    expect(screen.getByText("Biological age result")).toBeInTheDocument();
    expect(screen.getByText("Lifestyle notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Chronological age")).toHaveValue(35);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/biological-age/about");
  });

  it("calculates biological age and saves the lifestyle sample locally", () => {
    render(<BiologicalAgeWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate biological age" }));

    expect(screen.getByText("31 years")).toBeInTheDocument();
    expect(screen.getByText("4 years younger")).toBeInTheDocument();
    expect(screen.getByText("Keep up your healthy lifestyle!")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save lifestyle sample" }));

    expect(window.localStorage.getItem("toolars.biological-age.sample:v1")).toContain("\"chronologicalAge\":35");
  });
});
