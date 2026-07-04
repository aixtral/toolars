import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import en from "../../../messages/en.json";
import NotFound from "./not-found";

const localizedNotFoundCopy = {
  code: "404 centinela",
  title: "Página no encontrada centinela",
  description: "La página centinela ya no existe.",
  actions: {
    home: "Volver al inicio centinela",
    browse: "Explorar herramientas centinela"
  },
  aria: {
    content: "Contenido no encontrado centinela",
    code: "Código 404 centinela",
    actions: "Acciones de recuperación centinela",
    home: "Volver al inicio de Toolars centinela",
    browse: "Explorar herramientas PDF centinela"
  },
  titles: {
    home: "Ir al inicio centinela",
    browse: "Explorar herramientas PDF centinela"
  }
};

const localizedMessages = {
  ...en,
  notFound: localizedNotFoundCopy
};

describe("NotFound", () => {
  it("renders localized recovery copy and locale-aware links", () => {
    render(
      <NextIntlClientProvider locale="es" messages={localizedMessages}>
        <NotFound />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("main", { name: localizedNotFoundCopy.aria.content })).toBeInTheDocument();
    expect(screen.getByLabelText(localizedNotFoundCopy.aria.code)).toHaveTextContent(localizedNotFoundCopy.code);
    expect(screen.getByRole("heading", { name: localizedNotFoundCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedNotFoundCopy.description)).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: localizedNotFoundCopy.aria.actions })).toBeInTheDocument();

    const homeLink = screen.getByRole("link", { name: localizedNotFoundCopy.aria.home });
    expect(homeLink).toHaveTextContent(localizedNotFoundCopy.actions.home);
    expect(homeLink).toHaveAttribute("href", "/es");
    expect(homeLink).toHaveAttribute("title", localizedNotFoundCopy.titles.home);

    const browseLink = screen.getByRole("link", { name: localizedNotFoundCopy.aria.browse });
    expect(browseLink).toHaveTextContent(localizedNotFoundCopy.actions.browse);
    expect(browseLink).toHaveAttribute("href", "/es/explore/pdf");
    expect(browseLink).toHaveAttribute("title", localizedNotFoundCopy.titles.browse);
  });
});
