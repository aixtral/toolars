import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { FireCalculatorWorkspace } from "./fire-calculator-workspace";

describe("FireCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc FIRE workspace sections", () => {
    renderWithIntl(<FireCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "FIRE Calculator" })).toBeInTheDocument();
    expect(screen.getByText("FIRE inputs")).toBeInTheDocument();
    expect(screen.getByText("FIRE summary")).toBeInTheDocument();
    expect(screen.getByText("No-advice notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Annual expenses")).toHaveValue(50000);
    expect(screen.getByLabelText("Annual income")).toHaveValue(100000);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/fire-calculator/about"
    );
  });

  it("calculates the default FIRE estimate and saves assumptions locally", () => {
    renderWithIntl(<FireCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate FIRE" }));

    expect(screen.getByText("$1,250,000")).toBeInTheDocument();
    expect(screen.getByText("50.0%")).toBeInTheDocument();
    expect(screen.getByText("12 years")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save FIRE plan" }));

    expect(window.localStorage.getItem("toolars.fire-calculator.plan")).toContain("50000");
  });
});
