import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { StockAverageWorkspace } from "./stock-average-workspace";

describe("StockAverageWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc stock average workspace sections", () => {
    renderWithIntl(<StockAverageWorkspace />);

    expect(screen.getByRole("heading", { name: "Stock Average Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Purchase lots")).toBeInTheDocument();
    expect(screen.getByText("Cost basis summary")).toBeInTheDocument();
    expect(screen.getByText("Cost-basis notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Lot 1 shares")).toHaveValue(100);
    expect(screen.getByLabelText("Lot 1 price per share")).toHaveValue(150);
    expect(screen.getByLabelText("Lot 2 shares")).toHaveValue(50);
    expect(screen.getByLabelText("Lot 2 price per share")).toHaveValue(120);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/stock-average/about"
    );
  });

  it("calculates the default stock average and saves assumptions locally", () => {
    renderWithIntl(<StockAverageWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate average" }));

    expect(screen.getAllByText("$140.00").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("150")).toBeInTheDocument();
    expect(screen.getByText("$21,000.00")).toBeInTheDocument();
    expect(screen.getAllByText("150 shares at $140.00 average").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Save stock plan" }));

    expect(window.localStorage.getItem("toolars.stock-average.plan")).toContain("150");
  });
});
