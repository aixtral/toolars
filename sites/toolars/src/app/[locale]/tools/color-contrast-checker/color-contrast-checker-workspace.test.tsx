import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { ColorContrastCheckerWorkspace } from "./color-contrast-checker-workspace";

describe("ColorContrastCheckerWorkspace", () => {
  it("renders native contrast checker controls", () => {
    renderWithIntl(<ColorContrastCheckerWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "color-contrast-checker");
    expect(screen.getByRole("heading", { name: "Color Contrast Checker" })).toBeInTheDocument();
    expect(screen.getByLabelText("Foreground color")).toBeInTheDocument();
    expect(screen.getByLabelText("Background color")).toBeInTheDocument();
  });

  it("reports WCAG ratio and AAA status locally", () => {
    renderWithIntl(<ColorContrastCheckerWorkspace />);

    fireEvent.change(screen.getByLabelText("Foreground color"), { target: { value: "#000000" } });
    fireEvent.change(screen.getByLabelText("Background color"), { target: { value: "#ffffff" } });
    fireEvent.click(screen.getByRole("button", { name: "Check contrast" }));

    expect(screen.getByText("21.00:1")).toBeInTheDocument();
    expect(screen.getAllByText("AAA normal").length).toBeGreaterThan(0);
    expect(screen.getAllByText("WCAG check ready").length).toBeGreaterThan(0);
  });
});
