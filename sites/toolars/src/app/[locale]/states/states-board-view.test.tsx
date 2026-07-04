import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import zhHans from "../../../../messages/zh-hans.json";
import { renderWithIntl } from "@/test/i18n-test-utils";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../scripts/audit-i18n.mjs";
import StatesPage from "./page";
import { StatesBoardView } from "./states-board-view";

function renderStatesBoardInLocale(locale: string, messages: Record<string, unknown>) {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <StatesBoardView />
    </NextIntlClientProvider>
  );
}

const statesBoardSourceFile = "src/app/[locale]/states/states-board-view.tsx";

function scanStatesBoardSource() {
  return scanSourceText(readFileSync(statesBoardSourceFile, "utf8"), statesBoardSourceFile);
}

describe("StatesBoardView", () => {
  it("does not contribute states board hardcoded UI candidates to the i18n audit", () => {
    const sourceScan = scanStatesBoardSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the states and overlays modules from the design", () => {
    const { container } = renderWithIntl(<StatesBoardView />);

    expect(container.querySelector('[data-states-board-page="true"]')).toBeInTheDocument();
    expect(container.querySelector('[data-states-mobile-layout="state-gallery"]')).toBeInTheDocument();
    expect(container.querySelector('[data-states-density="mobile-v2"]')).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "States and overlays" })).toBeInTheDocument();
    expect(screen.getByText("Empty")).toBeInTheDocument();
    expect(screen.getByText("Loading")).toBeInTheDocument();
    expect(screen.getByText("Upload error")).toBeInTheDocument();
    expect(screen.getByText("Offline mode")).toBeInTheDocument();
    expect(screen.getByText("Toast stack")).toBeInTheDocument();
    expect(screen.getByText("Form validation")).toBeInTheDocument();
    expect(screen.getByText("Mobile drawer")).toBeInTheDocument();
    expect(screen.getByText("Delete confirmation")).toBeInTheDocument();
    expect(screen.getByText("Mobile command overlay")).toBeInTheDocument();
  });

  it("shows toast and destructive confirmation states", () => {
    renderWithIntl(<StatesBoardView />);

    expect(screen.getByText("Saved to PDF power user kit")).toBeInTheDocument();
    expect(screen.getByText("AI consent required before summarizing")).toBeInTheDocument();
    expect(screen.getByText("Upload failed. File exceeds 50 MB.")).toBeInTheDocument();
    expect(screen.getByText("Share link copied")).toBeInTheDocument();
    expect(screen.getByText("Delete saved output?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Show toast" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete output" })).toBeInTheDocument();
  });

  it("localizes the states board in simplified Chinese", () => {
    renderStatesBoardInLocale("zh-hans", zhHans);

    expect(screen.getByRole("heading", { name: "状态与覆盖层" })).toBeInTheDocument();
    expect(screen.getByLabelText("状态与覆盖层面板")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "显示通知" })).toBeInTheDocument();
    expect(screen.getByText("空状态")).toBeInTheDocument();
    expect(screen.getByText("删除已保存结果？")).toBeInTheDocument();
    expect(screen.queryByText("States and overlays")).not.toBeInTheDocument();
  });

  it("uses the no-sidebar shell variant for the states route", () => {
    renderWithIntl(<StatesPage />);

    expect(screen.queryByLabelText("Tool filters")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Admin review navigation")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "States and overlays" })).toBeInTheDocument();
  });
});
