import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ApiKeysSettingsView } from "./api-keys-settings-view";

describe("ApiKeysSettingsView", () => {
  it("renders API key management modules from the design", () => {
    const { container } = render(<ApiKeysSettingsView />);

    expect(container.querySelector('[data-api-keys-settings-page="true"]')).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "API keys" })).toBeInTheDocument();
    expect(screen.getByText("Production key")).toBeInTheDocument();
    expect(screen.getByText("Development key")).toBeInTheDocument();
    expect(screen.getByText("Create API key")).toBeInTheDocument();
    expect(screen.getByText("Scopes")).toBeInTheDocument();
    expect(screen.getByText("Webhook signing secret")).toBeInTheDocument();
    expect(screen.getByText("Key activity")).toBeInTheDocument();
    expect(screen.getByText("Security checklist")).toBeInTheDocument();
  });

  it("creates and revokes keys with visible local state", () => {
    render(<ApiKeysSettingsView />);

    fireEvent.click(screen.getByRole("button", { name: "Create key" }));

    expect(screen.getByText("New local key created.")).toBeInTheDocument();
    expect(screen.getByText("tk_live_new_••••7f4")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Revoke Production key" }));

    expect(screen.getByText("Production key revoked.")).toBeInTheDocument();
    expect(screen.getByText("Revoked")).toBeInTheDocument();
  });
});
