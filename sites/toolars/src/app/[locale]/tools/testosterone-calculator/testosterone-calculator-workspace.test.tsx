import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { TestosteroneCalculatorWorkspace } from "./testosterone-calculator-workspace";

describe("TestosteroneCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc testosterone workspace sections", () => {
    renderWithIntl(<TestosteroneCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Testosterone Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Lab inputs")).toBeInTheDocument();
    expect(screen.getByText("Hormone result")).toBeInTheDocument();
    expect(screen.getByText("Clinical notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Total testosterone")).toHaveValue(500);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/testosterone-calculator/about");
  });

  it("calculates the source estimate and saves lab values locally", () => {
    renderWithIntl(<TestosteroneCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate testosterone" }));

    expect(screen.getByText("0.0 ng/dL")).toBeInTheDocument();
    expect(screen.getByText("150.0 ng/dL")).toBeInTheDocument();
    expect(screen.getByText("Low")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save lab values" }));

    expect(window.localStorage.getItem("toolars.testosterone-calculator.lab:v1")).toContain("\"totalTestosterone\":500");
  });
});
