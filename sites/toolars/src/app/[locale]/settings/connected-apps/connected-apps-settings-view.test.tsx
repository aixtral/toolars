import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { describe, expect, it } from "vitest";
import { ConnectedAppsSettingsView } from "./connected-apps-settings-view";

describe("ConnectedAppsSettingsView", () => {
  it("renders connected apps modules from the settings design", () => {
    const { container } = renderWithIntl(<ConnectedAppsSettingsView />);

    expect(container.querySelector('[data-connected-apps-settings-page="true"]')).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Connected apps" })).toBeInTheDocument();
    expect(screen.getByText("Google Drive")).toBeInTheDocument();
    expect(screen.getByText("Browser extension")).toBeInTheDocument();
    expect(screen.getByText("Notion")).toBeInTheDocument();
    expect(screen.getByText("Connection scopes")).toBeInTheDocument();
    expect(screen.getByText("Sync policy")).toBeInTheDocument();
    expect(screen.getByText("App activity")).toBeInTheDocument();
    expect(screen.getByText("Connect new app")).toBeInTheDocument();
    expect(screen.getByText("Integration health")).toBeInTheDocument();
  });

  it("confirms before disconnecting an app", () => {
    renderWithIntl(<ConnectedAppsSettingsView />);

    fireEvent.click(screen.getByRole("button", { name: "Disconnect Notion" }));

    expect(screen.getByRole("dialog", { name: "Disconnect Notion?" })).toHaveAttribute("aria-modal", "true");
    expect(screen.getByText("Notion will stop syncing saved workflow outputs until you reconnect it.")).toBeInTheDocument();
    expect(screen.queryByText("Notion disconnected.")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.queryByRole("dialog", { name: "Disconnect Notion?" })).not.toBeInTheDocument();
    expect(screen.getByText("All connected apps are scoped and monitored.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Disconnect Notion" }));
    fireEvent.click(screen.getByRole("button", { name: "Disconnect app" }));

    expect(screen.queryByRole("dialog", { name: "Disconnect Notion?" })).not.toBeInTheDocument();
    expect(screen.getByText("Notion disconnected.")).toBeInTheDocument();
    expect(screen.getByText("Disconnected")).toBeInTheDocument();
  });

  it("focuses the disconnect confirmation dialog and restores the opener with Escape", () => {
    renderWithIntl(<ConnectedAppsSettingsView />);

    const trigger = screen.getByRole("button", { name: "Disconnect Notion" });

    trigger.focus();
    fireEvent.click(trigger);

    const dialog = screen.getByRole("dialog", { name: "Disconnect Notion?" });
    expect(dialog).toHaveFocus();

    fireEvent.keyDown(dialog, { key: "Escape" });

    expect(screen.queryByRole("dialog", { name: "Disconnect Notion?" })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
