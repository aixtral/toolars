import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { ThirtyThirtyThirtyMethodWorkspace } from "./30-30-30-method-workspace";

describe("ThirtyThirtyThirtyMethodWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc 30-30-30 workspace sections", () => {
    renderWithIntl(<ThirtyThirtyThirtyMethodWorkspace />);

    expect(screen.getByRole("heading", { name: "30-30-30 Morning Method" })).toBeInTheDocument();
    expect(screen.getByText("Morning inputs")).toBeInTheDocument();
    expect(screen.getByText("Routine result")).toBeInTheDocument();
    expect(screen.getByText("Routine notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Weight (kg)")).toHaveValue(70);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/30-30-30-method/about");
  });

  it("calculates the routine and saves the local morning plan", () => {
    renderWithIntl(<ThirtyThirtyThirtyMethodWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate routine" }));

    expect(screen.getByText("30 g")).toBeInTheDocument();
    expect(screen.getByText("123 kcal")).toBeInTheDocument();
    expect(screen.getAllByText("Brisk walk").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Save morning plan" }));

    expect(window.localStorage.getItem("toolars.30-30-30-method.plan:v1")).toContain("\"weightKg\":70");
  });
});
