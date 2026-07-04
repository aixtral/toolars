import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import es from "../../../../messages/es.json";
import DataRightsPage from "./page";

function renderDataRightsWithSpanishMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={es}>
      <DataRightsPage />
    </NextIntlClientProvider>
  );
}

describe("DataRightsPage", () => {
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
