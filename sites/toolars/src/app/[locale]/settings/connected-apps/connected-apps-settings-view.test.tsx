import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import zhHans from "../../../../../messages/zh-hans.json";
import { ConnectedAppsSettingsView } from "./connected-apps-settings-view";

function renderWithLocale(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="zh-hans" messages={zhHans}>
      {ui}
    </NextIntlClientProvider>
  );
}

const connectedAppsSourceFile = "src/app/[locale]/settings/connected-apps/connected-apps-settings-view.tsx";

function scanConnectedAppsSource() {
  return scanSourceText(readFileSync(connectedAppsSourceFile, "utf8"), connectedAppsSourceFile);
}

describe("ConnectedAppsSettingsView", () => {
  it("does not contribute connected-apps hardcoded UI candidates to the i18n audit", () => {
    const sourceScan = scanConnectedAppsSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

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

  it("localizes connected app status and disconnect copy for a launch locale", () => {
    renderWithLocale(<ConnectedAppsSettingsView />);

    expect(screen.getByText("所有已连接的应用均已限定权限并受监控。")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "断开 Notion" }));

    expect(screen.getByRole("dialog", { name: "要断开 Notion 吗？" })).toHaveAttribute("aria-modal", "true");
    expect(screen.getByText("Notion 将停止同步已保存的工作流输出，直到你重新连接它。")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "断开应用" }));

    expect(screen.queryByRole("dialog", { name: "要断开 Notion 吗？" })).not.toBeInTheDocument();
    expect(screen.getByText("Notion 已断开连接。")).toBeInTheDocument();
    expect(screen.getByText("已断开")).toBeInTheDocument();
  });
});
