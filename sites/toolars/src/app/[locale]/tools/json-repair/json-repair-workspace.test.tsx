import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { describe, expect, it } from "vitest";
import es from "../../../../../messages/es.json";
import { JsonRepairWorkspace } from "./json-repair-workspace";

function renderWithSpanish(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="es" messages={es}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe("JsonRepairWorkspace", () => {
  it("renders inside the AI Developer Lab workbench shell", () => {
    renderWithIntl(<JsonRepairWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "json-repair");
    expect(screen.getByText("Run mode")).toBeInTheDocument();
    expect(screen.getByText("Provider route")).toBeInTheDocument();
    expect(screen.getByText("Artifact state")).toBeInTheDocument();
    expect(screen.getByText("Local parser")).toBeInTheDocument();
  });

  it("renders Spanish workspace copy with localized internal links", () => {
    renderWithSpanish(<JsonRepairWorkspace />);

    expect(screen.getByRole("heading", { name: "Reparación de JSON" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reparar JSON" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Detalles de la herramienta" })).toHaveAttribute(
      "href",
      "/es/tools/json-repair/about"
    );
    expect(screen.queryByText("Malformed JSON input")).not.toBeInTheDocument();
  });

  it("repairs the sample JSON payload", () => {
    renderWithIntl(<JsonRepairWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Repair JSON" }));

    expect(screen.getByText("Repair complete. 3 fixes applied locally.")).toBeInTheDocument();
    expect(screen.getByText(/"user": "ada"/)).toBeInTheDocument();
  });
});
