import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { beforeEach, describe, expect, it, vi } from "vitest";
import en from "../../../messages/en.json";
import es from "../../../messages/es.json";
import zhHans from "../../../messages/zh-hans.json";
import zhHant from "../../../messages/zh-hant.json";
import { LanguageSwitcher } from "./language-switcher";

const usePathnameMock = vi.fn(() => "/tools/pdf-toolkit");

vi.mock("next/navigation", () => ({
  usePathname: () => usePathnameMock()
}));

function renderLanguageSwitcher(locale = "en", messages = en) {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LanguageSwitcher />
    </NextIntlClientProvider>
  );
}

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    usePathnameMock.mockReturnValue("/tools/pdf-toolkit");
  });

  it("renders a full language panel trigger instead of a bare locale code", () => {
    const { container } = renderLanguageSwitcher();

    expect(container.querySelector("[data-language-switcher='locale-pill-v3']")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Switch language: English" })).toHaveTextContent("EN");
  });

  it("keeps the same route while switching to and from the default locale", () => {
    usePathnameMock.mockReturnValue("/es/tools/pdf-toolkit");
    renderLanguageSwitcher("es", es);

    fireEvent.click(screen.getByRole("button", { name: "Cambiar idioma: Español" }));

    expect(screen.getByRole("option", { name: /English/ })).toHaveAttribute("href", "/tools/pdf-toolkit");
    expect(screen.getByRole("option", { name: /简体中文/ })).toHaveAttribute("href", "/zh-hans/tools/pdf-toolkit");
  });

  it("distinguishes simplified and traditional Chinese in the closed trigger", () => {
    const { rerender } = renderLanguageSwitcher("zh-hans", zhHans);

    expect(screen.getByRole("button", { name: "切换语言: 简体中文" })).toHaveTextContent("简体");
    expect(screen.getByRole("button", { name: "切换语言: 简体中文" })).not.toHaveTextContent("ZH");

    rerender(
      <NextIntlClientProvider locale="zh-hant" messages={zhHant}>
        <LanguageSwitcher />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("button", { name: "切換語言: 繁體中文" })).toHaveTextContent("繁體");
    expect(screen.getByRole("button", { name: "切換語言: 繁體中文" })).not.toHaveTextContent("ZH");
  });
});
