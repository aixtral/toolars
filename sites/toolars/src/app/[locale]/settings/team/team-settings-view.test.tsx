import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { describe, expect, it } from "vitest";
import { TeamSettingsView } from "./team-settings-view";

describe("TeamSettingsView", () => {
  it("renders team settings modules from the design", () => {
    const { container } = renderWithIntl(<TeamSettingsView />);

    expect(container.querySelector('[data-team-settings-page="true"]')).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Team workspace" })).toBeInTheDocument();
    expect(screen.getByText("Members")).toBeInTheDocument();
    expect(screen.getByText("Invite members")).toBeInTheDocument();
    expect(screen.getByText("Roles and permissions")).toBeInTheDocument();
    expect(screen.getByText("Seat usage")).toBeInTheDocument();
    expect(screen.getByText("Pending invites")).toBeInTheDocument();
    expect(screen.getByText("Shared collections")).toBeInTheDocument();
    expect(screen.getByText("Activity log")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Transfer ownership" })).toBeInTheDocument();
  });

  it("adds a pending invite when an email is submitted", () => {
    renderWithIntl(<TeamSettingsView />);

    fireEvent.change(screen.getByLabelText("Invite email"), { target: { value: "mira@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Send invite" }));

    expect(screen.getByText("Invite queued for mira@example.com.")).toBeInTheDocument();
    expect(screen.getByText("mira@example.com")).toBeInTheDocument();
  });
});
