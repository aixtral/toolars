import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { CssAnimationGeneratorWorkspace } from "./css-animation-generator-workspace";

describe("CssAnimationGeneratorWorkspace", () => {
  it("renders native CSS animation controls and generated keyframes", () => {
    renderWithIntl(<CssAnimationGeneratorWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "css-animation-generator");
    fireEvent.change(screen.getByLabelText("Animation name"), { target: { value: "fade-in" } });
    fireEvent.click(screen.getByRole("button", { name: "Generate animation CSS" }));

    expect(screen.getByLabelText("CSS animation output")).toHaveTextContent("@keyframes fade-in");
    expect(screen.getByTestId("css-animation-preview")).toHaveStyle({
      animation: "fade-in 600ms ease-out 0ms 1 normal both"
    });
  });
});
