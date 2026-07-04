import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { ImageResizerWorkspace } from "./image-resizer-workspace";

describe("ImageResizerWorkspace", () => {
  it("renders native resize controls and aspect-ratio output", () => {
    renderWithIntl(<ImageResizerWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "image-resizer");
    fireEvent.change(screen.getByLabelText("Target width"), { target: { value: "600" } });
    fireEvent.click(screen.getByRole("button", { name: "Calculate resize" }));

    expect(screen.getByLabelText("Resize summary")).toHaveTextContent("600 x 400");
  });
});
