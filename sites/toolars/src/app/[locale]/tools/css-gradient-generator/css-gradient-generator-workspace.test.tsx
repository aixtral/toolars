import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { CssGradientGeneratorWorkspace } from "./css-gradient-generator-workspace";

describe("CssGradientGeneratorWorkspace", () => {
  it("renders native CSS gradient controls", () => {
    renderWithIntl(<CssGradientGeneratorWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "css-gradient-generator");
    expect(screen.getByRole("heading", { name: "CSS Gradient Generator" })).toBeInTheDocument();
    expect(screen.getByLabelText("First color")).toBeInTheDocument();
    expect(screen.getByLabelText("Second color")).toBeInTheDocument();
    expect(screen.getByLabelText("Angle")).toBeInTheDocument();
  });

  it("generates copy-ready linear-gradient CSS locally", () => {
    renderWithIntl(<CssGradientGeneratorWorkspace />);

    fireEvent.change(screen.getByLabelText("First color"), { target: { value: "#0f172a" } });
    fireEvent.change(screen.getByLabelText("Second color"), { target: { value: "#14b8a6" } });
    fireEvent.change(screen.getByLabelText("Angle"), { target: { value: "135" } });
    fireEvent.click(screen.getByRole("button", { name: "Generate gradient" }));

    expect(screen.getByLabelText("Gradient CSS output")).toHaveTextContent(
      "background: linear-gradient(135deg, #0f172a 0%, #14b8a6 100%);"
    );
  });
});
