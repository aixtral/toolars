import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { BodyFatCalculatorWorkspace } from "./body-fat-calculator-workspace";

describe("BodyFatCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc body fat workspace sections", () => {
    renderWithIntl(<BodyFatCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Body Fat Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Measurement inputs")).toBeInTheDocument();
    expect(screen.getByText("Body composition result")).toBeInTheDocument();
    expect(screen.getByText("Measurement notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("85")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/body-fat-calculator/about"
    );
  });

  it("calculates body fat percentage and saves measurements locally", () => {
    renderWithIntl(<BodyFatCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate body fat" }));

    expect(screen.getByText("16.9%")).toBeInTheDocument();
    expect(screen.getByText("Fitness")).toBeInTheDocument();
    expect(screen.getByText("11.9 kg")).toBeInTheDocument();
    expect(screen.getByText("58.1 kg")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save measurements" }));

    expect(window.localStorage.getItem("toolars.body-fat-calculator.measurements")).toContain("85");
  });
});
