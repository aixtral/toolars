import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { ApiKeysSettingsView } from "./api-keys-settings-view";

const localizedApiKeysMessages = {
  ...en,
  settings: {
    ...en.settings,
    "api-keys": {
      ...en.settings["api-keys"],
      hero: {
        title: "Claves centinela",
        subtitle: "Subtitulo centinela para claves con alcance."
      },
      sections: {
        eyebrow: "Ajustes centinela",
        inventory: "Inventario centinela",
        createKey: "Crear clave centinela",
        scopes: "Alcances centinela",
        webhook: "Secreto webhook centinela",
        activity: "Actividad centinela",
        secChecklist: "Lista centinela"
      },
      inventory: {
        description: "Las claves centinela quedan enmascaradas.",
        activeCount: "{count} activas centinela",
        lastUsed: "Ultimo uso {value}",
        keys: [
          {
            id: "production",
            label: "Clave de produccion centinela",
            token: "tk_live_••••••••••••9f3a",
            environment: "Produccion centinela",
            scopes: ["tools:read", "workflows:run", "collections:write"],
            lastUsed: "hace 2 horas centinela",
            status: "active"
          },
          {
            id: "development",
            label: "Clave de desarrollo centinela",
            token: "tk_test_••••••••••••4a21",
            environment: "Sandbox centinela",
            scopes: ["tools:read", "workflows:run"],
            lastUsed: "ayer centinela",
            status: "active"
          }
        ],
        newKey: {
          id: "new-local",
          label: "Clave local centinela",
          token: "tk_live_new_••••7f4",
          environment: "Produccion centinela",
          scopes: ["tools:read", "workflows:run"],
          lastUsed: "ahora centinela",
          status: "active"
        }
      },
      statuses: {
        active: "Activa centinela",
        revoked: "Revocada centinela"
      },
      actions: {
        create: "Crear clave centinela",
        copy: "Copiar centinela",
        revoke: "Revocar {label}",
        createScoped: "Crear clave con alcance centinela",
        rotateSecret: "Rotar secreto centinela"
      },
      feedback: {
        initial: "Las claves centinela estan enmascaradas.",
        created: "Clave local centinela creada.",
        revoked: "{label} revocada centinela."
      },
      createForm: {
        keyNameLabel: "Nombre centinela",
        keyNameDefault: "Automatizacion centinela",
        environmentLabel: "Entorno centinela",
        environments: [
          { value: "production", label: "Produccion centinela" },
          { value: "sandbox", label: "Sandbox centinela" }
        ],
        expirationLabel: "Caducidad centinela",
        expirations: [
          { value: "30d", label: "30 dias centinela" },
          { value: "90d", label: "90 dias centinela" },
          { value: "1y", label: "1 ano centinela" }
        ]
      },
      scopes: {
        rows: [
          { scope: "tools:read", description: "Lee metadatos centinela." },
          { scope: "workflows:run", description: "Ejecuta plantillas centinela." },
          { scope: "collections:write", description: "Actualiza colecciones centinela." },
          { scope: "billing:read", description: "Lee totales centinela." }
        ]
      },
      webhook: {
        secret: "whsec_••••••••98f",
        rotated: "Rotado centinela el 12 jun 2026"
      },
      activity: {
        rows: [
          { time: "hace 2 horas centinela", detail: "Clave centinela ejecuto flujo PDF" },
          { time: "ayer centinela", detail: "Clave centinela listo herramientas" },
          { time: "12 jun 2026 centinela", detail: "Secreto centinela rotado" }
        ]
      },
      securityChecklist: {
        badge: "Activo centinela",
        items: [
          "Una clave centinela por entorno",
          "Rotar claves centinela cada 90 dias",
          "No exponer claves centinela",
          "Revocar claves centinela inactivas"
        ]
      }
    }
  }
};

function renderApiKeysViewInLocale() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedApiKeysMessages}>
      <ApiKeysSettingsView />
    </NextIntlClientProvider>
  );
}

describe("ApiKeysSettingsView", () => {
  it("renders API key management modules from the design", () => {
    const { container } = renderWithIntl(<ApiKeysSettingsView />);

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
    renderWithIntl(<ApiKeysSettingsView />);

    fireEvent.click(screen.getByRole("button", { name: "Create key" }));

    expect(screen.getByText("New local key created.")).toBeInTheDocument();
    expect(screen.getByText("tk_live_new_••••7f4")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Revoke Production key" }));

    expect(screen.getByText("Production key revoked.")).toBeInTheDocument();
    expect(screen.getByText("Revoked")).toBeInTheDocument();
  });

  it("localizes visible API key copy for a non-English locale", () => {
    renderApiKeysViewInLocale();

    expect(screen.getByText("Ajustes centinela")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Claves centinela" })).toBeInTheDocument();
    expect(screen.getByText("Subtitulo centinela para claves con alcance.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Crear clave centinela" })).toBeInTheDocument();
    expect(screen.getByText("Las claves centinela quedan enmascaradas.")).toBeInTheDocument();
    expect(screen.getByText("2 activas centinela")).toBeInTheDocument();
    expect(screen.getByText("Clave de produccion centinela")).toBeInTheDocument();
    expect(screen.getAllByText("Produccion centinela").length).toBeGreaterThan(0);
    expect(screen.getByText("Ultimo uso hace 2 horas centinela")).toBeInTheDocument();
    expect(screen.getAllByText("Activa centinela").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: "Copiar centinela" }).length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Revocar Clave de produccion centinela" })).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre centinela")).toHaveValue("Automatizacion centinela");
    expect(screen.getByText("30 dias centinela")).toBeInTheDocument();
    expect(screen.getByText("Lee metadatos centinela.")).toBeInTheDocument();
    expect(screen.getByText("Rotado centinela el 12 jun 2026")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Rotar secreto centinela" })).toBeInTheDocument();
    expect(screen.getByText("Clave centinela ejecuto flujo PDF")).toBeInTheDocument();
    expect(screen.getByText("Una clave centinela por entorno")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Crear clave centinela" }));

    expect(screen.getByText("Clave local centinela creada.")).toBeInTheDocument();
    expect(screen.getByText("Clave local centinela")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Revocar Clave de produccion centinela" }));

    expect(screen.getByText("Clave de produccion centinela revocada centinela.")).toBeInTheDocument();
    expect(screen.getByText("Revocada centinela")).toBeInTheDocument();
  });
});
