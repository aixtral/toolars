import fs from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import es from "../../../../../messages/es.json";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { SubscriptionAuditWorkspace } from "./subscription-audit-workspace";

const workspacePath = "src/app/[locale]/tools/subscription-audit/subscription-audit-workspace.tsx";

describe("SubscriptionAuditWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("does not expose i18n audit hardcoded UI text or absolute href candidates", () => {
    const scan = scanSourceText(fs.readFileSync(workspacePath, "utf8"), workspacePath);

    expect(scan.hardcodedText).toEqual([]);
    expect(scan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc subscription audit workspace sections", () => {
    renderWithIntl(<SubscriptionAuditWorkspace />);

    expect(screen.getByRole("heading", { name: "Subscription Audit Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Subscription inputs")).toBeInTheDocument();
    expect(screen.getByText("Audit summary")).toBeInTheDocument();
    expect(screen.getByText("Subscription review notes")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Netflix")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/subscription-audit/about");
  });

  it("calculates the default subscription audit and saves assumptions locally", () => {
    renderWithIntl(<SubscriptionAuditWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate audit" }));

    expect(screen.getByText("$126.69")).toBeInTheDocument();
    expect(screen.getByText("$1,520.28")).toBeInTheDocument();
    expect(screen.getByText("$25.34")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save audit list" }));

    expect(window.localStorage.getItem("toolars.subscription-audit.entries")).toContain("Netflix");
  });

  it("renders Spanish workspace copy and localized details link", () => {
    render(
      <NextIntlClientProvider locale="es" messages={es}>
        <SubscriptionAuditWorkspace />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("heading", { name: "Calculadora de auditoría de suscripciones" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Calcular auditoría" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Detalles de la herramienta" })).toHaveAttribute(
      "href",
      "/es/tools/subscription-audit/about"
    );
  });
});
