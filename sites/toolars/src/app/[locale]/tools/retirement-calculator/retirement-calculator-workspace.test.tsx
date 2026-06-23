import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { RetirementCalculatorWorkspace } from "./retirement-calculator-workspace";

describe("RetirementCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc retirement workspace sections", () => {
    renderWithIntl(<RetirementCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Retirement Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Retirement inputs")).toBeInTheDocument();
    expect(screen.getByText("Retirement outlook")).toBeInTheDocument();
    expect(screen.getByText("Retirement notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("35")).toBeInTheDocument();
    expect(screen.getByDisplayValue("65")).toBeInTheDocument();
    expect(screen.getByDisplayValue("50000")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/retirement-calculator/about"
    );
  });

  it("calculates the default retirement projection and saves assumptions locally", () => {
    renderWithIntl(<RetirementCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate retirement" }));

    expect(screen.getByText("$1,200,000")).toBeInTheDocument();
    expect(screen.getByText("$1,625,796")).toBeInTheDocument();
    expect(screen.getByText("+$425,796")).toBeInTheDocument();
    expect(screen.getByText("Year 1 balance $66,007 with $62,000 contributed")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save retirement plan" }));

    expect(window.localStorage.getItem("toolars.retirement-calculator.plan")).toContain("35");
  });
});
