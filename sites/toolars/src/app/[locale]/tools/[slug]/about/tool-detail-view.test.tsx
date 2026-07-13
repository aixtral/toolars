import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { describe, expect, it } from "vitest";
import { getAllToolDetails, getToolDetailBySlug } from "@/data/tool-details";
import es from "../../../../../../messages/es.json";
import zhHans from "../../../../../../messages/zh-hans.json";
import zhHant from "../../../../../../messages/zh-hant.json";
import { generateMetadata, generateStaticParams, getDetailShellActive } from "./page";
import { ToolDetailView } from "./tool-detail-view";

function renderWithZhHans(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="zh-hans" messages={zhHans}>
      {ui}
    </NextIntlClientProvider>
  );
}

function renderWithLocale(locale: string, messages: typeof es, ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe("ToolDetailView", () => {
  it("renders the Prompt Injection Scanner public listing template", () => {
    const detail = getToolDetailBySlug("prompt-injection-scanner");
    if (!detail) throw new Error("missing prompt detail");

    const { container } = renderWithIntl(<ToolDetailView detail={detail} />);

    expect(container.querySelector('[data-tool-detail="prompt-injection-scanner"]')).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Prompt Injection Scanner details" })).toBeInTheDocument();
    expect(container.querySelector(".tool-detail-hero-summary")).toBeInTheDocument();
    expect(container.querySelector(".tool-detail-overview-panel")).toBeInTheDocument();
    expect(container.querySelector(".tool-detail-how-it-works-panel")).toBeInTheDocument();
    expect(container.querySelector(".tool-detail-primary-action")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/prompt-injection-scanner"
    );
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("How it works")).toBeInTheDocument();
    expect(screen.getByText("Privacy and review model")).toBeInTheDocument();
    expect(screen.getByText("Implementation handoff")).toBeInTheDocument();
    expect(screen.getByText("Included in collections")).toBeInTheDocument();
    expect(screen.getByText("Related tools")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /AI Prompt Hardening/ })).toHaveAttribute(
      "href",
      "/workflows/ai-prompt-hardening"
    );
  });

  it("does not present static migration metadata as runtime tool metrics", () => {
    const detail = getToolDetailBySlug("prompt-injection-scanner");
    if (!detail) throw new Error("missing prompt detail");

    const { container } = renderWithIntl(<ToolDetailView detail={detail} />);

    expect(container.querySelector(".detail-metric-grid")).not.toBeInTheDocument();
  });

  it("does not present static metrics for any public tool detail route", () => {
    for (const detail of getAllToolDetails()) {
      const { container, unmount } = renderWithIntl(<ToolDetailView detail={detail} />);

      expect(container.querySelector(".detail-metric-grid"), detail.tool.slug).not.toBeInTheDocument();
      unmount();
    }
  });

  it("renders detail-specific copy for the cost calculator template", () => {
    const detail = getToolDetailBySlug("llm-cost-calculator");
    if (!detail) throw new Error("missing cost detail");

    renderWithIntl(<ToolDetailView detail={detail} />);

    expect(screen.getByRole("heading", { name: "LLM Cost Calculator details" })).toBeInTheDocument();
    expect(screen.getByText("Pricing and limits")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /LLM Cost Review/ })).toHaveAttribute(
      "href",
      "/workflows/llm-cost-review"
    );
  });

  it("localizes generic detail labels and internal hrefs in zh-hans", () => {
    const detail = getToolDetailBySlug("pdf-toolkit");
    if (!detail) throw new Error("missing PDF detail");

    renderWithZhHans(<ToolDetailView detail={detail} />);

    expect(screen.getByText("公开工具列表")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "PDF 工具箱 详情" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "分享" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "打开工具" })).toHaveAttribute("href", "/zh-hans/tools/pdf-toolkit");
    expect(screen.getByText("概览")).toBeInTheDocument();
    expect(screen.getByText("工作方式")).toBeInTheDocument();
    expect(screen.getByText("实现交接")).toBeInTheDocument();
    expect(screen.getByText("收录于集合")).toBeInTheDocument();
    expect(screen.getByText("相关工具")).toBeInTheDocument();
    expect(screen.getByText("推荐工作流")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /PDF Ops Kit/ })).toHaveAttribute(
      "href",
      "/zh-hans/collections/pdf-ops-kit"
    );
    expect(screen.getByRole("link", { name: /PDF Merger/ })).toHaveAttribute(
      "href",
      "/zh-hans/tools/pdf-merger/about"
    );
    expect(screen.getByRole("link", { name: /Turn PDF into summary/ })).toHaveAttribute(
      "href",
      "/zh-hans/workflows/pdf-summary"
    );

    fireEvent.click(screen.getByRole("button", { name: "分享" }));

    expect(screen.getByRole("dialog", { name: "分享此工具" })).toBeInTheDocument();
    expect(screen.getByDisplayValue("/zh-hans/tools/pdf-toolkit/about")).toBeInTheDocument();
  });

  it.each([
    ["es", es, "Kit de herramientas PDF combina operaciones locales y pasos guiados para que puedas revisar el trabajo antes de exportar o continuar.", "Esta ficha explica el objetivo de Kit de herramientas PDF, los pasos principales y los límites que conviene revisar antes de usar un resultado.", "La revisión mantiene visibles las condiciones de privacidad, procesamiento y uso responsable antes de continuar."],
    ["zh-hans", zhHans, "PDF 工具箱将本地操作与引导步骤结合起来，让你在导出或继续前完成审查。", "此详情页说明 PDF 工具箱 的用途、主要步骤，以及在使用结果前应确认的边界。", "继续前请确认隐私、处理方式和负责任使用的条件。"],
    ["zh-hant", zhHant, "PDF 工具箱結合本機操作與引導步驟，讓你在匯出或繼續前完成審查。", "此詳情頁說明 PDF 工具箱 的用途、主要步驟，以及使用結果前應確認的界限。", "繼續前請確認隱私、處理方式和負責任使用的條件。"]
  ])("uses complete localized content instead of English detail body in %s", (locale, messages, hero, overview, trust) => {
    const detail = getToolDetailBySlug("pdf-toolkit");
    if (!detail) throw new Error("missing PDF detail");

    renderWithLocale(locale, messages, <ToolDetailView detail={detail} />);

    expect(screen.getByText(hero)).toBeInTheDocument();
    expect(screen.getByText(overview)).toBeInTheDocument();
    expect(screen.getByText(trust)).toBeInTheDocument();
    expect(screen.queryByText("Merge, split, compress, convert, summarize, and export PDFs in one place.")).not.toBeInTheDocument();
    expect(screen.queryByText(detail.overview)).not.toBeInTheDocument();
    expect(screen.getByText(locale === "es" ? "Cómo funciona" : locale === "zh-hans" ? "工作方式" : "運作方式")).toBeInTheDocument();
    expect(screen.getByText(locale === "es" ? "Traspaso de implementación" : locale === "zh-hans" ? "实现交接" : "實作交接")).toBeInTheDocument();
  });

  it("passes the route locale to About metadata", async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ locale: "zh-hans", slug: "pdf-toolkit" }) });

    expect(metadata.title).toBe("PDF 工具箱概览");
    expect(metadata.alternates?.canonical).toBe("/zh-hans/tools/pdf-toolkit/about");
    expect(metadata.openGraph).toMatchObject({ url: "/zh-hans/tools/pdf-toolkit/about" });
  });

  it("renders the designed PDF Toolkit and JSON Repair public listings", () => {
    const pdfDetail = getToolDetailBySlug("pdf-toolkit");
    const jsonDetail = getToolDetailBySlug("json-repair");
    if (!pdfDetail || !jsonDetail) throw new Error("missing designed detail");

    const { rerender } = renderWithIntl(<ToolDetailView detail={pdfDetail} />);

    expect(screen.getByRole("heading", { name: "PDF Toolkit details" })).toBeInTheDocument();
    expect(document.querySelector('[data-tool-detail="pdf-toolkit"]')).toHaveAttribute(
      "data-public-detail-density",
      "pdf-toolkit-mobile-v2"
    );
    expect(Array.from(document.querySelectorAll(".detail-badge-row .badge")).map((node) => node.textContent)).toEqual([
      "Verified",
      "Free",
      "Local"
    ]);
    expect(screen.getByText("PDF processing model")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open tool" })).toHaveAttribute("href", "/tools/pdf-toolkit");
    expect(screen.getByRole("link", { name: /Turn PDF into summary/ })).toHaveAttribute(
      "href",
      "/workflows/pdf-summary"
    );
    expect(screen.queryByText("4 min · +1,240 runs")).not.toBeInTheDocument();

    rerender(<ToolDetailView detail={jsonDetail} />);

    expect(screen.getByRole("heading", { name: "JSON Repair details" })).toBeInTheDocument();
    expect(Array.from(document.querySelectorAll(".detail-badge-row .badge")).map((node) => node.textContent)).toEqual([
      "Local first",
      "Free trial",
      "JSON",
      "LLM",
      "API"
    ]);
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute("href", "/tools/json-repair");
    expect(screen.getByRole("link", { name: /AI Prompt Hardening/ })).toHaveAttribute(
      "href",
      "/workflows/ai-prompt-hardening"
    );
  });

  it("marks high-fidelity public detail pages for mobile rhythm tuning only", () => {
    const designedSlugs = [
      "pdf-toolkit",
      "json-repair",
      "prompt-injection-scanner",
      "llm-cost-calculator",
      "mcp-server-builder"
    ];

    for (const slug of designedSlugs) {
      const detail = getToolDetailBySlug(slug);
      if (!detail) throw new Error(`missing ${slug} detail`);

      const { container, unmount } = renderWithIntl(<ToolDetailView detail={detail} />);

      expect(container.querySelector(`[data-tool-detail="${slug}"]`)).toHaveAttribute(
        "data-designed-public-detail",
        "true"
      );

      unmount();
    }

    const mortgageDetail = getToolDetailBySlug("mortgage-calculator");
    if (!mortgageDetail) throw new Error("missing mortgage detail");

    const { container } = renderWithIntl(<ToolDetailView detail={mortgageDetail} />);

    expect(container.querySelector('[data-tool-detail="mortgage-calculator"]')).not.toHaveAttribute(
      "data-designed-public-detail"
    );
  });

  it("marks AI Developer Lab public details for tighter mobile rhythm", () => {
    const aiDetailSlugs = [
      "json-repair",
      "prompt-injection-scanner",
      "llm-cost-calculator",
      "mcp-server-builder"
    ];

    for (const slug of aiDetailSlugs) {
      const detail = getToolDetailBySlug(slug);
      if (!detail) throw new Error(`missing ${slug} detail`);

      const { container, unmount } = renderWithIntl(<ToolDetailView detail={detail} />);

      expect(container.querySelector(`[data-tool-detail="${slug}"]`)).toHaveAttribute(
        "data-ai-lab-detail",
        "true"
      );

      unmount();
    }

    const pdfDetail = getToolDetailBySlug("pdf-toolkit");
    if (!pdfDetail) throw new Error("missing PDF detail");

    const { container } = renderWithIntl(<ToolDetailView detail={pdfDetail} />);

    expect(container.querySelector('[data-tool-detail="pdf-toolkit"]')).not.toHaveAttribute(
      "data-ai-lab-detail"
    );
  });

  it("uses high-fidelity public-detail copy for designed mobile screens", () => {
    const pdfDetail = getToolDetailBySlug("pdf-toolkit");
    const jsonDetail = getToolDetailBySlug("json-repair");
    const mcpDetail = getToolDetailBySlug("mcp-server-builder");
    if (!pdfDetail || !jsonDetail || !mcpDetail) throw new Error("missing designed detail copy");

    const { rerender } = renderWithIntl(<ToolDetailView detail={pdfDetail} />);

    expect(
      screen.getByText("Merge, split, compress, convert, summarize, and export PDFs in one place.")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "PDF Toolkit is the default Toolars workspace for local PDF operations. It supports merge, split, compress, convert, extract, protect, watermark, and optional AI summary flows."
      )
    ).toBeInTheDocument();

    rerender(<ToolDetailView detail={jsonDetail} />);

    expect(
      screen.getByText(
        "Fix malformed LLM JSON output, trailing commas, quotes, and broken arrays. This listing explains the production contract, privacy posture, and handoff notes for the Toolars developer catalog."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "JSON Repair is the default rescue workspace for broken LLM output, API payloads, and copied object literals. It should feel fast, local, and predictable before deeper validation steps."
      )
    ).toBeInTheDocument();

    rerender(<ToolDetailView detail={mcpDetail} />);

    expect(
      screen.getByText(
        "Draft MCP tool definitions, resources, server manifest, and test payloads. This listing captures the catalog promise, launch review model, and developer handoff for agent-facing tool servers."
      )
    ).toBeInTheDocument();
  });

  it("opens the share modal from a public tool detail page", () => {
    const detail = getToolDetailBySlug("pdf-toolkit");
    if (!detail) throw new Error("missing PDF detail");

    renderWithIntl(<ToolDetailView detail={detail} />);

    fireEvent.click(screen.getByRole("button", { name: "Share" }));

    expect(screen.getByRole("dialog", { name: "Share this tool" })).toBeInTheDocument();
    expect(screen.getByDisplayValue("/tools/pdf-toolkit/about")).toBeInTheDocument();
    expect(screen.getByText("PDF Toolkit")).toBeInTheDocument();
  });

  it("renders a VitalCalc public listing using the shared detail template", () => {
    const detail = getToolDetailBySlug("mortgage-calculator");
    if (!detail) throw new Error("missing mortgage detail");

    renderWithIntl(<ToolDetailView detail={detail} />);

    expect(screen.getByRole("heading", { name: "Mortgage Calculator details" })).toBeInTheDocument();
    expect(screen.getAllByText("Free").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Local").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/mortgage-calculator"
    );
  });

  it("generates static about routes for the featured VitalCalc detail pages", () => {
    expect(generateStaticParams()).toEqual(
      expect.arrayContaining([
        { slug: "mortgage-calculator" },
        { slug: "bmi-calculator" },
        { slug: "loan-calculator" }
      ])
    );
  });

  it("generates static about routes for the designed Toolars and lab detail pages", () => {
    expect(generateStaticParams()).toEqual(
      expect.arrayContaining([{ slug: "pdf-toolkit" }, { slug: "json-repair" }])
    );
  });

  it("generates static about routes for the second VitalCalc detail batch", () => {
    expect(generateStaticParams()).toEqual(
      expect.arrayContaining([
        { slug: "retirement-calculator" },
        { slug: "debt-payoff" },
        { slug: "roi-calculator" },
        { slug: "tdee-calculator" },
        { slug: "body-fat-calculator" },
        { slug: "protein-calculator" }
      ])
    );
  });

  it("generates static about routes for VitalCalc tools referenced by existing related cards", () => {
    expect(generateStaticParams()).toEqual(
      expect.arrayContaining([
        { slug: "compound-interest" },
        { slug: "bmr-calculator" },
        { slug: "water-intake" }
      ])
    );
  });

  it("generates static about routes for the third VitalCalc detail batch", () => {
    expect(generateStaticParams()).toEqual(
      expect.arrayContaining([
        { slug: "income-tax" },
        { slug: "fire-calculator" },
        { slug: "discount-calculator" },
        { slug: "heart-rate-zone" },
        { slug: "sleep-calculator" },
        { slug: "ideal-weight-calculator" }
      ])
    );
  });

  it("generates static about routes for the fourth VitalCalc detail batch", () => {
    expect(generateStaticParams()).toEqual(
      expect.arrayContaining([
        { slug: "car-loan" },
        { slug: "rent-vs-buy" },
        { slug: "home-affordability-calculator" },
        { slug: "waist-hip-ratio" },
        { slug: "blood-pressure" },
        { slug: "child-growth" }
      ])
    );
  });

  it("generates static about routes for the fifth VitalCalc detail batch", () => {
    expect(generateStaticParams()).toEqual(
      expect.arrayContaining([
        { slug: "student-loan-calculator" },
        { slug: "apy-calculator" },
        { slug: "rule-of-72" },
        { slug: "calorie-deficit" },
        { slug: "macro-calculator" },
        { slug: "lean-body-mass" }
      ])
    );
  });

  it("generates static about routes for the sixth VitalCalc detail batch", () => {
    expect(generateStaticParams()).toEqual(
      expect.arrayContaining([
        { slug: "emergency-fund" },
        { slug: "savings-goal" },
        { slug: "dti-calculator" },
        { slug: "net-worth-calculator" },
        { slug: "budget-rule" },
        { slug: "side-income-tax" }
      ])
    );
  });

  it("generates static about routes for the seventh VitalCalc detail batch", () => {
    expect(generateStaticParams()).toEqual(
      expect.arrayContaining([
        { slug: "intermittent-fasting" },
        { slug: "creatine-calculator" },
        { slug: "vo2-max" },
        { slug: "biological-age" },
        { slug: "glycemic-load" },
        { slug: "30-30-30-method" }
      ])
    );
  });

  it("generates static about routes for the eighth VitalCalc detail batch", () => {
    expect(generateStaticParams()).toEqual(
      expect.arrayContaining([
        { slug: "tip-calculator" },
        { slug: "bill-split-calculator" },
        { slug: "unit-converter" },
        { slug: "hourly-to-salary" },
        { slug: "inflation-calculator" },
        { slug: "habit-cost" }
      ])
    );
  });

  it("generates static about routes for the ninth VitalCalc detail batch", () => {
    expect(generateStaticParams()).toEqual(
      expect.arrayContaining([
        { slug: "caffeine-calculator" },
        { slug: "alcohol-metabolism" },
        { slug: "blood-sugar-calculator" },
        { slug: "drink-calories" },
        { slug: "fiber-intake" },
        { slug: "steps-to-calories" }
      ])
    );
  });

  it("generates static about routes for the tenth VitalCalc detail batch", () => {
    expect(generateStaticParams()).toEqual(
      expect.arrayContaining([
        { slug: "currency-converter" },
        { slug: "percentage-calculator" },
        { slug: "stock-average" },
        { slug: "credit-card-apr" },
        { slug: "investment-fee" },
        { slug: "investment-goal" }
      ])
    );
  });

  it("generates static about routes for the eleventh VitalCalc detail batch", () => {
    expect(generateStaticParams()).toEqual(
      expect.arrayContaining([
        { slug: "credit-score-simulator" },
        { slug: "crypto-tax" },
        { slug: "freelance-rate" },
        { slug: "subscription-audit" },
        { slug: "savings-challenge" },
        { slug: "city-cost-comparison" }
      ])
    );
  });

  it("generates static about routes for the twelfth VitalCalc detail batch", () => {
    expect(generateStaticParams()).toEqual(
      expect.arrayContaining([
        { slug: "social-insurance-calculator" },
        { slug: "dividend-reinvestment" },
        { slug: "mortgage-refinance-calculator" },
        { slug: "coast-fire" },
        { slug: "sip-calculator" },
        { slug: "smoke-free" }
      ])
    );
  });

  it("generates static about routes for the thirteenth VitalCalc detail batch", () => {
    expect(generateStaticParams()).toEqual(
      expect.arrayContaining([
        { slug: "adhd-screener" },
        { slug: "burnout-assessment" },
        { slug: "gad7-anxiety" },
        { slug: "phq9-depression" },
        { slug: "pss10-stress" },
        { slug: "glp1-eligibility" }
      ])
    );
  });

  it("generates static about routes for the final VitalCalc source detail batch", () => {
    expect(generateStaticParams()).toEqual(
      expect.arrayContaining([
        { slug: "body-recomposition" },
        { slug: "glp1-nutrition" },
        { slug: "homa-ir" },
        { slug: "one-rep-max" },
        { slug: "ovulation-calculator" },
        { slug: "pregnancy-due-date" },
        { slug: "running-pace" },
        { slug: "testosterone-calculator" }
      ])
    );
  });

  it("renders a second-batch VitalCalc detail with the shared local template", () => {
    const detail = getToolDetailBySlug("tdee-calculator");
    if (!detail) throw new Error("missing TDEE detail");

    renderWithIntl(<ToolDetailView detail={detail} />);

    expect(screen.getByRole("heading", { name: "TDEE Calculator details" })).toBeInTheDocument();
    expect(screen.getAllByText("VitalCalc source").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Local").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/tdee-calculator"
    );
  });

  it("renders a related coverage VitalCalc detail with the shared local template", () => {
    const detail = getToolDetailBySlug("bmr-calculator");
    if (!detail) throw new Error("missing BMR detail");

    renderWithIntl(<ToolDetailView detail={detail} />);

    expect(screen.getByRole("heading", { name: "BMR Calculator details" })).toBeInTheDocument();
    expect(screen.getAllByText("VitalCalc source").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/bmr-calculator"
    );
  });

  it("renders third-batch VitalCalc finance and health details with the shared local template", () => {
    const fireDetail = getToolDetailBySlug("fire-calculator");
    const sleepDetail = getToolDetailBySlug("sleep-calculator");
    if (!fireDetail || !sleepDetail) throw new Error("missing third-batch details");

    const { rerender } = renderWithIntl(<ToolDetailView detail={fireDetail} />);

    expect(screen.getByRole("heading", { name: "FIRE Calculator details" })).toBeInTheDocument();
    expect(screen.getAllByText("VitalCalc source").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/fire-calculator"
    );

    rerender(<ToolDetailView detail={sleepDetail} />);

    expect(screen.getByRole("heading", { name: "Sleep Calculator details" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/sleep-calculator"
    );
  });

  it("renders fourth-batch VitalCalc finance and health details with the shared local template", () => {
    const rentDetail = getToolDetailBySlug("rent-vs-buy");
    const pressureDetail = getToolDetailBySlug("blood-pressure");
    if (!rentDetail || !pressureDetail) throw new Error("missing fourth-batch details");

    const { rerender } = renderWithIntl(<ToolDetailView detail={rentDetail} />);

    expect(screen.getByRole("heading", { name: "Rent vs Buy Calculator details" })).toBeInTheDocument();
    expect(screen.getAllByText("VitalCalc source").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/rent-vs-buy"
    );

    rerender(<ToolDetailView detail={pressureDetail} />);

    expect(screen.getByRole("heading", { name: "Blood Pressure Calculator details" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/blood-pressure"
    );
  });

  it("renders fifth-batch VitalCalc finance and health details with the shared local template", () => {
    const apyDetail = getToolDetailBySlug("apy-calculator");
    const macroDetail = getToolDetailBySlug("macro-calculator");
    if (!apyDetail || !macroDetail) throw new Error("missing fifth-batch details");

    const { rerender } = renderWithIntl(<ToolDetailView detail={apyDetail} />);

    expect(screen.getByRole("heading", { name: "APY Calculator details" })).toBeInTheDocument();
    expect(screen.getAllByText("VitalCalc source").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/apy-calculator"
    );

    rerender(<ToolDetailView detail={macroDetail} />);

    expect(screen.getByRole("heading", { name: "Macro Calculator details" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/macro-calculator"
    );
  });

  it("renders sixth-batch VitalCalc finance planning details with the shared local template", () => {
    const emergencyDetail = getToolDetailBySlug("emergency-fund");
    const sideTaxDetail = getToolDetailBySlug("side-income-tax");
    if (!emergencyDetail || !sideTaxDetail) throw new Error("missing sixth-batch details");

    const { rerender } = renderWithIntl(<ToolDetailView detail={emergencyDetail} />);

    expect(screen.getByRole("heading", { name: "Emergency Fund Calculator details" })).toBeInTheDocument();
    expect(screen.getAllByText("VitalCalc source").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/emergency-fund"
    );

    rerender(<ToolDetailView detail={sideTaxDetail} />);

    expect(screen.getByRole("heading", { name: "Side Income Tax Calculator details" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/side-income-tax"
    );
  });

  it("renders seventh-batch VitalCalc health and wellness details with the shared local template", () => {
    const fastingDetail = getToolDetailBySlug("intermittent-fasting");
    const glycemicDetail = getToolDetailBySlug("glycemic-load");
    if (!fastingDetail || !glycemicDetail) throw new Error("missing seventh-batch details");

    const { rerender } = renderWithIntl(<ToolDetailView detail={fastingDetail} />);

    expect(screen.getByRole("heading", { name: "Intermittent Fasting Calculator details" })).toBeInTheDocument();
    expect(screen.getAllByText("VitalCalc source").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/intermittent-fasting"
    );

    rerender(<ToolDetailView detail={glycemicDetail} />);

    expect(screen.getByRole("heading", { name: "Glycemic Load Calculator details" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/glycemic-load"
    );
  });

  it("renders eighth-batch VitalCalc utility and finance details with the shared local template", () => {
    const tipDetail = getToolDetailBySlug("tip-calculator");
    const unitDetail = getToolDetailBySlug("unit-converter");
    if (!tipDetail || !unitDetail) throw new Error("missing eighth-batch details");

    const { rerender } = renderWithIntl(<ToolDetailView detail={tipDetail} />);

    expect(screen.getByRole("heading", { name: "Tip Calculator details" })).toBeInTheDocument();
    expect(screen.getAllByText("VitalCalc source").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/tip-calculator"
    );

    rerender(<ToolDetailView detail={unitDetail} />);

    expect(screen.getByRole("heading", { name: "Unit Converter details" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/unit-converter"
    );
  });

  it("renders ninth-batch VitalCalc lifestyle and nutrition details with the shared local template", () => {
    const caffeineDetail = getToolDetailBySlug("caffeine-calculator");
    const drinkDetail = getToolDetailBySlug("drink-calories");
    if (!caffeineDetail || !drinkDetail) throw new Error("missing ninth-batch details");

    const { rerender } = renderWithIntl(<ToolDetailView detail={caffeineDetail} />);

    expect(screen.getByRole("heading", { name: "Caffeine Safe Limit Calculator details" })).toBeInTheDocument();
    expect(screen.getAllByText("VitalCalc source").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/caffeine-calculator"
    );

    rerender(<ToolDetailView detail={drinkDetail} />);

    expect(screen.getByRole("heading", { name: "Drink Calories Calculator details" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/drink-calories"
    );
  });

  it("renders tenth-batch VitalCalc finance utility and investment details with the shared local template", () => {
    const currencyDetail = getToolDetailBySlug("currency-converter");
    const feeDetail = getToolDetailBySlug("investment-fee");
    if (!currencyDetail || !feeDetail) throw new Error("missing tenth-batch details");

    const { rerender } = renderWithIntl(<ToolDetailView detail={currencyDetail} />);

    expect(screen.getByRole("heading", { name: "Currency Converter details" })).toBeInTheDocument();
    expect(screen.getAllByText("VitalCalc source").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/currency-converter"
    );

    rerender(<ToolDetailView detail={feeDetail} />);

    expect(screen.getByRole("heading", { name: "Investment Fee Calculator details" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/investment-fee"
    );
  });

  it("renders eleventh-batch VitalCalc credit and relocation details with the shared local template", () => {
    const creditDetail = getToolDetailBySlug("credit-score-simulator");
    const cityDetail = getToolDetailBySlug("city-cost-comparison");
    if (!creditDetail || !cityDetail) throw new Error("missing eleventh-batch details");

    const { rerender } = renderWithIntl(<ToolDetailView detail={creditDetail} />);

    expect(screen.getByRole("heading", { name: "Credit Score Simulator details" })).toBeInTheDocument();
    expect(screen.getAllByText("VitalCalc source").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/credit-score-simulator"
    );

    rerender(<ToolDetailView detail={cityDetail} />);

    expect(screen.getByRole("heading", { name: "City Cost Comparison details" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/city-cost-comparison"
    );
  });

  it("renders twelfth-batch VitalCalc payroll and smoke-free details with the shared local template", () => {
    const socialDetail = getToolDetailBySlug("social-insurance-calculator");
    const smokeDetail = getToolDetailBySlug("smoke-free");
    if (!socialDetail || !smokeDetail) throw new Error("missing twelfth-batch details");

    const { rerender } = renderWithIntl(<ToolDetailView detail={socialDetail} />);

    expect(screen.getByRole("heading", { name: "China Social Insurance Calculator details" })).toBeInTheDocument();
    expect(screen.getAllByText("VitalCalc source").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/social-insurance-calculator"
    );

    rerender(<ToolDetailView detail={smokeDetail} />);

    expect(screen.getByRole("heading", { name: "Quit Smoking Tracker details" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/smoke-free"
    );
  });

  it("renders thirteenth-batch VitalCalc screening and eligibility details with the shared local template", () => {
    const adhdDetail = getToolDetailBySlug("adhd-screener");
    const glp1Detail = getToolDetailBySlug("glp1-eligibility");
    if (!adhdDetail || !glp1Detail) throw new Error("missing thirteenth-batch details");

    const { rerender } = renderWithIntl(<ToolDetailView detail={adhdDetail} />);

    expect(screen.getByRole("heading", { name: "ADHD Adult Screener ASRS-v1.1 details" })).toBeInTheDocument();
    expect(screen.getAllByText("VitalCalc source").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/adhd-screener"
    );

    rerender(<ToolDetailView detail={glp1Detail} />);

    expect(screen.getByRole("heading", { name: "GLP-1 Eligibility Check details" })).toBeInTheDocument();
    expect(screen.getByText(/doctor or qualified clinician/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/glp1-eligibility"
    );
  });

  it("renders final VitalCalc source details with the shared local template", () => {
    const strengthDetail = getToolDetailBySlug("one-rep-max");
    const dueDateDetail = getToolDetailBySlug("pregnancy-due-date");
    if (!strengthDetail || !dueDateDetail) throw new Error("missing final VitalCalc details");

    const { rerender } = renderWithIntl(<ToolDetailView detail={strengthDetail} />);

    expect(screen.getByRole("heading", { name: "1RM Calculator details" })).toBeInTheDocument();
    expect(screen.getAllByText("VitalCalc source").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute("href", "/tools/one-rep-max");

    rerender(<ToolDetailView detail={dueDateDetail} />);

    expect(screen.getByRole("heading", { name: "Pregnancy Due Date Calculator details" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/pregnancy-due-date"
    );
  });

  it("uses the right shell context for lab and VitalCalc detail pages", () => {
    const promptDetail = getToolDetailBySlug("prompt-injection-scanner");
    const mortgageDetail = getToolDetailBySlug("mortgage-calculator");
    if (!promptDetail || !mortgageDetail) throw new Error("missing detail");

    expect(getDetailShellActive(promptDetail)).toBe("ai-developer");
    expect(getDetailShellActive(mortgageDetail)).toBe("explore");
  });
});
