import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { IdealWeightCalculatorWorkspace } from "./ideal-weight-calculator-workspace";

describe("IdealWeightCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc ideal weight workspace sections", () => {
    renderWithIntl(<IdealWeightCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Ideal Weight Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Body inputs")).toBeInTheDocument();
    expect(screen.getByText("Ideal weight result")).toBeInTheDocument();
    expect(screen.getByText("Body reference notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Height (cm)")).toHaveValue(175);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/ideal-weight-calculator/about");
  });

  it("calculates ideal weight and saves the body profile locally", () => {
    renderWithIntl(<IdealWeightCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate ideal weight" }));

    expect(screen.getByText("70.6 kg")).toBeInTheDocument();
    expect(screen.getByText("63.5 kg")).toBeInTheDocument();
    expect(screen.getByText("77.7 kg")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save body profile" }));

    expect(window.localStorage.getItem("toolars.ideal-weight-calculator.profile:v1")).toContain("\"heightCm\":175");
  });
});
