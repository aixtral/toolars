import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { IncomeTaxWorkspace } from "./income-tax-workspace";

describe("IncomeTaxWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc income tax workspace sections", () => {
    renderWithIntl(<IncomeTaxWorkspace />);

    expect(screen.getByRole("heading", { name: "Income Tax Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Income inputs")).toBeInTheDocument();
    expect(screen.getByText("Take-home summary")).toBeInTheDocument();
    expect(screen.getByText("Tax context notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Monthly salary")).toHaveValue(5000);
    expect(screen.getByLabelText("Tax rate")).toHaveValue(20);
    expect(screen.getByLabelText("Monthly deduction")).toHaveValue(500);
    expect(screen.getByLabelText("Extra withheld")).toHaveValue(300);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/income-tax/about"
    );
  });

  it("calculates the default take-home estimate and saves assumptions locally", () => {
    renderWithIntl(<IncomeTaxWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate take-home" }));

    expect(screen.getByText("$3,800")).toBeInTheDocument();
    expect(screen.getByText("$900")).toBeInTheDocument();
    expect(screen.getByText("$800")).toBeInTheDocument();
    expect(screen.getByText("$45,600")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save tax plan" }));

    expect(window.localStorage.getItem("toolars.income-tax.plan")).toContain("5000");
  });
});
