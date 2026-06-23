import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { DebtPayoffWorkspace } from "./debt-payoff-workspace";

describe("DebtPayoffWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc debt payoff workspace sections", () => {
    renderWithIntl(<DebtPayoffWorkspace />);

    expect(screen.getByRole("heading", { name: "Debt Payoff Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Debt inputs")).toBeInTheDocument();
    expect(screen.getByText("Payoff summary")).toBeInTheDocument();
    expect(screen.getByText("Debt payoff notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("10000")).toBeInTheDocument();
    expect(screen.getByDisplayValue("18")).toBeInTheDocument();
    expect(screen.getByDisplayValue("300")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/debt-payoff/about"
    );
  });

  it("calculates the default payoff schedule and saves assumptions locally", () => {
    renderWithIntl(<DebtPayoffWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate payoff" }));

    expect(screen.getByText("47 months")).toBeInTheDocument();
    expect(screen.getByText("$3,967")).toBeInTheDocument();
    expect(screen.getByText("$13,967")).toBeInTheDocument();
    expect(screen.getByText("Month 1 principal $150 + interest $150")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save payoff plan" }));

    expect(window.localStorage.getItem("toolars.debt-payoff.plan")).toContain("10000");
  });
});
