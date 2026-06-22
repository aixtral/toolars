import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { MacroCalculatorWorkspace } from "./macro-calculator-workspace";

describe("MacroCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc macro workspace sections", () => {
    render(<MacroCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Macro Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Macro inputs")).toBeInTheDocument();
    expect(screen.getByText("Macro result")).toBeInTheDocument();
    expect(screen.getByText("Macro notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2200")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/macro-calculator/about"
    );
  });

  it("calculates macro grams and saves the split locally", () => {
    render(<MacroCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate macros" }));

    expect(screen.getByText("165 g")).toBeInTheDocument();
    expect(screen.getByText("220 g")).toBeInTheDocument();
    expect(screen.getByText("73 g")).toBeInTheDocument();
    expect(screen.getByText("30% protein / 40% carbs / 30% fat")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save macro split" }));

    expect(window.localStorage.getItem("toolars.macro-calculator.split")).toContain("2200");
  });
});
