import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { BloodSugarCalculatorWorkspace } from "./blood-sugar-calculator-workspace";

describe("BloodSugarCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc blood sugar workspace sections", () => {
    render(<BloodSugarCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Blood Sugar / A1C Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Lab inputs")).toBeInTheDocument();
    expect(screen.getByText("Blood sugar summary")).toBeInTheDocument();
    expect(screen.getByText("Blood sugar notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Fasting glucose")).toHaveValue(5.5);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/blood-sugar-calculator/about");
  });

  it("converts the default fasting glucose value and saves it locally", () => {
    render(<BloodSugarCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Convert blood sugar" }));

    expect(screen.getByText("5.5 mmol/L")).toBeInTheDocument();
    expect(screen.getByText("5.1%")).toBeInTheDocument();
    expect(screen.getByText("99 mg/dL")).toBeInTheDocument();
    expect(screen.getByText("Normal range")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save lab values" }));

    expect(window.localStorage.getItem("toolars.blood-sugar-calculator.values")).toContain("5.5");
  });
});
