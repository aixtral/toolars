import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { SideIncomeTaxWorkspace } from "./side-income-tax-workspace";

describe("SideIncomeTaxWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc side-income tax workspace sections", () => {
    renderWithIntl(<SideIncomeTaxWorkspace />);

    expect(screen.getByRole("heading", { name: "Side Income Tax Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Side income inputs")).toBeInTheDocument();
    expect(screen.getByText("Tax estimate summary")).toBeInTheDocument();
    expect(screen.getByText("Tax planning notes")).toBeInTheDocument();
    expect(screen.getByLabelText("W-2 salary")).toHaveValue(80000);
    expect(screen.getByLabelText("Side income")).toHaveValue(30000);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/side-income-tax/about"
    );
  });

  it("calculates the default side-income estimate and saves assumptions locally", () => {
    renderWithIntl(<SideIncomeTaxWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate side tax" }));

    expect(screen.getByText("$3,532")).toBeInTheDocument();
    expect(screen.getByText("$17,264")).toBeInTheDocument();
    expect(screen.getByText("19.8%")).toBeInTheDocument();
    expect(screen.getByText("$5,199")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save tax estimate" }));

    expect(window.localStorage.getItem("toolars.side-income-tax.plan")).toContain("30000");
  });
});
