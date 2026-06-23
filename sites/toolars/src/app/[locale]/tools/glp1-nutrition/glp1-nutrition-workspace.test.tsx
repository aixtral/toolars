import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { Glp1NutritionWorkspace } from "./glp1-nutrition-workspace";

describe("Glp1NutritionWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the local VitalCalc GLP-1 nutrition workspace sections", () => {
    renderWithIntl(<Glp1NutritionWorkspace />);

    expect(screen.getByRole("heading", { name: "GLP-1 Nutrition Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Nutrition inputs")).toBeInTheDocument();
    expect(screen.getByText("Nutrition targets")).toBeInTheDocument();
    expect(screen.getByText("Medication notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Weight (kg)")).toHaveValue(70);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/glp1-nutrition/about");
  });

  it("calculates targets and saves the local nutrition plan", () => {
    renderWithIntl(<Glp1NutritionWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate nutrition targets" }));

    expect(screen.getByText("1,642 kcal")).toBeInTheDocument();
    expect(screen.getByText("98 g")).toBeInTheDocument();
    expect(screen.getByText("2,450 ml")).toBeInTheDocument();
    expect(screen.getByText("25 g")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save nutrition plan" }));

    expect(window.localStorage.getItem("toolars.glp1-nutrition.plan:v1")).toContain("\"weightKg\":70");
  });
});
