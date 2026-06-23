import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { DividendReinvestmentWorkspace } from "./dividend-reinvestment-workspace";

describe("DividendReinvestmentWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc dividend reinvestment workspace sections", () => {
    renderWithIntl(<DividendReinvestmentWorkspace />);

    expect(screen.getByRole("heading", { name: "Dividend Reinvestment Calculator" })).toBeInTheDocument();
    expect(screen.getByText("DRIP inputs")).toBeInTheDocument();
    expect(screen.getByText("DRIP summary")).toBeInTheDocument();
    expect(screen.getByText("Dividend notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Initial investment")).toHaveValue(100000);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/dividend-reinvestment/about");
  });

  it("calculates the default DRIP projection and saves assumptions locally", () => {
    renderWithIntl(<DividendReinvestmentWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate DRIP" }));

    expect(screen.getByText("$522,226")).toBeInTheDocument();
    expect(screen.getByText("$204,731")).toBeInTheDocument();
    expect(screen.getByText("+$140,980")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save DRIP plan" }));

    expect(window.localStorage.getItem("toolars.dividend-reinvestment.plan")).toContain("100000");
  });
});
