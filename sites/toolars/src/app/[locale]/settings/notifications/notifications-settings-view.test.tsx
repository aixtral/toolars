import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { describe, expect, it } from "vitest";
import { NotificationsSettingsView } from "./notifications-settings-view";

describe("NotificationsSettingsView", () => {
  it("renders notification settings modules from the design", () => {
    const { container } = renderWithIntl(<NotificationsSettingsView />);

    expect(container.querySelector('[data-notifications-settings-page="true"]')).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Notifications" })).toBeInTheDocument();
    expect(screen.getByText("Delivery channels")).toBeInTheDocument();
    expect(screen.getByText("Workflow alerts")).toBeInTheDocument();
    expect(screen.getByText("Review alerts")).toBeInTheDocument();
    expect(screen.getByText("Trial usage alerts")).toBeInTheDocument();
    expect(screen.getByText("Product updates")).toBeInTheDocument();
    expect(screen.getByText("Digest schedule")).toBeInTheDocument();
    expect(screen.getByText("Quiet hours")).toBeInTheDocument();
    expect(screen.getByText("Notification preview")).toBeInTheDocument();
  });

  it("updates visible state when workflow alerts are toggled", () => {
    renderWithIntl(<NotificationsSettingsView />);

    const workflowAlerts = screen.getByRole("button", { name: "Workflow completion alerts" });
    expect(workflowAlerts).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(workflowAlerts);

    expect(workflowAlerts).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText("Workflow completion alerts paused.")).toBeInTheDocument();
  });
});
