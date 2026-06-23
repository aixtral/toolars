import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { BillSplitCalculatorWorkspace } from "./bill-split-calculator-workspace";

describe("BillSplitCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc bill split workspace sections", () => {
    renderWithIntl(<BillSplitCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Bill Split Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Bill inputs")).toBeInTheDocument();
    expect(screen.getByText("Group split summary")).toBeInTheDocument();
    expect(screen.getByText("Split notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Subtotal")).toHaveValue(120);
    expect(screen.getByLabelText("People")).toHaveValue(4);
    expect(screen.getByLabelText("Tip percent")).toHaveValue(18);
    expect(screen.getByLabelText("Tax percent")).toHaveValue(8.25);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/bill-split-calculator/about"
    );
  });

  it("calculates the default split and saves assumptions locally", () => {
    renderWithIntl(<BillSplitCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate split" }));

    expect(screen.getByText("$151.50")).toBeInTheDocument();
    expect(screen.getByText("$37.88")).toBeInTheDocument();
    expect(screen.getByText("$31.50")).toBeInTheDocument();
    expect(screen.getAllByText("4 people, 18% tip, 8.25% tax").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Save bill" }));

    expect(window.localStorage.getItem("toolars.bill-split-calculator.plan")).toContain("120");
  });
});
