import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { TipCalculatorWorkspace } from "./tip-calculator-workspace";

describe("TipCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc tip workspace sections", () => {
    render(<TipCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Tip Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Tip inputs")).toBeInTheDocument();
    expect(screen.getByText("Tip and split summary")).toBeInTheDocument();
    expect(screen.getByText("Tipping notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Bill amount")).toHaveValue(85.5);
    expect(screen.getByLabelText("Tip percent")).toHaveValue(18);
    expect(screen.getByLabelText("People")).toHaveValue(2);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/tip-calculator/about"
    );
  });

  it("calculates the default tip split and saves assumptions locally", () => {
    render(<TipCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate tip" }));

    expect(screen.getByText("$100.89")).toBeInTheDocument();
    expect(screen.getByText("$15.39")).toBeInTheDocument();
    expect(screen.getByText("$50.45")).toBeInTheDocument();
    expect(screen.getAllByText("18% tip across 2 people").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Save split" }));

    expect(window.localStorage.getItem("toolars.tip-calculator.plan")).toContain("85.5");
  });
});
