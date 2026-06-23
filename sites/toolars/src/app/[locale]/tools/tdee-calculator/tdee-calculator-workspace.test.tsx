import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { TdeeCalculatorWorkspace } from "./tdee-calculator-workspace";

describe("TdeeCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc TDEE workspace sections", () => {
    renderWithIntl(<TdeeCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "TDEE Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Energy inputs")).toBeInTheDocument();
    expect(screen.getByText("Daily energy result")).toBeInTheDocument();
    expect(screen.getByText("Nutrition planning notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1500")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/tdee-calculator/about"
    );
  });

  it("calculates the default TDEE targets and saves the profile locally", () => {
    renderWithIntl(<TdeeCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate TDEE" }));

    expect(screen.getByText("2,325")).toBeInTheDocument();
    expect(screen.getByText("825 kcal")).toBeInTheDocument();
    expect(screen.getByText("1,825")).toBeInTheDocument();
    expect(screen.getByText("2,575")).toBeInTheDocument();
    expect(screen.getByText("BMR 1,500 × activity 1.55")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save profile" }));

    expect(window.localStorage.getItem("toolars.tdee-calculator.profile")).toContain("1500");
  });
});
