import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CommandCenter } from "./command-center";

describe("CommandCenter", () => {
  it("opens from the shell trigger and focuses search", () => {
    render(<CommandCenter />);

    fireEvent.click(screen.getByRole("button", { name: "Open command search" }));

    const dialog = screen.getByRole("dialog", { name: "Command Center" });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: "Search tools and workflows" })).toHaveFocus();
    expect(within(dialog).getByText("Suggested")).toBeInTheDocument();
  });

  it("opens with the keyboard shortcut and closes with Escape", () => {
    render(<CommandCenter />);

    fireEvent.keyDown(document, { key: "k", metaKey: true });
    expect(screen.getByRole("dialog", { name: "Command Center" })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Command Center" })).not.toBeInTheDocument();
  });

  it("traps Tab focus inside the command dialog", () => {
    render(<CommandCenter />);

    fireEvent.click(screen.getByRole("button", { name: "Open command search" }));

    const dialog = screen.getByRole("dialog", { name: "Command Center" });
    const searchbox = screen.getByRole("searchbox", { name: "Search tools and workflows" });
    const results = within(dialog).getAllByRole("link");

    expect(searchbox).toHaveFocus();

    fireEvent.keyDown(dialog, { key: "Tab", shiftKey: true });
    expect(results.at(-1)).toHaveFocus();

    fireEvent.keyDown(dialog, { key: "Tab" });
    expect(searchbox).toHaveFocus();
  });

  it("restores focus to the command trigger after closing", () => {
    render(<CommandCenter />);

    const trigger = screen.getByRole("button", { name: "Open command search" });
    trigger.focus();
    fireEvent.click(trigger);

    expect(screen.getByRole("searchbox", { name: "Search tools and workflows" })).toHaveFocus();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("dialog", { name: "Command Center" })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("routes JSON searches to the JSON Repair tool", () => {
    render(<CommandCenter />);

    fireEvent.click(screen.getByRole("button", { name: "Open command search" }));
    fireEvent.change(screen.getByRole("searchbox", { name: "Search tools and workflows" }), {
      target: { value: "json" }
    });

    const result = screen.getByRole("link", { name: /JSON Repair/ });
    expect(result).toHaveAttribute("href", "/tools/json-repair");
    expect(screen.getByText("Tools")).toBeInTheDocument();
  });

  it("shows an empty state for unmatched tasks", () => {
    render(<CommandCenter />);

    fireEvent.click(screen.getByRole("button", { name: "Open command search" }));
    fireEvent.change(screen.getByRole("searchbox", { name: "Search tools and workflows" }), {
      target: { value: "zzzz no matching task" }
    });

    expect(screen.getByText("No matching tools or workflows")).toBeInTheDocument();
    expect(screen.getByText("Try a tool name, file type, or task like summarize pdf.")).toBeInTheDocument();
  });

  it("renders long search results in the scroll region while keeping the footer mounted", () => {
    render(<CommandCenter />);

    fireEvent.click(screen.getByRole("button", { name: "Open command search" }));
    fireEvent.change(screen.getByRole("searchbox", { name: "Search tools and workflows" }), {
      target: { value: "calculator" }
    });

    const dialog = screen.getByRole("dialog", { name: "Command Center" });
    const resultsRegion = within(dialog).getByRole("listbox", { name: "Command results" });
    const resultLinks = within(resultsRegion).getAllByRole("link");

    expect(resultLinks.length).toBeGreaterThan(8);
    expect(within(dialog).getByText("Esc Close")).toBeInTheDocument();

    resultLinks.at(-1)?.focus();
    expect(resultLinks.at(-1)).toHaveFocus();

    fireEvent.keyDown(dialog, { key: "Tab" });
    expect(screen.getByRole("searchbox", { name: "Search tools and workflows" })).toHaveFocus();
  });
});
