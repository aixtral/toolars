import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { HourlyToSalaryWorkspace } from "./hourly-to-salary-workspace";

describe("HourlyToSalaryWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc hourly to salary workspace sections", () => {
    renderWithIntl(<HourlyToSalaryWorkspace />);

    expect(screen.getByRole("heading", { name: "Hourly to Salary Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Wage inputs")).toBeInTheDocument();
    expect(screen.getByText("Salary estimate")).toBeInTheDocument();
    expect(screen.getByText("Gross pay notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Hourly rate")).toHaveValue(25);
    expect(screen.getByLabelText("Hours per week")).toHaveValue(40);
    expect(screen.getByLabelText("Weeks per year")).toHaveValue(52);
    expect(screen.getByLabelText("Overtime multiplier")).toHaveValue("2");
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/hourly-to-salary/about"
    );
  });

  it("calculates the default salary estimate and saves assumptions locally", () => {
    renderWithIntl(<HourlyToSalaryWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate salary" }));

    expect(screen.getByText("$52,000")).toBeInTheDocument();
    expect(screen.getByText("$4,333")).toBeInTheDocument();
    expect(screen.getByText("$1,000")).toBeInTheDocument();
    expect(screen.getAllByText("$25.00 x 40 hours/week x 52 weeks").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Save salary" }));

    expect(window.localStorage.getItem("toolars.hourly-to-salary.plan")).toContain("25");
  });
});
