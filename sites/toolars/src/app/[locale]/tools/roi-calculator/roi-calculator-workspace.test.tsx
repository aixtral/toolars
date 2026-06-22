import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { RoiCalculatorWorkspace } from "./roi-calculator-workspace";

describe("RoiCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc ROI workspace sections", () => {
    render(<RoiCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "ROI Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Return inputs")).toBeInTheDocument();
    expect(screen.getByText("ROI summary")).toBeInTheDocument();
    expect(screen.getByText("Comparison notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Investment cost")).toHaveValue(10000);
    expect(screen.getByLabelText("Final value")).toHaveValue(15000);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/roi-calculator/about"
    );
  });

  it("calculates the default ROI and saves assumptions locally", () => {
    render(<RoiCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate ROI" }));

    expect(screen.getByText("50.00%")).toBeInTheDocument();
    expect(screen.getByText("+$5,000")).toBeInTheDocument();
    expect(screen.getByText("$15,000")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save ROI case" }));

    expect(window.localStorage.getItem("toolars.roi-calculator.plan")).toContain("15000");
  });
});
