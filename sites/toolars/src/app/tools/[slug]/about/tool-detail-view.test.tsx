import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getToolDetailBySlug } from "@/data/tool-details";
import { generateStaticParams, getDetailShellActive } from "./page";
import { ToolDetailView } from "./tool-detail-view";

describe("ToolDetailView", () => {
  it("renders the Prompt Injection Scanner public listing template", () => {
    const detail = getToolDetailBySlug("prompt-injection-scanner");
    if (!detail) throw new Error("missing prompt detail");

    const { container } = render(<ToolDetailView detail={detail} />);

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

  it("renders detail-specific copy for the cost calculator template", () => {
    const detail = getToolDetailBySlug("llm-cost-calculator");
    if (!detail) throw new Error("missing cost detail");

    render(<ToolDetailView detail={detail} />);

    expect(screen.getByRole("heading", { name: "LLM Cost Calculator details" })).toBeInTheDocument();
    expect(screen.getByText("Pricing and limits")).toBeInTheDocument();
    expect(screen.getByText("Model profiles")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /LLM Cost Review/ })).toHaveAttribute(
      "href",
      "/workflows/llm-cost-review"
    );
  });

  it("renders the designed PDF Toolkit and JSON Repair public listings", () => {
    const pdfDetail = getToolDetailBySlug("pdf-toolkit");
    const jsonDetail = getToolDetailBySlug("json-repair");
    if (!pdfDetail || !jsonDetail) throw new Error("missing designed detail");

    const { rerender } = render(<ToolDetailView detail={pdfDetail} />);

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
    expect(screen.getByText("Core operations")).toBeInTheDocument();
    expect(screen.getByText("Base plan")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open tool" })).toHaveAttribute("href", "/tools/pdf-toolkit");
    expect(screen.getByRole("link", { name: /Turn PDF into summary/ })).toHaveAttribute(
      "href",
      "/workflows/pdf-summary"
    );

    rerender(<ToolDetailView detail={jsonDetail} />);

    expect(screen.getByRole("heading", { name: "JSON Repair details" })).toBeInTheDocument();
    expect(Array.from(document.querySelectorAll(".detail-badge-row .badge")).map((node) => node.textContent)).toEqual([
      "Local first",
      "Free trial",
      "JSON",
      "LLM",
      "API"
    ]);
    expect(screen.getByText("Local repair model")).toBeInTheDocument();
    expect(screen.getByText("Syntax issue types")).toBeInTheDocument();
    expect(screen.getByText("Recommended next step")).toBeInTheDocument();
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

      const { container, unmount } = render(<ToolDetailView detail={detail} />);

      expect(container.querySelector(`[data-tool-detail="${slug}"]`)).toHaveAttribute(
        "data-designed-public-detail",
        "true"
      );

      unmount();
    }

    const mortgageDetail = getToolDetailBySlug("mortgage-calculator");
    if (!mortgageDetail) throw new Error("missing mortgage detail");

    const { container } = render(<ToolDetailView detail={mortgageDetail} />);

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

      const { container, unmount } = render(<ToolDetailView detail={detail} />);

      expect(container.querySelector(`[data-tool-detail="${slug}"]`)).toHaveAttribute(
        "data-ai-lab-detail",
        "true"
      );

      unmount();
    }

    const pdfDetail = getToolDetailBySlug("pdf-toolkit");
    if (!pdfDetail) throw new Error("missing PDF detail");

    const { container } = render(<ToolDetailView detail={pdfDetail} />);

    expect(container.querySelector('[data-tool-detail="pdf-toolkit"]')).not.toHaveAttribute(
      "data-ai-lab-detail"
    );
  });

  it("uses high-fidelity public-detail copy for designed mobile screens", () => {
    const pdfDetail = getToolDetailBySlug("pdf-toolkit");
    const jsonDetail = getToolDetailBySlug("json-repair");
    const mcpDetail = getToolDetailBySlug("mcp-server-builder");
    if (!pdfDetail || !jsonDetail || !mcpDetail) throw new Error("missing designed detail copy");

    const { rerender } = render(<ToolDetailView detail={pdfDetail} />);

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

    render(<ToolDetailView detail={detail} />);

    fireEvent.click(screen.getByRole("button", { name: "Share" }));

    expect(screen.getByRole("dialog", { name: "Share this tool" })).toBeInTheDocument();
    expect(screen.getByDisplayValue("/tools/pdf-toolkit/about")).toBeInTheDocument();
    expect(screen.getByText("PDF Toolkit")).toBeInTheDocument();
  });

  it("renders a VitalCalc public listing using the shared detail template", () => {
    const detail = getToolDetailBySlug("mortgage-calculator");
    if (!detail) throw new Error("missing mortgage detail");

    render(<ToolDetailView detail={detail} />);

    expect(screen.getByRole("heading", { name: "Mortgage Calculator details" })).toBeInTheDocument();
    expect(screen.getByText("Local calculation model")).toBeInTheDocument();
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

    render(<ToolDetailView detail={detail} />);

    expect(screen.getByRole("heading", { name: "TDEE Calculator details" })).toBeInTheDocument();
    expect(screen.getByText("Local calculation model")).toBeInTheDocument();
    expect(screen.getAllByText("VitalCalc source").length).toBeGreaterThan(0);
    expect(screen.getByText("Daily energy estimate")).toBeInTheDocument();
    expect(screen.getAllByText("Local").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/tdee-calculator"
    );
  });

  it("renders a related coverage VitalCalc detail with the shared local template", () => {
    const detail = getToolDetailBySlug("bmr-calculator");
    if (!detail) throw new Error("missing BMR detail");

    render(<ToolDetailView detail={detail} />);

    expect(screen.getByRole("heading", { name: "BMR Calculator details" })).toBeInTheDocument();
    expect(screen.getByText("Local calculation model")).toBeInTheDocument();
    expect(screen.getAllByText("VitalCalc source").length).toBeGreaterThan(0);
    expect(screen.getByText("Basal metabolic estimate")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/bmr-calculator"
    );
  });

  it("renders third-batch VitalCalc finance and health details with the shared local template", () => {
    const fireDetail = getToolDetailBySlug("fire-calculator");
    const sleepDetail = getToolDetailBySlug("sleep-calculator");
    if (!fireDetail || !sleepDetail) throw new Error("missing third-batch details");

    const { rerender } = render(<ToolDetailView detail={fireDetail} />);

    expect(screen.getByRole("heading", { name: "FIRE Calculator details" })).toBeInTheDocument();
    expect(screen.getByText("Local calculation model")).toBeInTheDocument();
    expect(screen.getAllByText("VitalCalc source").length).toBeGreaterThan(0);
    expect(screen.getByText("Financial independence target")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/fire-calculator"
    );

    rerender(<ToolDetailView detail={sleepDetail} />);

    expect(screen.getByRole("heading", { name: "Sleep Calculator details" })).toBeInTheDocument();
    expect(screen.getByText("Sleep schedule estimate")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/sleep-calculator"
    );
  });

  it("renders fourth-batch VitalCalc finance and health details with the shared local template", () => {
    const rentDetail = getToolDetailBySlug("rent-vs-buy");
    const pressureDetail = getToolDetailBySlug("blood-pressure");
    if (!rentDetail || !pressureDetail) throw new Error("missing fourth-batch details");

    const { rerender } = render(<ToolDetailView detail={rentDetail} />);

    expect(screen.getByRole("heading", { name: "Rent vs Buy Calculator details" })).toBeInTheDocument();
    expect(screen.getByText("Local calculation model")).toBeInTheDocument();
    expect(screen.getAllByText("VitalCalc source").length).toBeGreaterThan(0);
    expect(screen.getByText("Break-even comparison")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/rent-vs-buy"
    );

    rerender(<ToolDetailView detail={pressureDetail} />);

    expect(screen.getByRole("heading", { name: "Blood Pressure Calculator details" })).toBeInTheDocument();
    expect(screen.getByText("Blood pressure category")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/blood-pressure"
    );
  });

  it("renders fifth-batch VitalCalc finance and health details with the shared local template", () => {
    const apyDetail = getToolDetailBySlug("apy-calculator");
    const macroDetail = getToolDetailBySlug("macro-calculator");
    if (!apyDetail || !macroDetail) throw new Error("missing fifth-batch details");

    const { rerender } = render(<ToolDetailView detail={apyDetail} />);

    expect(screen.getByRole("heading", { name: "APY Calculator details" })).toBeInTheDocument();
    expect(screen.getByText("Local calculation model")).toBeInTheDocument();
    expect(screen.getAllByText("VitalCalc source").length).toBeGreaterThan(0);
    expect(screen.getByText("Annual yield estimate")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/apy-calculator"
    );

    rerender(<ToolDetailView detail={macroDetail} />);

    expect(screen.getByRole("heading", { name: "Macro Calculator details" })).toBeInTheDocument();
    expect(screen.getByText("Macro split target")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/macro-calculator"
    );
  });

  it("renders sixth-batch VitalCalc finance planning details with the shared local template", () => {
    const emergencyDetail = getToolDetailBySlug("emergency-fund");
    const sideTaxDetail = getToolDetailBySlug("side-income-tax");
    if (!emergencyDetail || !sideTaxDetail) throw new Error("missing sixth-batch details");

    const { rerender } = render(<ToolDetailView detail={emergencyDetail} />);

    expect(screen.getByRole("heading", { name: "Emergency Fund Calculator details" })).toBeInTheDocument();
    expect(screen.getByText("Local calculation model")).toBeInTheDocument();
    expect(screen.getAllByText("VitalCalc source").length).toBeGreaterThan(0);
    expect(screen.getByText("Emergency fund target")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/emergency-fund"
    );

    rerender(<ToolDetailView detail={sideTaxDetail} />);

    expect(screen.getByRole("heading", { name: "Side Income Tax Calculator details" })).toBeInTheDocument();
    expect(screen.getByText("Quarterly tax estimate")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/side-income-tax"
    );
  });

  it("renders seventh-batch VitalCalc health and wellness details with the shared local template", () => {
    const fastingDetail = getToolDetailBySlug("intermittent-fasting");
    const glycemicDetail = getToolDetailBySlug("glycemic-load");
    if (!fastingDetail || !glycemicDetail) throw new Error("missing seventh-batch details");

    const { rerender } = render(<ToolDetailView detail={fastingDetail} />);

    expect(screen.getByRole("heading", { name: "Intermittent Fasting Calculator details" })).toBeInTheDocument();
    expect(screen.getByText("Local calculation model")).toBeInTheDocument();
    expect(screen.getAllByText("VitalCalc source").length).toBeGreaterThan(0);
    expect(screen.getByText("Fasting window schedule")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/intermittent-fasting"
    );

    rerender(<ToolDetailView detail={glycemicDetail} />);

    expect(screen.getByRole("heading", { name: "Glycemic Load Calculator details" })).toBeInTheDocument();
    expect(screen.getByText("Glycemic load value")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/glycemic-load"
    );
  });

  it("renders eighth-batch VitalCalc utility and finance details with the shared local template", () => {
    const tipDetail = getToolDetailBySlug("tip-calculator");
    const unitDetail = getToolDetailBySlug("unit-converter");
    if (!tipDetail || !unitDetail) throw new Error("missing eighth-batch details");

    const { rerender } = render(<ToolDetailView detail={tipDetail} />);

    expect(screen.getByRole("heading", { name: "Tip Calculator details" })).toBeInTheDocument();
    expect(screen.getByText("Local calculation model")).toBeInTheDocument();
    expect(screen.getAllByText("VitalCalc source").length).toBeGreaterThan(0);
    expect(screen.getByText("Per-person split")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/tip-calculator"
    );

    rerender(<ToolDetailView detail={unitDetail} />);

    expect(screen.getByRole("heading", { name: "Unit Converter details" })).toBeInTheDocument();
    expect(screen.getByText("Universal conversion")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/unit-converter"
    );
  });

  it("renders ninth-batch VitalCalc lifestyle and nutrition details with the shared local template", () => {
    const caffeineDetail = getToolDetailBySlug("caffeine-calculator");
    const drinkDetail = getToolDetailBySlug("drink-calories");
    if (!caffeineDetail || !drinkDetail) throw new Error("missing ninth-batch details");

    const { rerender } = render(<ToolDetailView detail={caffeineDetail} />);

    expect(screen.getByRole("heading", { name: "Caffeine Safe Limit Calculator details" })).toBeInTheDocument();
    expect(screen.getByText("Local calculation model")).toBeInTheDocument();
    expect(screen.getAllByText("VitalCalc source").length).toBeGreaterThan(0);
    expect(screen.getByText("Daily caffeine allowance")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/caffeine-calculator"
    );

    rerender(<ToolDetailView detail={drinkDetail} />);

    expect(screen.getByRole("heading", { name: "Drink Calories Calculator details" })).toBeInTheDocument();
    expect(screen.getByText("Liquid calorie total")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/drink-calories"
    );
  });

  it("renders tenth-batch VitalCalc finance utility and investment details with the shared local template", () => {
    const currencyDetail = getToolDetailBySlug("currency-converter");
    const feeDetail = getToolDetailBySlug("investment-fee");
    if (!currencyDetail || !feeDetail) throw new Error("missing tenth-batch details");

    const { rerender } = render(<ToolDetailView detail={currencyDetail} />);

    expect(screen.getByRole("heading", { name: "Currency Converter details" })).toBeInTheDocument();
    expect(screen.getByText("Local calculation model")).toBeInTheDocument();
    expect(screen.getAllByText("VitalCalc source").length).toBeGreaterThan(0);
    expect(screen.getByText("Manual exchange-rate conversion")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/currency-converter"
    );

    rerender(<ToolDetailView detail={feeDetail} />);

    expect(screen.getByRole("heading", { name: "Investment Fee Calculator details" })).toBeInTheDocument();
    expect(screen.getByText("Investment fee drag")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/investment-fee"
    );
  });

  it("renders eleventh-batch VitalCalc credit and relocation details with the shared local template", () => {
    const creditDetail = getToolDetailBySlug("credit-score-simulator");
    const cityDetail = getToolDetailBySlug("city-cost-comparison");
    if (!creditDetail || !cityDetail) throw new Error("missing eleventh-batch details");

    const { rerender } = render(<ToolDetailView detail={creditDetail} />);

    expect(screen.getByRole("heading", { name: "Credit Score Simulator details" })).toBeInTheDocument();
    expect(screen.getByText("Local calculation model")).toBeInTheDocument();
    expect(screen.getAllByText("VitalCalc source").length).toBeGreaterThan(0);
    expect(screen.getByText("Credit score scenario impact")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/credit-score-simulator"
    );

    rerender(<ToolDetailView detail={cityDetail} />);

    expect(screen.getByRole("heading", { name: "City Cost Comparison details" })).toBeInTheDocument();
    expect(screen.getByText("Relocation surplus comparison")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/city-cost-comparison"
    );
  });

  it("renders twelfth-batch VitalCalc payroll and smoke-free details with the shared local template", () => {
    const socialDetail = getToolDetailBySlug("social-insurance-calculator");
    const smokeDetail = getToolDetailBySlug("smoke-free");
    if (!socialDetail || !smokeDetail) throw new Error("missing twelfth-batch details");

    const { rerender } = render(<ToolDetailView detail={socialDetail} />);

    expect(screen.getByRole("heading", { name: "China Social Insurance Calculator details" })).toBeInTheDocument();
    expect(screen.getByText("Local calculation model")).toBeInTheDocument();
    expect(screen.getAllByText("VitalCalc source").length).toBeGreaterThan(0);
    expect(screen.getByText("Payroll contribution breakdown")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/social-insurance-calculator"
    );

    rerender(<ToolDetailView detail={smokeDetail} />);

    expect(screen.getByRole("heading", { name: "Quit Smoking Tracker details" })).toBeInTheDocument();
    expect(screen.getByText("Smoke-free recovery tracker")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/smoke-free"
    );
  });

  it("renders thirteenth-batch VitalCalc screening and eligibility details with the shared local template", () => {
    const adhdDetail = getToolDetailBySlug("adhd-screener");
    const glp1Detail = getToolDetailBySlug("glp1-eligibility");
    if (!adhdDetail || !glp1Detail) throw new Error("missing thirteenth-batch details");

    const { rerender } = render(<ToolDetailView detail={adhdDetail} />);

    expect(screen.getByRole("heading", { name: "ADHD Adult Screener ASRS-v1.1 details" })).toBeInTheDocument();
    expect(screen.getByText("Local calculation model")).toBeInTheDocument();
    expect(screen.getAllByText("VitalCalc source").length).toBeGreaterThan(0);
    expect(screen.getByText("ASRS-v1.1 screening score")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/tools/adhd-screener"
    );

    rerender(<ToolDetailView detail={glp1Detail} />);

    expect(screen.getByRole("heading", { name: "GLP-1 Eligibility Check details" })).toBeInTheDocument();
    expect(screen.getByText("BMI eligibility screen")).toBeInTheDocument();
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

    const { rerender } = render(<ToolDetailView detail={strengthDetail} />);

    expect(screen.getByRole("heading", { name: "1RM Calculator details" })).toBeInTheDocument();
    expect(screen.getByText("Local calculation model")).toBeInTheDocument();
    expect(screen.getAllByText("VitalCalc source").length).toBeGreaterThan(0);
    expect(screen.getByText("1RM estimate")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute("href", "/tools/one-rep-max");

    rerender(<ToolDetailView detail={dueDateDetail} />);

    expect(screen.getByRole("heading", { name: "Pregnancy Due Date Calculator details" })).toBeInTheDocument();
    expect(screen.getByText("Due date estimate")).toBeInTheDocument();
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
