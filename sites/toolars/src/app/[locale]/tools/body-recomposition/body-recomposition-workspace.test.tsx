import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { BodyRecompositionWorkspace } from "./body-recomposition-workspace";

describe("BodyRecompositionWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc body recomposition workspace sections", () => {
    renderWithIntl(<BodyRecompositionWorkspace />);

    expect(screen.getByRole("heading", { name: "Body Recomposition Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Recomposition inputs")).toBeInTheDocument();
    expect(screen.getByText("Recomp plan result")).toBeInTheDocument();
    expect(screen.getByText("Recomp notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("75")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/body-recomposition/about"
    );
  });

  it("calculates recomp calories and saves the plan locally", () => {
    renderWithIntl(<BodyRecompositionWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate recomp plan" }));

    expect(screen.getByText("2,383 kcal")).toBeInTheDocument();
    expect(screen.getByText("2,633 kcal")).toBeInTheDocument();
    expect(screen.getByText("150 g")).toBeInTheDocument();
    expect(screen.getByText("293 g")).toBeInTheDocument();
    expect(screen.getByText("25% protein / 49% carbs / 26% fat")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save recomp plan" }));

    expect(window.localStorage.getItem("toolars.body-recomposition.plan")).toContain("75");
  });
});
