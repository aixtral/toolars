import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { CodeToImageWorkspace } from "./code-to-image-workspace";

describe("CodeToImageWorkspace", () => {
  it("renders native code image controls and SVG output", () => {
    renderWithIntl(<CodeToImageWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "code-to-image");
    fireEvent.change(screen.getByLabelText("Code snippet"), { target: { value: "const ok = true;" } });
    fireEvent.click(screen.getByRole("button", { name: "Generate image preview" }));

    expect(screen.getByLabelText("Code image SVG output")).toHaveTextContent("<svg");
  });
});
