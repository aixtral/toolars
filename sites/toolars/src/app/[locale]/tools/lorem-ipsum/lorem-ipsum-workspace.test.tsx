import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { LoremIpsumWorkspace } from "./lorem-ipsum-workspace";

describe("LoremIpsumWorkspace", () => {
  it("renders the native Toolars lorem ipsum workspace controls", () => {
    renderWithIntl(<LoremIpsumWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "lorem-ipsum");
    expect(screen.getByRole("heading", { name: "Lorem Ipsum Generator" })).toBeInTheDocument();
    expect(screen.getByText("Placeholder copy workbench")).toBeInTheDocument();
    expect(screen.getByLabelText("Paragraphs")).toHaveValue(3);
    expect(screen.getByLabelText("Words per paragraph")).toHaveValue(50);
    expect(screen.getByLabelText("Start with Lorem ipsum")).toBeChecked();
  });

  it("generates configured placeholder copy and enables copy-all", () => {
    renderWithIntl(<LoremIpsumWorkspace />);

    fireEvent.change(screen.getByLabelText("Paragraphs"), {
      target: { value: "2" }
    });
    fireEvent.change(screen.getByLabelText("Words per paragraph"), {
      target: { value: "12" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Generate copy" }));

    expect(screen.getByLabelText("Generated placeholder copy")).toHaveTextContent("Lorem ipsum dolor sit amet");
    expect(screen.getByText("2 paragraphs generated with 24 words.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy all" })).toBeEnabled();
  });
});
