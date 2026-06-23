import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { AlcoholMetabolismWorkspace } from "./alcohol-metabolism-workspace";

describe("AlcoholMetabolismWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc alcohol metabolism workspace sections", () => {
    renderWithIntl(<AlcoholMetabolismWorkspace />);

    expect(screen.getByRole("heading", { name: "Alcohol Metabolism Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Drink inputs")).toBeInTheDocument();
    expect(screen.getByText("BAC summary")).toBeInTheDocument();
    expect(screen.getByText("Safety notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Weight (kg)")).toHaveValue(70);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/alcohol-metabolism/about");
  });

  it("calculates alcohol metabolism and saves the scenario locally", () => {
    renderWithIntl(<AlcoholMetabolismWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate alcohol metabolism" }));

    expect(screen.getByText("103.962%")).toBeInTheDocument();
    expect(screen.getByText("49.5 g")).toBeInTheDocument();
    expect(screen.getByText("6,930 hours")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save alcohol scenario" }));

    expect(window.localStorage.getItem("toolars.alcohol-metabolism.scenario:v1")).toContain("beer");
  });
});
