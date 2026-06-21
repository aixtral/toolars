import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { DtiCalculatorWorkspace } from "./dti-calculator-workspace";

describe("DtiCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc DTI workspace sections", () => {
    render(<DtiCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Debt-to-Income Calculator" })).toBeInTheDocument();
    expect(screen.getByText("DTI inputs")).toBeInTheDocument();
    expect(screen.getByText("DTI summary")).toBeInTheDocument();
    expect(screen.getByText("DTI notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("8000")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2500")).toBeInTheDocument();
    expect(screen.getByDisplayValue("800")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/dti-calculator/about"
    );
  });

  it("calculates the default DTI ratios and saves assumptions locally", () => {
    render(<DtiCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate DTI" }));

    expect(screen.getByText("47.5%")).toBeInTheDocument();
    expect(screen.getByText("37.5%")).toBeInTheDocument();
    expect(screen.getByText("$3,800")).toBeInTheDocument();
    expect(screen.getByText("$4,200")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save DTI plan" }));

    expect(window.localStorage.getItem("toolars.dti-calculator.plan")).toContain("8000");
  });
});
