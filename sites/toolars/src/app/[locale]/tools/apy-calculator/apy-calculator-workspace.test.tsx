import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { ApyCalculatorWorkspace } from "./apy-calculator-workspace";

describe("ApyCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc APY workspace sections", () => {
    renderWithIntl(<ApyCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "APY Calculator" })).toBeInTheDocument();
    expect(screen.getByText("APY inputs")).toBeInTheDocument();
    expect(screen.getByText("Yield summary")).toBeInTheDocument();
    expect(screen.getByText("APY notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("5")).toBeInTheDocument();
    expect(screen.getByDisplayValue("12")).toBeInTheDocument();
    expect(screen.getByDisplayValue("10000")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/apy-calculator/about"
    );
  });

  it("calculates the default APY and saves assumptions locally", () => {
    renderWithIntl(<ApyCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate APY" }));

    expect(screen.getByText("5.12%")).toBeInTheDocument();
    expect(screen.getByText("5.00%")).toBeInTheDocument();
    expect(screen.getByText("$10,512")).toBeInTheDocument();
    expect(screen.getByText("$512")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save APY plan" }));

    expect(window.localStorage.getItem("toolars.apy-calculator.plan")).toContain("10000");
  });
});
