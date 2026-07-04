import { readFileSync } from "node:fs";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { beforeEach, describe, expect, it, vi } from "vitest";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../scripts/audit-i18n.mjs";
import en from "../../../messages/en.json";
import es from "../../../messages/es.json";
import zhHans from "../../../messages/zh-hans.json";
import zhHant from "../../../messages/zh-hant.json";
import { DRAFT_LOCALES } from "../../lib/i18n";
import { LanguageSwitcher } from "./language-switcher";

const usePathnameMock = vi.fn(() => "/tools/pdf-toolkit");
const languageSwitcherSourceFile = "src/components/shell/language-switcher.tsx";
const globalStylesSourceFile = "src/app/globals.css";

vi.mock("next/navigation", () => ({
  usePathname: () => usePathnameMock()
}));

function renderLanguageSwitcher(locale = "en", messages = en, variant: "dropdown" | "inline" = "dropdown") {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LanguageSwitcher variant={variant} />
    </NextIntlClientProvider>
  );
}

function scanLanguageSwitcherSource() {
  return scanSourceText(readFileSync(languageSwitcherSourceFile, "utf8"), languageSwitcherSourceFile);
}

function readGlobalStyles() {
  return readFileSync(globalStylesSourceFile, "utf8");
}

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    usePathnameMock.mockReturnValue("/tools/pdf-toolkit");
  });

  it("renders a restrained RustDesk-inspired language trigger with the current language name", () => {
    const { container } = renderLanguageSwitcher();

    expect(container.querySelector("[data-language-switcher='rustdesk-language-select-v2']")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Switch language: English" })).toHaveTextContent("English");
    expect(screen.getByRole("button", { name: "Switch language: English" })).not.toHaveTextContent("EN");
  });

  it("keeps the language switcher source free of hardcoded UI scanner candidates", () => {
    const sourceScan = scanLanguageSwitcherSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("opens a compact native-language list without metadata clutter", () => {
    renderLanguageSwitcher();

    fireEvent.click(screen.getByRole("button", { name: "Switch language: English" }));

    expect(screen.getByRole("listbox", { name: "Switch language: English" })).toHaveAttribute(
      "data-language-panel",
      "rustdesk-native-list"
    );
    expect(screen.getByRole("option", { name: /English/ })).toHaveTextContent("English");
    expect(screen.getByRole("option", { name: /简体中文/ })).toHaveTextContent("简体中文");
    expect(screen.getByRole("listbox", { name: "Switch language: English" })).not.toHaveTextContent("/en");
    expect(screen.getByRole("listbox", { name: "Switch language: English" })).not.toHaveTextContent("Chinese (Simplified)");
  });

  it("opens the dropdown as a viewport-positioned panel so parent chrome cannot clip it", async () => {
    renderLanguageSwitcher();

    fireEvent.click(screen.getByRole("button", { name: "Switch language: English" }));

    await waitFor(() => {
      expect(screen.getByRole("listbox", { name: "Switch language: English" })).toHaveStyle({
        position: "fixed"
      });
    });
  });

  it("keeps the dropdown narrow enough to avoid empty right-side space", async () => {
    renderLanguageSwitcher();

    fireEvent.click(screen.getByRole("button", { name: "Switch language: English" }));

    await waitFor(() => {
      expect(screen.getByRole("listbox", { name: "Switch language: English" })).toHaveStyle({
        width: "120px"
      });
    });
  });

  it("keeps option left and right spacing balanced with a reserved check slot", () => {
    const { container } = renderLanguageSwitcher();

    fireEvent.click(screen.getByRole("button", { name: "Switch language: English" }));

    expect(container.querySelectorAll(".language-switcher-menu .language-switcher-option-check")).toHaveLength(4);
    expect(container.querySelectorAll(".language-switcher-menu .language-switcher-option-check.is-hidden")).toHaveLength(3);
    expect(readGlobalStyles()).toContain("width: min(120px, calc(100vw - 24px));");
    expect(readGlobalStyles()).toContain("box-sizing: border-box;");
    expect(readGlobalStyles()).toContain("width: 100%;");
    expect(readGlobalStyles()).toContain("padding: 0 8px;");
  });

  it("marks the current language as the active option", () => {
    renderLanguageSwitcher("es", es);

    fireEvent.click(screen.getByRole("button", { name: "Cambiar idioma: Español" }));

    expect(screen.getByRole("option", { name: /Español/ })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("option", { name: /Español/ })).toHaveClass("is-active");
    expect(screen.getByRole("option", { name: /English/ })).toHaveAttribute("aria-selected", "false");
  });

  it("renders a direct native-language list for mobile menus", () => {
    const { container } = renderLanguageSwitcher("en", en, "inline");
    const inlineList = container.querySelector("[data-language-switcher='rustdesk-inline-language-list-v1']");

    expect(inlineList).toBeInTheDocument();
    expect(within(inlineList as HTMLElement).queryByRole("button")).not.toBeInTheDocument();
    expect(within(inlineList as HTMLElement).getAllByRole("option")).toHaveLength(4);
    expect(within(inlineList as HTMLElement).getByRole("option", { name: /繁體中文/ })).toHaveAttribute(
      "href",
      "/zh-hant/tools/pdf-toolkit"
    );
  });

  it("keeps the same route while switching to and from the default locale", () => {
    usePathnameMock.mockReturnValue("/es/tools/pdf-toolkit");
    renderLanguageSwitcher("es", es);

    fireEvent.click(screen.getByRole("button", { name: "Cambiar idioma: Español" }));

    expect(screen.getByRole("option", { name: /English/ })).toHaveAttribute("href", "/tools/pdf-toolkit");
    expect(screen.getByRole("option", { name: /简体中文/ })).toHaveAttribute("href", "/zh-hans/tools/pdf-toolkit");
  });

  it.each([
    {
      currentLocale: "en",
      currentMessages: en,
      currentPath: "/explore/pdf",
      targetName: /Español/,
      targetHref: "/es/explore/pdf",
      triggerName: "Switch language: English"
    },
    {
      currentLocale: "zh-hans",
      currentMessages: zhHans,
      currentPath: "/zh-hans/explore/ai-developer",
      targetName: /English/,
      targetHref: "/explore/ai-developer",
      triggerName: "切换语言: 简体中文"
    },
    {
      currentLocale: "es",
      currentMessages: es,
      currentPath: "/es/explore/finance",
      targetName: /繁體中文/,
      targetHref: "/zh-hant/explore/finance",
      triggerName: "Cambiar idioma: Español"
    }
  ])("preserves the special explore path while switching from $currentPath", ({ currentLocale, currentMessages, currentPath, targetName, targetHref, triggerName }) => {
    usePathnameMock.mockReturnValue(currentPath);
    renderLanguageSwitcher(currentLocale, currentMessages);

    fireEvent.click(screen.getByRole("button", { name: triggerName }));

    expect(screen.getByRole("option", { name: targetName })).toHaveAttribute("href", targetHref);
  });

  it("shows only routed launch locales while draft locales remain hidden", () => {
    renderLanguageSwitcher();

    fireEvent.click(screen.getByRole("button", { name: "Switch language: English" }));

    expect(screen.getAllByRole("option")).toHaveLength(4);
    for (const locale of DRAFT_LOCALES) {
      expect(screen.queryByRole("option", { name: locale.label }), locale.code).not.toBeInTheDocument();
    }

    const { container } = renderLanguageSwitcher("en", en, "inline");
    const inlineList = container.querySelector("[data-language-switcher='rustdesk-inline-language-list-v1']");
    expect(within(inlineList as HTMLElement).getAllByRole("option")).toHaveLength(4);
    for (const locale of DRAFT_LOCALES) {
      expect(within(inlineList as HTMLElement).queryByRole("option", { name: locale.label }), locale.code).not.toBeInTheDocument();
    }
  });

  it("distinguishes simplified and traditional Chinese in the closed trigger", () => {
    const { rerender } = renderLanguageSwitcher("zh-hans", zhHans);

    expect(screen.getByRole("button", { name: "切换语言: 简体中文" })).toHaveTextContent("简体中文");
    expect(screen.getByRole("button", { name: "切换语言: 简体中文" })).not.toHaveTextContent("ZH");

    rerender(
      <NextIntlClientProvider locale="zh-hant" messages={zhHant}>
        <LanguageSwitcher />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("button", { name: "切換語言: 繁體中文" })).toHaveTextContent("繁體中文");
    expect(screen.getByRole("button", { name: "切換語言: 繁體中文" })).not.toHaveTextContent("ZH");
  });

  it("closes the language panel on outside click", () => {
    renderLanguageSwitcher();

    fireEvent.click(screen.getByRole("button", { name: "Switch language: English" }));
    expect(screen.getByRole("listbox", { name: "Switch language: English" })).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(screen.queryByRole("listbox", { name: "Switch language: English" })).not.toBeInTheDocument();
  });

  it("closes the language panel when Escape is pressed", () => {
    renderLanguageSwitcher();

    fireEvent.click(screen.getByRole("button", { name: "Switch language: English" }));
    expect(screen.getByRole("listbox", { name: "Switch language: English" })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("listbox", { name: "Switch language: English" })).not.toBeInTheDocument();
  });
});
