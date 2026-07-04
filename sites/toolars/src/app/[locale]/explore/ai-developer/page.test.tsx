import fs from "node:fs";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { renderWithIntl } from "@/test/i18n-test-utils";
import en from "../../../../../messages/en.json";
import AiDeveloperLabPage from "./page";

const aiDeveloperSentinelMessages = {
  ...en,
  directories: {
    ...en.directories,
    aiDeveloper: {
      ...en.directories.aiDeveloper,
      metricsAriaLabel: "AI 开发指标-哨兵",
      metrics: {
        labTools: {
          title: "实验室工具-哨兵",
          description: "来自 Aixtral Lab-哨兵"
        },
        categories: {
          title: "分类-哨兵",
          description: "安全到设计工具-哨兵"
        },
        localFirst: {
          title: "本地优先-哨兵",
          description: "尽可能无需上传运行-哨兵",
          meta: "82%"
        }
      },
      recommendedTitle: "推荐剧本-哨兵",
      recommendedPlaybooks: {
        jsonRepair: {
          title: "修复并验证 LLM JSON-哨兵",
          description: "生产可用 JSON payload-哨兵",
          meta: "运行-哨兵"
        },
        promptHardening: {
          title: "加固提示词表面-哨兵",
          description: "风险报告和红队变体-哨兵",
          meta: "运行-哨兵"
        },
        costReview: {
          title: "估算模型花费-哨兵",
          description: "发布复盘成本计划-哨兵",
          meta: "运行-哨兵"
        }
      },
      workflowsTitle: "实验室工作流-哨兵",
      workflowDescription: "{minutes} 分钟 · {runs} 次运行"
    }
  }
};

function activeSidebarLink(label: string) {
  const link = screen.getAllByText(label).map((node) => node.closest("a")).find(Boolean);
  if (!link) throw new Error(`Missing active sidebar link for ${label}`);
  return link;
}

describe("AiDeveloperLabPage", () => {
  it("does not leave hardcoded UI audit candidates in the AI developer source", () => {
    const file = "src/app/[locale]/explore/ai-developer/page.tsx";
    const source = fs.readFileSync(file, "utf8");
    const scan = scanSourceText(source, file);

    expect(scan.hardcodedText).toEqual([]);
  });

  it("renders the AI developer directory and marks the special AI sidebar entry active", () => {
    renderWithIntl(<AiDeveloperLabPage />);
    const aiLink = activeSidebarLink("AI");

    expect(screen.getByRole("heading", { name: "AI Developer Lab tools" })).toBeInTheDocument();
    expect(screen.getByText("JSON Repair")).toBeInTheDocument();
    expect(screen.getByText("LLM Cost Calculator")).toBeInTheDocument();
    expect(aiLink).toHaveAttribute("href", "/explore/ai-developer");
    expect(aiLink).toHaveAttribute("aria-current", "page");
    expect(aiLink).toHaveClass("is-active");
  });

  it("prefixes recommended AI developer links for routed non-default locales", () => {
    const { container } = render(
      <NextIntlClientProvider locale="zh-hans" messages={en}>
        <AiDeveloperLabPage />
      </NextIntlClientProvider>
    );

    expect(container.querySelector('a[href="/zh-hans/tools/json-repair"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/zh-hans/workflows/ai-prompt-hardening"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/zh-hans/workflows/llm-cost-review"]')).toBeInTheDocument();
  });

  it("renders AI developer hotspots from non-English messages", () => {
    render(
      <NextIntlClientProvider locale="zh-hans" messages={aiDeveloperSentinelMessages}>
        <AiDeveloperLabPage />
      </NextIntlClientProvider>
    );

    expect(screen.getByLabelText("AI 开发指标-哨兵")).toBeInTheDocument();
    expect(screen.getByText("实验室工具-哨兵")).toBeInTheDocument();
    expect(screen.getByText("来自 Aixtral Lab-哨兵")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "推荐剧本-哨兵" })).toBeInTheDocument();
    expect(screen.getByText("修复并验证 LLM JSON-哨兵")).toBeInTheDocument();
    expect(screen.getAllByText("运行-哨兵").length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "实验室工作流-哨兵" })).toBeInTheDocument();
    expect(screen.getByText("4 分钟 · +764 次运行")).toBeInTheDocument();
  });
});
