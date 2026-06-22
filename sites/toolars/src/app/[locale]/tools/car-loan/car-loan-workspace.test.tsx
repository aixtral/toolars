import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { CarLoanWorkspace } from "./car-loan-workspace";

describe("CarLoanWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc car loan workspace sections", () => {
    render(<CarLoanWorkspace />);

    expect(screen.getByRole("heading", { name: "Car Loan Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Vehicle loan inputs")).toBeInTheDocument();
    expect(screen.getByText("Loan cost summary")).toBeInTheDocument();
    expect(screen.getByText("Ownership notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Vehicle price")).toHaveValue(25000);
    expect(screen.getByLabelText("Loan term")).toHaveValue("60");
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/car-loan/about"
    );
  });

  it("calculates the default car loan estimate and saves assumptions locally", () => {
    render(<CarLoanWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate car loan" }));

    expect(screen.getByText("$377")).toBeInTheDocument();
    expect(screen.getByText("$20,000")).toBeInTheDocument();
    expect(screen.getByText("$2,645")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save car loan" }));

    expect(window.localStorage.getItem("toolars.car-loan.plan")).toContain("25000");
  });
});
