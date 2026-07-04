import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { SystemPromptCompressorWorkspace } from "./system-prompt-compressor-workspace";

describe("SystemPromptCompressorWorkspace", () => {
  it("renders the Toolars prompt compression workspace sections", () => {
    renderWithIntl(<SystemPromptCompressorWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "system-prompt-compressor");
    expect(screen.getByRole("heading", { name: "System Prompt Compressor" })).toBeInTheDocument();
    expect(screen.getByText("Prompt compression")).toBeInTheDocument();
    expect(screen.getByText("Compression results")).toBeInTheDocument();
    expect(screen.getByText("Rewrite suggestions")).toBeInTheDocument();
    expect(screen.getByText("Compressed prompt")).toBeInTheDocument();
    expect(screen.getByLabelText("System prompt")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Compress prompt" })).toBeDisabled();
  });

  it("compresses verbose prompt text locally", () => {
    renderWithIntl(<SystemPromptCompressorWorkspace />);

    fireEvent.change(screen.getByLabelText("System prompt"), {
      target: {
        value:
          "You are an AI assistant that please please respond in order to help. It is important to note that follow policy."
      }
    });
    fireEvent.click(screen.getByRole("button", { name: "Compress prompt" }));

    expect(screen.getByText("Tokens saved")).toBeInTheDocument();
    expect(screen.getByText("Local compression only; prompt text stays in the browser.")).toBeInTheDocument();
    expect(screen.getByText(/You please respond to help/)).toBeInTheDocument();
    expect(screen.getByText("Redundancy")).toBeInTheDocument();
    expect(screen.getAllByText("Verbose phrase").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Filler phrase")).toBeInTheDocument();
  });
});
