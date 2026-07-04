import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { SvgOptimizerWorkspace } from "./svg-optimizer-workspace";

describe("SvgOptimizerWorkspace", () => {
  it("renders native SVG optimizer controls and optimized markup", () => {
    renderWithIntl(<SvgOptimizerWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "svg-optimizer");
    fireEvent.change(screen.getByLabelText("SVG markup"), { target: { value: "<svg><!-- note --><metadata>x</metadata><path d=\"M0 0\" /></svg>" } });
    fireEvent.click(screen.getByRole("button", { name: "Optimize SVG" }));

    expect(screen.getByLabelText("Optimized SVG output")).not.toHaveTextContent("metadata");
  });
});
