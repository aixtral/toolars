import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { CurrencyConverterWorkspace } from "./currency-converter-workspace";

describe("CurrencyConverterWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc currency converter workspace sections", () => {
    renderWithIntl(<CurrencyConverterWorkspace />);

    expect(screen.getByRole("heading", { name: "Currency Converter" })).toBeInTheDocument();
    expect(screen.getByText("Exchange inputs")).toBeInTheDocument();
    expect(screen.getByText("Converted amount summary")).toBeInTheDocument();
    expect(screen.getByText("Rate freshness notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Amount")).toHaveValue(1000);
    expect(screen.getByLabelText("Exchange rate")).toHaveValue(0.85);
    expect(screen.getByLabelText("From currency")).toHaveValue("USD");
    expect(screen.getByLabelText("To currency")).toHaveValue("EUR");
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/currency-converter/about"
    );
  });

  it("converts the default currency amount and saves assumptions locally", () => {
    renderWithIntl(<CurrencyConverterWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Convert currency" }));

    expect(screen.getByText("€850.00 EUR")).toBeInTheDocument();
    expect(screen.getByText("$1,000.00 USD")).toBeInTheDocument();
    expect(screen.getAllByText("1 USD = 0.85 EUR").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Save conversion" }));

    expect(window.localStorage.getItem("toolars.currency-converter.plan")).toContain("USD");
  });
});
