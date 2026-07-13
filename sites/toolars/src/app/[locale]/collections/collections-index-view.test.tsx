import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { describe, expect, it } from "vitest";
import { collections } from "@/data/registry";
import en from "../../../../messages/en.json";
import zhHans from "../../../../messages/zh-hans.json";
import { CollectionsIndexView } from "./collections-index-view";

function renderCollectionsInLocale(locale: string, messages: Record<string, unknown>) {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <CollectionsIndexView />
    </NextIntlClientProvider>
  );
}

describe("CollectionsIndexView", () => {
  it("renders the collections landing modules from the design", () => {
    const { container } = renderWithIntl(<CollectionsIndexView />);

    expect(container.querySelector('[data-collections-index="true"]')).toBeInTheDocument();
    expect(container.querySelector('[data-collections-mobile-layout="directory-cards"]')).toBeInTheDocument();
    expect(container.querySelector('[data-collections-index="true"]')).toHaveAttribute(
      "data-collections-density",
      "mobile-v2"
    );
    expect(screen.getByRole("heading", { name: "Collections for every kind of work" })).toBeInTheDocument();
    expect(screen.getByText("Collections for repeated work")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Create private collection" }).every((button) => !button.hasAttribute("disabled"))).toBe(true);
    expect(screen.getByText("Featured collections")).toBeInTheDocument();
    expect(screen.getByText("All collections")).toBeInTheDocument();
    expect(screen.getByText("Recently updated")).toBeInTheDocument();
    expect(screen.getByText("Suggested for you")).toBeInTheDocument();
    expect(screen.getByText("Create a private collection")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create collection" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Import bookmarks" })).toBeEnabled();
  });

  it("uses registry collections with open links and collection metadata", () => {
    const { container } = renderWithIntl(<CollectionsIndexView />);

    for (const collection of collections) {
      expect(screen.getAllByText(collection.title).length).toBeGreaterThan(0);
      expect(container.querySelector(`a[href="${collection.href}"]`)).toBeInTheDocument();
    }

    expect(screen.getAllByText("Official").length).toBeGreaterThan(0);
    expect(screen.queryByText("Finance Review")).not.toBeInTheDocument();
    expect(screen.queryByText("Health Basics")).not.toBeInTheDocument();
    expect(screen.getByText("Collections sync across devices")).toBeInTheDocument();
    expect(screen.getAllByText("Open").length).toBeGreaterThan(0);
  });

  it("creates a local collection draft and imports bookmark URLs", async () => {
    renderWithIntl(<CollectionsIndexView />);

    fireEvent.click(screen.getByRole("button", { name: "Create collection" }));
    const createDialog = screen.getByRole("dialog", { name: "Create collection" });
    fireEvent.change(within(createDialog).getByRole("textbox", { name: "Create collection" }), {
      target: { value: "Release favorites" }
    });
    fireEvent.click(within(createDialog).getByRole("button", { name: "Create collection" }));

    expect(within(createDialog).getByRole("status")).toHaveTextContent("Release favorites");
    expect(window.localStorage.getItem("toolars.local-collections:v1")).toContain("Release favorites");

    fireEvent.click(screen.getByRole("button", { name: "Import bookmarks" }));
    const importDialog = screen.getByRole("dialog", { name: "Import bookmarks" });
    const file = new File(['<a href="https://toolars.example/tools/pdf-toolkit">PDF Toolkit</a>'], "bookmarks.html", { type: "text/html" });
    Object.defineProperty(file, "text", { value: () => Promise.resolve('<a href="https://toolars.example/tools/pdf-toolkit">PDF Toolkit</a>') });
    fireEvent.change(within(importDialog).getByLabelText("Import bookmarks"), { target: { files: [file] } });
    fireEvent.submit(within(importDialog).getByRole("button", { name: "Import bookmarks" }).closest("form")!);

    await waitFor(() => expect(within(importDialog).getByRole("status")).toHaveTextContent("bookmarks.html"));
    expect(window.localStorage.getItem("toolars.imported-bookmarks:v1")).toContain("https://toolars.example/tools/pdf-toolkit");
  });

  it("uses real collection and tool icons instead of fake counts or initials", () => {
    const { container } = renderWithIntl(<CollectionsIndexView />);

    for (const collection of collections) {
      const cardIcon = container.querySelector(`[data-collection-card-icon="${collection.slug}"]`);
      const updateIcon = container.querySelector(`[data-collection-update-icon="${collection.slug}"]`);

      expect(cardIcon?.querySelector("svg")).toBeInTheDocument();
      expect(cardIcon).not.toHaveTextContent(/^\d+$/);
      expect(updateIcon?.querySelector("svg")).toBeInTheDocument();
      expect(updateIcon).not.toHaveTextContent(/^\d+$/);
    }

    expect(container.querySelectorAll(".collection-preview-icon .tool-icon").length).toBeGreaterThan(0);
    expect(container.querySelector(".collection-preview-icon")).not.toHaveTextContent(/^[A-Z]{2}$/);
  });

  it("prefixes collection links for routed non-default locales", () => {
    const { container } = renderCollectionsInLocale("zh-hans", en);

    expect(container.querySelector('a[href="/zh-hans/collections/pdf-ops-kit"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/zh-hans/collections/ai-developer-lab"]')).toBeInTheDocument();
  });

  it("localizes collection cards, audit labels, and routed hrefs in simplified Chinese", () => {
    const { container } = renderCollectionsInLocale("zh-hans", zhHans);

    expect(screen.getByLabelText("集合目录")).toBeInTheDocument();
    expect(screen.getAllByText("PDF 操作套件").length).toBeGreaterThan(0);
    expect(screen.getAllByText("本地 PDF 操作加上需同意的 AI 摘要。").length).toBeGreaterThan(0);
    expect(screen.getAllByText("官方").length).toBeGreaterThan(0);
    expect(screen.getAllByText("1 个工作流").length).toBeGreaterThan(0);
    expect(screen.getAllByText("今天更新").length).toBeGreaterThan(0);
    expect(screen.getByText("AI 开发实验室 · 3 个工作流")).toBeInTheDocument();
    expect(screen.getByText("PDF 操作套件 · 本地优先工具")).toBeInTheDocument();
    expect(screen.getAllByLabelText("PDF 操作套件 预览工具").length).toBeGreaterThan(0);
    expect(container.querySelector('a[href="/zh-hans/collections/pdf-ops-kit"]')).toBeInTheDocument();
    expect(screen.queryByLabelText("Collections directory")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("{标题} 预览工具")).not.toBeInTheDocument();
    expect(screen.queryByText("Updated today")).not.toBeInTheDocument();
  });
});
