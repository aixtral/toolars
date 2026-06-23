import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { CryptoTaxWorkspace } from "./crypto-tax-workspace";

describe("CryptoTaxWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc crypto tax workspace sections", () => {
    renderWithIntl(<CryptoTaxWorkspace />);

    expect(screen.getByRole("heading", { name: "Crypto Tax Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Transaction inputs")).toBeInTheDocument();
    expect(screen.getByText("PnL summary")).toBeInTheDocument();
    expect(screen.getByText("Crypto tax notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Buy 1 price")).toHaveValue(30000);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/crypto-tax/about");
  });

  it("calculates the default PnL and saves transactions locally", () => {
    renderWithIntl(<CryptoTaxWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate crypto PnL" }));

    expect(screen.getByText("$33,333.33")).toBeInTheDocument();
    expect(screen.getByText("$8,000.00")).toBeInTheDocument();
    expect(screen.getByText("$7,500.00")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save transactions" }));

    expect(window.localStorage.getItem("toolars.crypto-tax.transactions:v1")).toContain("30000");
  });
});
