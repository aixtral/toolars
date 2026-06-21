import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { collections } from "@/data/registry";
import { CollectionsIndexView } from "./collections-index-view";

describe("CollectionsIndexView", () => {
  it("renders the collections landing modules from the design", () => {
    const { container } = render(<CollectionsIndexView />);

    expect(container.querySelector('[data-collections-index="true"]')).toBeInTheDocument();
    expect(container.querySelector('[data-collections-mobile-layout="directory-cards"]')).toBeInTheDocument();
    expect(container.querySelector('[data-collections-index="true"]')).toHaveAttribute(
      "data-collections-density",
      "mobile-v2"
    );
    expect(screen.getByRole("heading", { name: "Collections for every kind of work" })).toBeInTheDocument();
    expect(screen.getByText("Collections for repeated work")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Create private collection" }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Featured collections")).toBeInTheDocument();
    expect(screen.getByText("All collections")).toBeInTheDocument();
    expect(screen.getByText("Recently updated")).toBeInTheDocument();
    expect(screen.getByText("Suggested for you")).toBeInTheDocument();
    expect(screen.getByText("Create a private collection")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create collection" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Import bookmarks" })).toBeInTheDocument();
  });

  it("uses registry collections with open links and collection metadata", () => {
    const { container } = render(<CollectionsIndexView />);

    for (const collection of collections) {
      expect(screen.getAllByText(collection.title).length).toBeGreaterThan(0);
      expect(container.querySelector(`a[href="${collection.href}"]`)).toBeInTheDocument();
    }

    expect(screen.getAllByText("Official").length).toBeGreaterThan(0);
    expect(screen.getByText("Finance Review")).toBeInTheDocument();
    expect(screen.getByText("Health Basics")).toBeInTheDocument();
    expect(screen.getByText("Collections sync across devices")).toBeInTheDocument();
  });
});
