import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ProteinCalculatorWorkspace } from "./protein-calculator-workspace";

describe("ProteinCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc protein workspace sections", () => {
    render(<ProteinCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Protein Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Nutrition inputs")).toBeInTheDocument();
    expect(screen.getByText("Protein result")).toBeInTheDocument();
    expect(screen.getByText("Nutrition notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("70")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/protein-calculator/about"
    );
  });

  it("calculates daily protein needs and saves the plan locally", () => {
    render(<ProteinCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate protein" }));

    expect(screen.getByText("112 g")).toBeInTheDocument();
    expect(screen.getByText("37 g")).toBeInTheDocument();
    expect(screen.getByText("19 eggs")).toBeInTheDocument();
    expect(screen.getByText("362 g")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save protein plan" }));

    expect(window.localStorage.getItem("toolars.protein-calculator.plan")).toContain("70");
  });
});
