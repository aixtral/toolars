import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { HomeAffordabilityCalculatorWorkspace } from "./home-affordability-calculator-workspace";

describe("HomeAffordabilityCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc home affordability workspace sections", () => {
    renderWithIntl(<HomeAffordabilityCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Home Affordability Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Affordability inputs")).toBeInTheDocument();
    expect(screen.getByText("Affordability summary")).toBeInTheDocument();
    expect(screen.getByText("Mortgage readiness notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Monthly household income")).toHaveValue(20000);
    expect(screen.getByLabelText("Debt-to-income limit")).toHaveValue("0.35");
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/home-affordability-calculator/about"
    );
  });

  it("calculates the default affordability estimate and saves assumptions locally", () => {
    renderWithIntl(<HomeAffordabilityCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate affordability" }));

    expect(screen.getByText("¥214.6万")).toBeInTheDocument();
    expect(screen.getByText("¥7,000")).toBeInTheDocument();
    expect(screen.getByText("35.0%")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save affordability case" }));

    expect(window.localStorage.getItem("toolars.home-affordability-calculator.plan")).toContain("20000");
  });
});
