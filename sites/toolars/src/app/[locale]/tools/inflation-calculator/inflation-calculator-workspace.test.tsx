import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { InflationCalculatorWorkspace } from "./inflation-calculator-workspace";

describe("InflationCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc inflation workspace sections", () => {
    render(<InflationCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Inflation Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Inflation inputs")).toBeInTheDocument();
    expect(screen.getByText("Purchasing power summary")).toBeInTheDocument();
    expect(screen.getByText("Assumption notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Current amount")).toHaveValue(1000);
    expect(screen.getByLabelText("Annual inflation rate")).toHaveValue(3);
    expect(screen.getByLabelText("Years")).toHaveValue(10);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/inflation-calculator/about"
    );
  });

  it("calculates the default purchasing-power scenario and saves assumptions locally", () => {
    render(<InflationCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate inflation" }));

    expect(screen.getByText("$744")).toBeInTheDocument();
    expect(screen.getByText("$1,000")).toBeInTheDocument();
    expect(screen.getByText("$256")).toBeInTheDocument();
    expect(screen.getByText("34.4%")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save scenario" }));

    expect(window.localStorage.getItem("toolars.inflation-calculator.plan")).toContain("1000");
  });
});
