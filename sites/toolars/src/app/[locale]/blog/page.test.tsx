import { render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import es from "../../../../messages/es.json";
import zhHant from "../../../../messages/zh-hant.json";
import BlogArticlePage, { generateMetadata as generateArticleMetadata } from "./[slug]/page";
import BlogIndexPage, { generateMetadata as generateBlogIndexMetadata } from "./page";

const serverI18n = vi.hoisted(() => ({
  locale: "es",
  messages: {} as Record<string, unknown>
}));

const jsonRepairToolLinkName = (accessibleName: string) => accessibleName.includes(es.tools["json-repair"].name);

vi.mock("next-intl/server", () => ({
  getLocale: async () => serverI18n.locale,
  getTranslations: async (namespace?: string) => {
    return (key: string, values?: Record<string, string | number>) => {
      const path = namespace ? `${namespace}.${key}` : key;
      const message = path.split(".").reduce<unknown>((cursor, segment) => {
        if (!cursor || typeof cursor !== "object") return undefined;
        return (cursor as Record<string, unknown>)[segment];
      }, serverI18n.messages);

      if (typeof message !== "string") return path;
      return Object.entries(values ?? {}).reduce(
        (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
        message
      );
    };
  }
}));

function renderWithSpanishIntl(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="es" messages={es}>
      {ui}
    </NextIntlClientProvider>
  );
}

function renderWithTraditionalChineseIntl(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="zh-hant" messages={zhHant}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe("Blog pages", () => {
  beforeEach(() => {
    serverI18n.locale = "es";
    serverI18n.messages = es;
  });

  it("renders the Spanish blog index with localized read time and locale-safe article links", async () => {
    const ui = await BlogIndexPage();
    const { container } = renderWithSpanishIntl(ui);
    const localizedDate = new Intl.DateTimeFormat("es", { dateStyle: "medium", timeZone: "UTC" }).format(
      new Date("2026-06-10T00:00:00Z")
    );

    expect(screen.getAllByText("5 min de lectura").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Guías").length).toBeGreaterThan(0);
    expect(screen.getByText(localizedDate)).toBeInTheDocument();
    expect(screen.queryByText("Blog de Toolars")).not.toBeInTheDocument();
    expect(container.querySelector('[data-blog-index-layout="wide-single"]')).toBeInTheDocument();
    expect(container.textContent).not.toContain("min read");
    expect(container.textContent).not.toContain("2026-06-10");
    expect(container.textContent).not.toContain("Guides");
    expect(screen.getByRole("link", { name: /Cómo reparar JSON roto en segundos/ })).toHaveAttribute(
      "href",
      "/es/blog/json-repair-guide"
    );
  });

  it("renders article tool CTAs from messages instead of the hardcoded English label", async () => {
    const ui = await BlogArticlePage({ params: Promise.resolve({ slug: "json-repair-guide" }) });
    renderWithSpanishIntl(ui);

    const toolLink = screen.getByRole("link", { name: jsonRepairToolLinkName });
    expect(within(toolLink).getByText("Abrir herramienta")).toBeInTheDocument();
    expect(
      within(toolLink).getByText("Repara la salida JSON mal formada de LLM, comas finales, comillas y arrays.")
    ).toBeInTheDocument();
    expect(screen.queryByText("Open tool")).not.toBeInTheDocument();
    expect(screen.queryByText("Fix malformed JSON from LLM output, trailing commas, quotes, and arrays.")).not.toBeInTheDocument();
  });

  it("renders Spanish article JSON-LD with the localized URL and inLanguage", async () => {
    const ui = await BlogArticlePage({ params: Promise.resolve({ slug: "json-repair-guide" }) });
    const { container } = renderWithSpanishIntl(ui);
    const graph = JSON.parse(container.querySelector('script[type="application/ld+json"]')?.textContent ?? "{}");
    const articleSchema = graph["@graph"]?.find((node: Record<string, unknown>) => node["@type"] === "Article");

    expect(articleSchema?.url).toBe("http://localhost:9320/es/blog/json-repair-guide");
    expect(articleSchema?.mainEntityOfPage).toBe("http://localhost:9320/es/blog/json-repair-guide");
    expect(articleSchema?.inLanguage).toBe("es");
  });

  it("keeps Spanish article back and tool links inside the active locale", async () => {
    const ui = await BlogArticlePage({ params: Promise.resolve({ slug: "json-repair-guide" }) });
    renderWithSpanishIntl(ui);

    expect(screen.getByRole("link", { name: "← Volver al blog" })).toHaveAttribute("href", "/es/blog");
    expect(screen.getByRole("link", { name: jsonRepairToolLinkName })).toHaveAttribute("href", "/es/tools/json-repair");
  });

  it("renders localized VitalCalc articles on localized detail routes instead of English fallbacks", async () => {
    const ui = await BlogArticlePage({ params: Promise.resolve({ slug: "what-is-bmi" }) });
    renderWithSpanishIntl(ui);

    expect(screen.getByRole("heading", { name: "¿Qué es el IMC? Cómo entender el índice de masa corporal" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "← Volver al blog" })).toHaveAttribute("href", "/es/blog");
  });

  it("renders Traditional Chinese blog routes with localized article content", async () => {
    serverI18n.locale = "zh-hant";
    serverI18n.messages = zhHant;

    const ui = await BlogArticlePage({ params: Promise.resolve({ slug: "json-repair-guide" }) });
    renderWithTraditionalChineseIntl(ui);

    expect(screen.getByRole("heading", { name: "如何在幾秒內修復損壞的 JSON" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "← 返回博客" })).toHaveAttribute("href", "/zh-hant/blog");
  });

  it("renders article pages with the wide blog layout and previous/next navigation", async () => {
    const ui = await BlogArticlePage({ params: Promise.resolve({ slug: "free-calculators-with-ai-tools" }) });
    const { container } = renderWithSpanishIntl(ui);
    const articleNav = screen.getByRole("navigation", { name: "Navegación de artículos" });

    expect(container.querySelector('[data-blog-article-layout="wide-single"]')).toBeInTheDocument();
    expect(within(articleNav).getByRole("link", { name: /Artículo anterior/ })).toHaveAttribute(
      "href",
      "/es/blog/json-repair-guide"
    );
    expect(within(articleNav).getByRole("link", { name: /Artículo siguiente/ })).toHaveAttribute(
      "href",
      "/es/blog/prompt-injection-testing"
    );
  });

  it("generates Spanish article metadata with localized canonical and hreflang alternates", async () => {
    const metadata = await generateArticleMetadata({
      params: Promise.resolve({ locale: "es", slug: "json-repair-guide" })
    });

    expect(metadata.title).toBe("Cómo reparar JSON roto en segundos");
    expect(metadata.description).toContain("Aquí te explicamos cómo corregir JSON mal formado rápido");
    expect(metadata.alternates?.canonical).toBe("/es/blog/json-repair-guide");
    expect(metadata.metadataBase?.toString()).toBe("http://localhost:9320/");
    expect(metadata.alternates?.languages).toMatchObject({
      en: "http://localhost:9320/blog/json-repair-guide",
      es: "http://localhost:9320/es/blog/json-repair-guide",
      "zh-Hans": "http://localhost:9320/zh-hans/blog/json-repair-guide",
      "zh-Hant": "http://localhost:9320/zh-hant/blog/json-repair-guide",
      "x-default": "http://localhost:9320/blog/json-repair-guide"
    });
    expect(metadata.openGraph).toMatchObject({
      title: "Cómo reparar JSON roto en segundos — Toolars Blog",
      url: "/es/blog/json-repair-guide"
    });
  });

  it("generates localized blog index metadata", async () => {
    const metadata = await generateBlogIndexMetadata({
      params: Promise.resolve({ locale: "es" })
    });

    expect(String(metadata.title)).toContain("Blog de Toolars");
    expect(String(metadata.description)).toContain("Guías prácticas y sin anuncios");
    expect(metadata.alternates?.canonical).toBe("/es/blog");
    expect(metadata.metadataBase?.toString()).toBe("http://localhost:9320/");
    expect(metadata.openGraph).toMatchObject({
      title: "Blog de Toolars",
      description: "Guías para herramientas, IA y flujos de desarrollo",
      url: "/es/blog"
    });
  });

  it("generates localized metadata for migrated VitalCalc article routes", async () => {
    const metadata = await generateArticleMetadata({
      params: Promise.resolve({ locale: "es", slug: "what-is-bmi" })
    });

    expect(metadata.title).toBe("¿Qué es el IMC? Cómo entender el índice de masa corporal");
    expect(metadata.alternates?.canonical).toBe("/es/blog/what-is-bmi");
    expect(metadata.alternates?.languages).toMatchObject({
      en: "http://localhost:9320/blog/what-is-bmi",
      es: "http://localhost:9320/es/blog/what-is-bmi",
      "zh-Hans": "http://localhost:9320/zh-hans/blog/what-is-bmi",
      "zh-Hant": "http://localhost:9320/zh-hant/blog/what-is-bmi",
      "x-default": "http://localhost:9320/blog/what-is-bmi"
    });
  });

  it("generates Traditional Chinese article metadata with localized content", async () => {
    const metadata = await generateArticleMetadata({
      params: Promise.resolve({ locale: "zh-hant", slug: "json-repair-guide" })
    });

    expect(metadata.title).toBe("如何在幾秒內修復損壞的 JSON");
    expect(metadata.alternates?.canonical).toBe("/zh-hant/blog/json-repair-guide");
  });
});
