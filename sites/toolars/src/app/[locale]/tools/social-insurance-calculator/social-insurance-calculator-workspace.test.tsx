import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { SocialInsuranceCalculatorWorkspace } from "./social-insurance-calculator-workspace";

describe("SocialInsuranceCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc social insurance workspace sections", () => {
    render(<SocialInsuranceCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "China Social Insurance Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Salary assumptions")).toBeInTheDocument();
    expect(screen.getByText("Contribution summary")).toBeInTheDocument();
    expect(screen.getByText("Policy notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Monthly pre-tax salary")).toHaveValue(15000);
    expect(screen.getByLabelText("Housing fund rate")).toHaveValue("0.12");
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/social-insurance-calculator/about"
    );
  });

  it("calculates the default contribution estimate and saves assumptions locally", () => {
    render(<SocialInsuranceCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate contributions" }));

    expect(screen.getByText("¥1.12万")).toBeInTheDocument();
    expect(screen.getByText("¥3,375")).toBeInTheDocument();
    expect(screen.getByText("¥5,670")).toBeInTheDocument();
    expect(screen.getByText("¥453")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save payroll case" }));

    expect(window.localStorage.getItem("toolars.social-insurance-calculator.plan")).toContain("15000");
  });
});
