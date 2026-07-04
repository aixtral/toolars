import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { StorageSettingsView } from "./storage-settings-view";

const localizedStorageMessages = {
  ...en,
  settings: {
    ...en.settings,
    storage: {
      ...en.settings.storage,
      hero: {
        title: "Almacenamiento centinela",
        subtitle: "Subtitulo centinela de almacenamiento."
      },
      sections: {
        eyebrow: "Ajustes centinela",
        storageUsage: "Uso centinela",
        recentUploads: "Cargas centinela",
        cleanupPolicy: "Limpieza centinela",
        automation: "Automatizacion centinela",
        fileTypes: "Tipos centinela",
        exportArchive: "Archivo centinela",
        retentionWindow: "Retencion centinela"
      },
      actions: {
        viewTrialUsage: "Ver uso centinela",
        clearTemporaryUploads: "Limpiar cargas centinela",
        prepareArchive: "Preparar archivo centinela"
      },
      usage: {
        description: "El espacio centinela usa el 42%.",
        badge: "4,2 GB / 10 GB centinela",
        cards: [
          { label: "Almacenamiento usado centinela", value: "4,2 GB", detail: "de 10 GB centinela" },
          { label: "Cargas temporales centinela", value: "6 archivos", detail: "se limpian centinela" },
          { label: "Salidas guardadas centinela", value: "284", detail: "PDF e imagenes centinela" },
          { label: "Enlaces compartidos centinela", value: "35", detail: "exportaciones centinela" }
        ]
      },
      recentUploads: {
        items: [
          { name: "informe-centinela.pdf", type: "PDF centinela", size: "18 MB", status: "temporary" },
          { name: "lote-centinela.zip", type: "Archivo centinela", size: "42 MB", status: "saved" },
          { name: "recorte-centinela.png", type: "Imagen centinela", size: "6 MB", status: "saved" }
        ]
      },
      cleanup: {
        temporaryFiles: "{count} archivos temporales centinela",
        statusInitial: "Las cargas centinela se eliminaran al cerrar la sesion.",
        statusCleared: "Cargas centinela limpiadas."
      },
      automation: {
        description: "Comprime salidas centinela automaticamente.",
        badge: "Automatizacion centinela activa"
      },
      fileTypes: {
        items: [
          { type: "PDF centinela", limit: "100 MB centinela" },
          { type: "Imagenes centinela", limit: "25 MB centinela" },
          { type: "Archivos centinela", limit: "250 MB centinela" },
          { type: "CSV / JSON centinela", limit: "50 MB centinela" }
        ]
      },
      exportArchive: {
        description: "Descarga salidas centinela como archivo unico."
      },
      retention: {
        rows: [
          { id: "temporary", label: "Cargas temporales centinela", value: "Sesion centinela" },
          { id: "archive", label: "Exportaciones centinela", value: "7 dias centinela" },
          { id: "saved", label: "Salidas guardadas centinela", value: "Hasta eliminar centinela" }
        ]
      },
      statuses: {
        temporary: "Temporal centinela",
        saved: "Guardado centinela"
      },
      aria: {
        storageUsage: "Uso de almacenamiento centinela"
      }
    }
  }
};

function renderStorageViewInLocale() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedStorageMessages}>
      <StorageSettingsView />
    </NextIntlClientProvider>
  );
}

describe("StorageSettingsView", () => {
  it("renders storage settings modules from the design", () => {
    const { container } = renderWithIntl(<StorageSettingsView />);

    expect(container.querySelector('[data-storage-settings-page="true"]')).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Storage" })).toBeInTheDocument();
    expect(screen.getByText("Storage usage")).toBeInTheDocument();
    expect(screen.getByText("Upload cleanup policy")).toBeInTheDocument();
    expect(screen.getByText("File types")).toBeInTheDocument();
    expect(screen.getByText("Recent uploads")).toBeInTheDocument();
    expect(screen.getByText("Storage automation")).toBeInTheDocument();
    expect(screen.getByText("Export archive")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View trial usage" })).toHaveAttribute("href", "/settings/billing#usage");
  });

  it("clears temporary uploads with visible local state", () => {
    renderWithIntl(<StorageSettingsView />);

    expect(screen.getByText("6 temporary files")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Clear temporary uploads" }));

    expect(screen.getByText("Temporary uploads cleared.")).toBeInTheDocument();
    expect(screen.getByText("0 temporary files")).toBeInTheDocument();
  });

  it("localizes visible storage copy for a non-English locale", () => {
    renderStorageViewInLocale();

    expect(screen.getByText("Ajustes centinela")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Almacenamiento centinela" })).toBeInTheDocument();
    expect(screen.getByText("Subtitulo centinela de almacenamiento.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver uso centinela" })).toHaveAttribute("href", "/es/settings/billing#usage");
    expect(screen.getByText("El espacio centinela usa el 42%.")).toBeInTheDocument();
    expect(screen.getByLabelText("Uso de almacenamiento centinela")).toBeInTheDocument();
    expect(screen.getByText("Almacenamiento usado centinela")).toBeInTheDocument();
    expect(screen.getByText("informe-centinela.pdf")).toBeInTheDocument();
    expect(screen.getByText("Temporal centinela")).toBeInTheDocument();
    expect(screen.getByText("6 archivos temporales centinela")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Limpiar cargas centinela" })).toBeInTheDocument();
    expect(screen.getByText("Comprime salidas centinela automaticamente.")).toBeInTheDocument();
    expect(screen.getByText("100 MB centinela")).toBeInTheDocument();
    expect(screen.getByText("Descarga salidas centinela como archivo unico.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Preparar archivo centinela" })).toBeInTheDocument();
    expect(screen.getByText("Hasta eliminar centinela")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Limpiar cargas centinela" }));

    expect(screen.getByText("Cargas centinela limpiadas.")).toBeInTheDocument();
    expect(screen.getByText("0 archivos temporales centinela")).toBeInTheDocument();
  });
});
