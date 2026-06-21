import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { CaffeineCalculatorWorkspace } from "./caffeine-calculator-workspace";

describe("CaffeineCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc caffeine workspace sections", () => {
    render(<CaffeineCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Caffeine Safe Limit Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Caffeine inputs")).toBeInTheDocument();
    expect(screen.getByText("Allowance summary")).toBeInTheDocument();
    expect(screen.getByText("Caffeine notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Weight (kg)")).toHaveValue(70);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/caffeine-calculator/about");
  });

  it("calculates caffeine allowance and saves selected drinks locally", () => {
    render(<CaffeineCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate safe limit" }));

    expect(screen.getByText("399 mg")).toBeInTheDocument();
    expect(screen.getByText("175 mg")).toBeInTheDocument();
    expect(screen.getByText("224 mg")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save caffeine plan" }));

    expect(window.localStorage.getItem("toolars.caffeine-calculator.plan:v1")).toContain("blackCoffee");
  });
});
