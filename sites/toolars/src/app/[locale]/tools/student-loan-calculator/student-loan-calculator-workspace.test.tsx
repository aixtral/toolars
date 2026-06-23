import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { StudentLoanCalculatorWorkspace } from "./student-loan-calculator-workspace";

describe("StudentLoanCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc student loan workspace sections", () => {
    renderWithIntl(<StudentLoanCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Student Loan Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Repayment inputs")).toBeInTheDocument();
    expect(screen.getByText("Repayment summary")).toBeInTheDocument();
    expect(screen.getByText("Repayment notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Loan amount")).toHaveValue(50000);
    expect(screen.getByLabelText("Grace period")).toHaveValue("6");
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/student-loan-calculator/about"
    );
  });

  it("calculates the default student loan repayment plan and saves assumptions locally", () => {
    renderWithIntl(<StudentLoanCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate repayment plan" }));

    expect(screen.getByText("$543")).toBeInTheDocument();
    expect(screen.getByText("$15,116")).toBeInTheDocument();
    expect(screen.getByText("$65,116")).toBeInTheDocument();
    expect(screen.getByText("Repayment starts after 6 months grace period")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save repayment plan" }));

    expect(window.localStorage.getItem("toolars.student-loan-calculator.plan")).toContain("50000");
  });
});
