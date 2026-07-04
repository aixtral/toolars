import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import es from "../../../../../messages/es.json";
import { NotificationsSettingsView } from "./notifications-settings-view";

function renderWithSpanishMessages(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="es" messages={es}>
      {ui}
    </NextIntlClientProvider>
  );
}

const notificationsSourceFile = "src/app/[locale]/settings/notifications/notifications-settings-view.tsx";

function scanNotificationsSource() {
  return scanSourceText(readFileSync(notificationsSourceFile, "utf8"), notificationsSourceFile);
}

describe("NotificationsSettingsView", () => {
  it("does not contribute notifications hardcoded UI candidates to the i18n audit", () => {
    const sourceScan = scanNotificationsSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

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

  it("renders non-English notification copy from messages", () => {
    renderWithSpanishMessages(<NotificationsSettingsView />);

    expect(screen.getByText("Ajusta las preferencias de flujo de trabajo, revisión, uso de prueba, resumen, horas tranquilas y canales de entrega.")).toBeInTheDocument();
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
