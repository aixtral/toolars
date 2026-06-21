import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import StatesPage from "./page";
import { StatesBoardView } from "./states-board-view";

describe("StatesBoardView", () => {
  it("renders the states and overlays modules from the design", () => {
    const { container } = render(<StatesBoardView />);

    expect(container.querySelector('[data-states-board-page="true"]')).toBeInTheDocument();
    expect(container.querySelector('[data-states-mobile-layout="state-gallery"]')).toBeInTheDocument();
    expect(container.querySelector('[data-states-density="mobile-v2"]')).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "States and overlays" })).toBeInTheDocument();
    expect(screen.getByText("Empty")).toBeInTheDocument();
    expect(screen.getByText("Loading")).toBeInTheDocument();
    expect(screen.getByText("Upload error")).toBeInTheDocument();
    expect(screen.getByText("Offline mode")).toBeInTheDocument();
    expect(screen.getByText("Toast stack")).toBeInTheDocument();
    expect(screen.getByText("Form validation")).toBeInTheDocument();
    expect(screen.getByText("Mobile drawer")).toBeInTheDocument();
    expect(screen.getByText("Delete confirmation")).toBeInTheDocument();
    expect(screen.getByText("Mobile command overlay")).toBeInTheDocument();
  });

  it("shows toast and destructive confirmation states", () => {
    render(<StatesBoardView />);

    expect(screen.getByText("Saved to PDF power user kit")).toBeInTheDocument();
    expect(screen.getByText("AI consent required before summarizing")).toBeInTheDocument();
    expect(screen.getByText("Upload failed. File exceeds 50 MB.")).toBeInTheDocument();
    expect(screen.getByText("Share link copied")).toBeInTheDocument();
    expect(screen.getByText("Delete saved output?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Show toast" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete output" })).toBeInTheDocument();
  });

  it("uses the no-sidebar shell variant for the states route", () => {
    render(<StatesPage />);

    expect(screen.queryByLabelText("Tool filters")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Admin review navigation")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "States and overlays" })).toBeInTheDocument();
  });
});
