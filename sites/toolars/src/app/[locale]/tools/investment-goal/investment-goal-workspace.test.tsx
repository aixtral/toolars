import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { InvestmentGoalWorkspace } from "./investment-goal-workspace";

describe("InvestmentGoalWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc investment goal workspace sections", () => {
    renderWithIntl(<InvestmentGoalWorkspace />);

    expect(screen.getByRole("heading", { name: "Investment Goal Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Goal inputs")).toBeInTheDocument();
    expect(screen.getByText("Monthly investment summary")).toBeInTheDocument();
    expect(screen.getByText("Market assumption notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Goal amount")).toHaveValue(500000);
    expect(screen.getByLabelText("Starting balance")).toHaveValue(10000);
    expect(screen.getByLabelText("Annual return")).toHaveValue(8);
    expect(screen.getByLabelText("Years to goal")).toHaveValue(20);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/investment-goal/about"
    );
  });

  it("calculates the default monthly investment and saves assumptions locally", () => {
    renderWithIntl(<InvestmentGoalWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate monthly investment" }));

    expect(screen.getByText("$765")).toBeInTheDocument();
    expect(screen.getByText("$193,654")).toBeInTheDocument();
    expect(screen.getByText("$49,268")).toBeInTheDocument();
    expect(screen.getByText("$450,732")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save goal plan" }));

    expect(window.localStorage.getItem("toolars.investment-goal.plan")).toContain("500000");
  });
});
