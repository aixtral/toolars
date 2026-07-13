import fs from "node:fs";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { describe, expect, it } from "vitest";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../scripts/audit-i18n.mjs";
import { workflows } from "@/data/registry";
import en from "../../../../messages/en.json";
import zhHans from "../../../../messages/zh-hans.json";
import { WorkflowsIndexView } from "./workflows-index-view";

const workflowSentinelMessages = {
  ...en,
  workflowsPage: {
    ...en.workflowsPage,
    searchSubmitMobile: "前往-哨兵",
    examplesAriaLabel: "工作流示例-哨兵",
    exampleItems: ["摘要 PDF 报告-哨兵", "清理 CSV 并可视化-哨兵", "生成博客文章-哨兵", "调整社交图片-哨兵"],
    filtersAriaLabel: "工作流筛选-哨兵",
    filters: ["全部工作流-哨兵", "包含 AI-哨兵", "本地优先-哨兵", "团队就绪-哨兵"],
    card: {
      stepsAriaLabel: "{title} 步骤-哨兵",
      stepsCount: "{count} 个步骤-哨兵",
      aiStep: "AI 步骤-哨兵",
      noAi: "无 AI-哨兵",
      minutes: "{minutes} 分钟-哨兵",
      runs: "{runs} 次运行-哨兵",
      start: "开始-哨兵"
    },
    workflowCards: {
      "pdf-summary": {
        title: "PDF 摘要工作流构建器-哨兵",
        description: "合并 PDF 并导出引用-哨兵",
        steps: ["提取内容-哨兵", "AI 摘要-哨兵", "导出分享-哨兵"],
        mobileTileValue: "5",
        mobileMinutes: "6 分钟-哨兵",
        mobileRuns: "+1.2K 次运行-哨兵"
      },
      "ai-prompt-hardening": {
        title: "提示词加固-哨兵",
        description: "扫描注入风险-哨兵",
        steps: ["扫描注入-哨兵", "检测 PII-哨兵", "复盘风险-哨兵", "导出报告-哨兵"],
        mobileDescription: "扫描提示词并生成红队清单-哨兵",
        mobileRuns: "+764 次运行-哨兵"
      },
      "llm-cost-review": {
        title: "LLM 成本复盘-哨兵",
        description: "估算模型花费-哨兵",
        steps: ["估算 token-哨兵", "比较模型-哨兵", "复盘预算-哨兵", "导出计划-哨兵"],
        mobileRuns: "+689 次运行-哨兵"
      },
      "mcp-tool-launch": {
        title: "MCP 工具发布-哨兵",
        description: "构建 manifest-哨兵",
        steps: ["定义工具-哨兵", "构建 manifest-哨兵", "运行 MCP 测试-哨兵", "导出文档-哨兵"],
        mobileRuns: "+534 次运行-哨兵"
      }
    },
    fastStartResource: {
      title: "PDF 摘要-哨兵",
      description: "合并、提取、摘要并导出引用-哨兵"
    }
  }
};

describe("WorkflowsIndexView", () => {
  it("does not leave hardcoded UI audit candidates in the workflow index source", () => {
    const file = "src/app/[locale]/workflows/workflows-index-view.tsx";
    const source = fs.readFileSync(file, "utf8");
    const scan = scanSourceText(source, file);

    expect(scan.hardcodedText).toEqual([]);
  });

  it("renders the workflows landing modules from the design", () => {
    const { container } = renderWithIntl(<WorkflowsIndexView />);

    expect(container.querySelector('[data-workflows-index="true"]')).toBeInTheDocument();
    expect(container.querySelector('[data-workflows-index="true"]')).toHaveAttribute(
      "data-workflows-desktop-layout",
      "workflow-market-v2"
    );
    expect(container.querySelector(".workflow-example-row")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Workflows that finish the job" })).toBeInTheDocument();
    expect(screen.getByText("What are you trying to automate?")).toBeInTheDocument();
    expect(screen.getByText("Featured workflows")).toBeInTheDocument();
    expect(screen.getByText("Popular workflow templates")).toBeInTheDocument();
    expect(screen.getByText("Trending this week")).toBeInTheDocument();
    expect(screen.getAllByText("Build from scratch").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Create workflow" })).toBeEnabled();
    expect(screen.getByRole("link", { name: "Browse collections" })).toHaveAttribute("href", "/collections");
  });

  it("exposes the high-fidelity mobile workflow template directory structure", () => {
    const { container } = renderWithIntl(<WorkflowsIndexView />);

    expect(container.querySelector('[data-workflows-index="true"]')).toHaveAttribute(
      "data-workflows-mobile-layout",
      "template-directory"
    );
    expect(container.querySelector('[data-workflows-index="true"]')).toHaveAttribute(
      "data-workflows-density",
      "mobile-v2"
    );
    expect(screen.getByRole("button", { name: "Build from scratch" })).toBeEnabled();
    expect(screen.getByText("WF")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go" })).toHaveAttribute("href", "/workflows/pdf-summary");
    const filters = screen.getByRole("list", { name: "Workflow filters" });
    expect(within(filters).getByText("All workflows")).toHaveClass("active");
    expect(within(filters).getByText("Includes AI")).toBeInTheDocument();
    expect(within(filters).getByText("Local first")).toBeInTheDocument();
    expect(within(filters).getByText("Team ready")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Featured workflow templates" })).toBeInTheDocument();
    expect(screen.getAllByText("PDF Summary Workflow Builder").length).toBeGreaterThan(0);
    expect(screen.getAllByText("+1.2K runs").length).toBeGreaterThan(0);
  });

  it("uses registry workflows with start links and trust metadata", () => {
    const { container } = renderWithIntl(<WorkflowsIndexView />);

    for (const workflow of workflows) {
      expect(screen.getAllByText(workflow.title).length).toBeGreaterThan(0);
      expect(container.querySelector(`a[href="${workflow.href}"]`)).toBeInTheDocument();
    }

    expect(screen.getAllByText("AI step").length).toBeGreaterThan(0);
    expect(screen.getByText("Local-first steps")).toBeInTheDocument();
    expect(screen.getByText("Files removed after session")).toBeInTheDocument();
  });

  it("creates a persistent local workflow draft from every create entry point", () => {
    renderWithIntl(<WorkflowsIndexView />);

    fireEvent.click(screen.getByRole("button", { name: "Create workflow" }));

    const dialog = screen.getByRole("dialog", { name: "Create workflow" });
    fireEvent.change(within(dialog).getByRole("textbox", { name: "Create workflow" }), {
      target: { value: "Quarterly release review" }
    });
    fireEvent.click(within(dialog).getByRole("button", { name: "Create workflow" }));

    expect(within(dialog).getByRole("status")).toHaveTextContent("Quarterly release review");
    expect(window.localStorage.getItem("toolars.local-workflows:v1")).toContain("Quarterly release review");
    expect(screen.getByRole("button", { name: "Build from scratch" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Create custom workflow" })).toBeEnabled();
    expect(screen.getByRole("link", { name: "Browse templates" })).toHaveAttribute("href", "#templates");
  });

  it("uses semantic workflow icons instead of numeric or abbreviated icon placeholders", () => {
    const { container } = renderWithIntl(<WorkflowsIndexView />);

    for (const workflow of workflows) {
      const cardIcon = container.querySelector(`[data-workflow-card-icon="${workflow.slug}"]`);
      const rankedIcon = container.querySelector(`[data-workflow-ranked-icon="${workflow.slug}"]`);

      expect(cardIcon?.querySelector("svg")).toBeInTheDocument();
      expect(cardIcon).not.toHaveTextContent(/^\d+$/);
      expect(rankedIcon?.querySelector("svg")).toBeInTheDocument();
      expect(rankedIcon).not.toHaveTextContent(/^[A-Z]{2}$/);
    }
  });

  it("prefixes workflow links for routed non-default locales", () => {
    const { container } = render(
      <NextIntlClientProvider locale="zh-hans" messages={en}>
        <WorkflowsIndexView />
      </NextIntlClientProvider>
    );

    expect(container.querySelector('a[href="/zh-hans/workflows/pdf-summary"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/zh-hans/collections"]')).toBeInTheDocument();
  });

  it("renders workflow index hotspots from non-English messages", () => {
    const { container } = render(
      <NextIntlClientProvider locale="zh-hans" messages={workflowSentinelMessages}>
        <WorkflowsIndexView />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("link", { name: "前往-哨兵" })).toHaveAttribute("href", "/zh-hans/workflows/pdf-summary");
    expect(screen.getByLabelText("工作流示例-哨兵")).toBeInTheDocument();
    expect(screen.getByText("摘要 PDF 报告-哨兵")).toBeInTheDocument();
    const filters = screen.getByRole("list", { name: "工作流筛选-哨兵" });
    expect(within(filters).getByText("全部工作流-哨兵")).toHaveClass("active");
    expect(screen.getAllByText("PDF 摘要工作流构建器-哨兵").length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText("PDF 摘要工作流构建器-哨兵 步骤-哨兵").length).toBeGreaterThan(0);
    expect(screen.getAllByText("AI 步骤-哨兵").length).toBeGreaterThan(0);
    expect(screen.getAllByText("无 AI-哨兵").length).toBeGreaterThan(0);
    expect(screen.getAllByText("开始-哨兵").length).toBeGreaterThan(0);
    expect(screen.getAllByText("+1.2K 次运行-哨兵").length).toBeGreaterThan(0);
    expect(screen.getByText("PDF 摘要-哨兵")).toBeInTheDocument();
    expect(screen.getByText("合并、提取、摘要并导出引用-哨兵")).toBeInTheDocument();
    expect(container.querySelector('a[href="/zh-hans/collections"]')).toBeInTheDocument();
  });

  it("renders real simplified Chinese workflow labels with translated ICU placeholders", () => {
    render(
      <NextIntlClientProvider locale="zh-hans" messages={zhHans}>
        <WorkflowsIndexView />
      </NextIntlClientProvider>
    );

    expect(screen.getAllByLabelText("将 PDF 转成摘要 步骤").length).toBeGreaterThan(0);
    expect(screen.queryByLabelText("{标题} 步骤")).not.toBeInTheDocument();
  });
});
