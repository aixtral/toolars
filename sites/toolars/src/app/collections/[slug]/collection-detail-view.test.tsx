import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getCollectionDetailBySlug } from "@/data/collection-details";
import { CollectionDetailView } from "./collection-detail-view";

describe("CollectionDetailView", () => {
  it("renders the PDF Ops Kit collection detail template", () => {
    const detail = getCollectionDetailBySlug("pdf-ops-kit");
    if (!detail) throw new Error("missing PDF collection detail");

    const { container } = render(<CollectionDetailView detail={detail} />);

    expect(container.querySelector('[data-collection-page="pdf-ops-kit"]')).toBeInTheDocument();
    expect(container.querySelector('[data-collection-page="pdf-ops-kit"]')).toHaveAttribute(
      "data-designed-collection-detail",
      "true"
    );
    expect(container.querySelector('[data-collection-page="pdf-ops-kit"]')).toHaveAttribute(
      "data-collection-density",
      "mobile-v2"
    );
    expect(screen.getByRole("heading", { name: "PDF Ops Kit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Share" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save collection" })).toBeInTheDocument();
    expect(screen.getByText("Recommended path")).toBeInTheDocument();
    expect(screen.getByText("Tools in this collection")).toBeInTheDocument();
    expect(screen.getByText("Workflows included")).toBeInTheDocument();
    expect(screen.getByText("Collection notes")).toBeInTheDocument();
    expect(container.querySelector(".collection-hero-summary")).toHaveTextContent(detail.summary);
    expect(container.querySelector(".collection-hero-summary")).not.toHaveTextContent(detail.collection.description);
    expect(container.querySelector(".collection-recommended-panel")).toBeInTheDocument();
    expect(container.querySelector(".collection-tools-panel")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workflow" })).toHaveAttribute("href", "/workflows/pdf-summary");
    expect(screen.getByRole("link", { name: "Open PDF Toolkit" })).toHaveAttribute("href", "/tools/pdf-toolkit");
  });

  it("opens share and save modals from collection detail actions", () => {
    const detail = getCollectionDetailBySlug("pdf-ops-kit");
    if (!detail) throw new Error("missing PDF collection detail");

    render(<CollectionDetailView detail={detail} />);

    fireEvent.click(screen.getByRole("button", { name: "Share" }));

    expect(screen.getByRole("dialog", { name: "Share collection" })).toBeInTheDocument();
    expect(screen.getByDisplayValue("/collections/pdf-ops-kit")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    fireEvent.click(screen.getByRole("button", { name: "Save collection" }));

    const saveDialog = screen.getByRole("dialog", { name: "Save collection" });
    expect(saveDialog).toBeInTheDocument();
    expect(within(saveDialog).getByText("PDF Ops Kit")).toBeInTheDocument();
    expect(within(saveDialog).getByText("Personal workspace")).toBeInTheDocument();
  });

  it("renders AI Developer Lab collection playbooks and workflow links", () => {
    const detail = getCollectionDetailBySlug("ai-developer-lab");
    if (!detail) throw new Error("missing AI collection detail");

    const { container } = render(<CollectionDetailView detail={detail} />);

    expect(container.querySelector('[data-collection-page="ai-developer-lab"]')).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "AI Developer Lab" })).toBeInTheDocument();
    expect(screen.getByText("Playbooks")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Browse full Lab" })).toHaveAttribute("href", "/explore/ai-developer");
    expect(screen.getByRole("link", { name: /AI Prompt Hardening/ })).toHaveAttribute(
      "href",
      "/workflows/ai-prompt-hardening"
    );
    expect(screen.getByRole("link", { name: /MCP Tool Launch/ })).toHaveAttribute("href", "/workflows/mcp-tool-launch");
  });
});
