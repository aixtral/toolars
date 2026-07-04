import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import es from "../../../../../messages/es.json";
import { TeamSettingsView } from "./team-settings-view";

function renderWithSpanishMessages(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="es" messages={es}>
      {ui}
    </NextIntlClientProvider>
  );
}

const teamSettingsSourceFile = "src/app/[locale]/settings/team/team-settings-view.tsx";

function scanTeamSettingsSource() {
  return scanSourceText(readFileSync(teamSettingsSourceFile, "utf8"), teamSettingsSourceFile);
}

describe("TeamSettingsView", () => {
  it("does not contribute team settings hardcoded UI candidates to the i18n audit", () => {
    const sourceScan = scanTeamSettingsSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

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

  it("renders non-English team copy from messages", () => {
    renderWithSpanishMessages(<TeamSettingsView />);

    expect(screen.getByText("Administra miembros, roles, puestos, colecciones compartidas, invitaciones pendientes y controles de propiedad.")).toBeInTheDocument();
  });

  it("adds a pending invite when an email is submitted", () => {
    renderWithIntl(<TeamSettingsView />);

    fireEvent.change(screen.getByLabelText("Invite email"), { target: { value: "mira@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Send invite" }));

    expect(screen.getByText("Invite queued for mira@example.com.")).toBeInTheDocument();
    expect(screen.getByText("mira@example.com")).toBeInTheDocument();
  });
});
