import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { describe, expect, it } from "vitest";
import { StorageSettingsView } from "./storage-settings-view";

describe("StorageSettingsView", () => {
  it("renders storage settings modules from the design", () => {
    const { container } = renderWithIntl(<StorageSettingsView />);

    expect(container.querySelector('[data-storage-settings-page="true"]')).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Storage" })).toBeInTheDocument();
    expect(screen.getByText("Storage usage")).toBeInTheDocument();
    expect(screen.getByText("Upload cleanup policy")).toBeInTheDocument();
    expect(screen.getByText("File types")).toBeInTheDocument();
    expect(screen.getByText("Recent uploads")).toBeInTheDocument();
    expect(screen.getByText("Storage automation")).toBeInTheDocument();
    expect(screen.getByText("Export archive")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View trial usage" })).toHaveAttribute("href", "/settings/billing#usage");
  });

  it("clears temporary uploads with visible local state", () => {
    renderWithIntl(<StorageSettingsView />);

    expect(screen.getByText("6 temporary files")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Clear temporary uploads" }));

    expect(screen.getByText("Temporary uploads cleared.")).toBeInTheDocument();
    expect(screen.getByText("0 temporary files")).toBeInTheDocument();
  });
});
