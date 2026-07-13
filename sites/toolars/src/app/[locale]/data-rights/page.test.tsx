import { readFileSync } from "node:fs";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import es from "../../../../messages/es.json";
import DataRightsPage from "./page";

const globalStyles = readFileSync(path.resolve(import.meta.dirname, "../../globals.css"), "utf8");

function renderDataRightsWithSpanishMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={es}>
      <DataRightsPage />
    </NextIntlClientProvider>
  );
}

describe("DataRightsPage", () => {
  it("uses the blog-width, single-column layout shared by legal pages", () => {
    expect(globalStyles).toMatch(
      /\.legal-page,\s*\.data-rights-page\s*\{[\s\S]*?grid-template-columns: minmax\(0, 1fr\);[\s\S]*?width: min\(100%, 1180px\);/
    );
  });

  it("renders visible request copy from the active locale bundle", () => {
    renderDataRightsWithSpanishMessages();

    expect(screen.getByRole("heading", { name: "Ejercer tus derechos de datos" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Acceder a mis datos" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Solicitar exportación de datos" })).toHaveAttribute(
      "href",
      "mailto:privacy@toolars.app?subject=Data Access Request"
    );
    expect(screen.queryByRole("heading", { name: "Exercise Your Data Rights" })).not.toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Configuración → Privacidad e IA" })).toHaveAttribute("href", "/es/settings");
  });
});
