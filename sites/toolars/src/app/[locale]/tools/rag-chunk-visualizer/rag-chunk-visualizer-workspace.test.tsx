import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { RagChunkVisualizerWorkspace } from "./rag-chunk-visualizer-workspace";

describe("RagChunkVisualizerWorkspace", () => {
  it("renders the Toolars RAG chunk workspace", () => {
    renderWithIntl(<RagChunkVisualizerWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "rag-chunk-visualizer");
    expect(screen.getByRole("heading", { name: "RAG Chunk Visualizer" })).toBeInTheDocument();
    expect(screen.getByText("RAG chunk preview")).toBeInTheDocument();
    expect(screen.getByLabelText("Document text")).toBeInTheDocument();
    expect(screen.getByLabelText("Chunk tokens")).toHaveDisplayValue("80");
  });

  it("builds local chunks with overlap metadata", () => {
    renderWithIntl(<RagChunkVisualizerWorkspace />);

    fireEvent.change(screen.getByLabelText("Chunk tokens"), { target: { value: "8" } });
    fireEvent.click(screen.getByRole("button", { name: "Build chunks" }));

    expect(screen.getByText("Chunk 1")).toBeInTheDocument();
    expect(screen.getAllByText(/Overlap/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Local chunk preview only/)).toBeInTheDocument();
  });
});
