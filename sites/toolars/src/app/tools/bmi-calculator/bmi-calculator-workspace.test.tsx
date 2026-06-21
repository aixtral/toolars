import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { BmiCalculatorWorkspace } from "./bmi-calculator-workspace";

describe("BmiCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc BMI workspace sections", () => {
    render(<BmiCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "BMI Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Body metrics")).toBeInTheDocument();
    expect(screen.getByText("BMI result")).toBeInTheDocument();
    expect(screen.getByText("Health reference notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("175")).toBeInTheDocument();
    expect(screen.getByDisplayValue("70")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/bmi-calculator/about"
    );
  });

  it("calculates the default BMI and reference summary", () => {
    render(<BmiCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate BMI" }));

    expect(screen.getByText("22.9")).toBeInTheDocument();
    expect(screen.getByText("Normal")).toBeInTheDocument();
    expect(screen.getByText("56.7-76.3 kg")).toBeInTheDocument();
    expect(screen.getByText("BMI 22.9 - Normal range")).toBeInTheDocument();
    expect(screen.getByText("Healthy range")).toBeInTheDocument();
  });

  it("updates the profile and saves it locally", () => {
    render(<BmiCalculatorWorkspace />);

    fireEvent.change(screen.getByLabelText("Weight"), {
      target: { value: "82" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Save profile" }));

    expect(screen.getByLabelText("Weight")).toHaveValue(82);
    expect(window.localStorage.getItem("toolars.bmi-calculator.profile")).toContain("82");
  });
});
