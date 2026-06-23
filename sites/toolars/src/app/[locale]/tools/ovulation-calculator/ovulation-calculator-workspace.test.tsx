import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { OvulationCalculatorWorkspace } from "./ovulation-calculator-workspace";

describe("OvulationCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc ovulation workspace sections", () => {
    renderWithIntl(<OvulationCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Ovulation Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Cycle inputs")).toBeInTheDocument();
    expect(screen.getByText("Cycle result")).toBeInTheDocument();
    expect(screen.getByText("Cycle notes")).toBeInTheDocument();
    expect(screen.getByLabelText("First day of last period")).toHaveValue("2026-06-01");
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/ovulation-calculator/about");
  });

  it("calculates the default fertile window and saves the cycle locally", () => {
    renderWithIntl(<OvulationCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate cycle" }));

    expect(screen.getAllByText("Jun 15").length).toBeGreaterThan(0);
    expect(screen.getByText("Jun 10 - Jun 16")).toBeInTheDocument();
    expect(screen.getByText("Jun 29")).toBeInTheDocument();
    expect(screen.getByText("Jun 17 - Jun 28")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save cycle" }));

    expect(window.localStorage.getItem("toolars.ovulation-calculator.cycle:v1")).toContain("2026-06-01");
  });
});
