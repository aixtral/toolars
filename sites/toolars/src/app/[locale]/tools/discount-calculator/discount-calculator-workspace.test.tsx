import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { DiscountCalculatorWorkspace } from "./discount-calculator-workspace";

describe("DiscountCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc discount workspace sections", () => {
    renderWithIntl(<DiscountCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Discount Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Checkout inputs")).toBeInTheDocument();
    expect(screen.getByText("Final price summary")).toBeInTheDocument();
    expect(screen.getByText("Checkout notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Original price")).toHaveValue(100);
    expect(screen.getByLabelText("Discount percent")).toHaveValue(20);
    expect(screen.getByLabelText("Tax percent")).toHaveValue(8);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/discount-calculator/about"
    );
  });

  it("calculates the default checkout discount and saves assumptions locally", () => {
    renderWithIntl(<DiscountCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate discount" }));

    expect(screen.getByText("$86.40")).toBeInTheDocument();
    expect(screen.getByText("$20.00")).toBeInTheDocument();
    expect(screen.getByText("$6.40")).toBeInTheDocument();
    expect(screen.getAllByText("20% off $100.00").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Save discount" }));

    expect(window.localStorage.getItem("toolars.discount-calculator.plan")).toContain("100");
  });
});
