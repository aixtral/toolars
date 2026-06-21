import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { InvestmentFeeWorkspace } from "./investment-fee-workspace";

describe("InvestmentFeeWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc investment fee workspace sections", () => {
    render(<InvestmentFeeWorkspace />);

    expect(screen.getByRole("heading", { name: "Investment Fee Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Fee drag inputs")).toBeInTheDocument();
    expect(screen.getByText("Fee impact summary")).toBeInTheDocument();
    expect(screen.getByText("Fee context notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Initial investment")).toHaveValue(10000);
    expect(screen.getByLabelText("Monthly contribution")).toHaveValue(500);
    expect(screen.getByLabelText("Expected annual return")).toHaveValue(7);
    expect(screen.getByLabelText("Investment period")).toHaveValue(30);
    expect(screen.getByLabelText("Annual management fee")).toHaveValue(1);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/investment-fee/about"
    );
  });

  it("calculates the default fee drag and saves assumptions locally", () => {
    render(<InvestmentFeeWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate fee impact" }));

    expect(screen.getByText("$128,667")).toBeInTheDocument();
    expect(screen.getByText("$691,150")).toBeInTheDocument();
    expect(screen.getByText("$562,483")).toBeInTheDocument();
    expect(screen.getByText("18.6%")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save fee scenario" }));

    expect(window.localStorage.getItem("toolars.investment-fee.plan")).toContain("10000");
  });
});
