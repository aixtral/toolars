import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { StockAverageWorkspace } from "./stock-average-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "ES VitalCalc cost basis workspace",
  title: "ES Stock Average Calculator",
  subtitle: "ES Calculate average cost per share, total cost basis, and breakeven after multiple purchases.",
  modelTitle: "ES Local calculation model",
  detailsLink: "ES Tool details",
  trustRows: {
    local: { label: "ES Local", text: "ES Purchase lots stay in this browser session" },
    noAdvice: { label: "ES No advice", text: "ES Cost-basis math is not a buy or sell recommendation" },
    private: { label: "ES Private", text: "ES Save only stores the stock plan locally when you choose it" }
  },
  inputSection: {
    title: "ES Purchase lots",
    description: "ES Enter shares and price per share for each purchase lot."
  },
  badges: {
    local: "ES Local",
    portfolio: "ES Portfolio",
    costBasis: "ES Cost basis"
  },
  fields: {
    lotShares: "ES Lot {lot} shares",
    lotPricePerShare: "ES Lot {lot} price per share"
  },
  actions: {
    addPurchase: "ES Add purchase",
    save: "ES Save stock plan",
    calculate: "ES Calculate average"
  },
  resultSection: {
    title: "ES Cost basis summary",
    emptyDescription: "ES Run calculation to see average cost and breakeven price.",
    summary: "ES {shares} shares at {averagePrice} average",
    waitingTitle: "ES Waiting for calculation",
    waitingDescription: "ES Calculate first to review the purchase lots.",
    costBasisDetail: "ES Cost basis excludes fees, taxes, and corporate actions unless included in lot prices."
  },
  metrics: {
    averageCost: "ES Average cost",
    totalShares: "ES Total shares",
    totalCost: "ES Total cost",
    breakeven: "ES Breakeven"
  },
  review: {
    eyebrow: "ES Review checklist",
    title: "ES Cost-basis notes",
    notes: {
      average: "ES VitalCalc average cost equals total cost divided by total shares.",
      exclusions: "ES Fees, taxes, currency conversion, corporate actions, and unfilled orders can change real cost basis.",
      records: "ES Use brokerage statements for tax reporting and official records."
    }
  },
  recommendation: {
    title: "ES No advice",
    body: "ES This workspace is arithmetic only and does not recommend buying, selling, or holding any security."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "stock-average": {
      ...en.tools["stock-average"],
      workspace: localizedWorkspaceCopy
    }
  }
};

const stockAverageSourceFile = "src/app/[locale]/tools/stock-average/stock-average-workspace.tsx";

function scanStockAverageWorkspaceSource() {
  return scanSourceText(readFileSync(stockAverageSourceFile, "utf8"), stockAverageSourceFile);
}

describe("StockAverageWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanStockAverageWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc stock average workspace sections", () => {
    renderWithIntl(<StockAverageWorkspace />);

    expect(screen.getByRole("heading", { name: "Stock Average Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Purchase lots")).toBeInTheDocument();
    expect(screen.getByText("Cost basis summary")).toBeInTheDocument();
    expect(screen.getByText("Cost-basis notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Lot 1 shares")).toHaveValue(100);
    expect(screen.getByLabelText("Lot 1 price per share")).toHaveValue(150);
    expect(screen.getByLabelText("Lot 2 shares")).toHaveValue(50);
    expect(screen.getByLabelText("Lot 2 price per share")).toHaveValue(120);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute(
      "href",
      "/tools/stock-average/about"
    );
  });

  it("calculates the default stock average and saves assumptions locally", () => {
    renderWithIntl(<StockAverageWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate average" }));

    expect(screen.getAllByText("$140.00").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("150")).toBeInTheDocument();
    expect(screen.getByText("$21,000.00")).toBeInTheDocument();
    expect(screen.getAllByText("150 shares at $140.00 average").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Save stock plan" }));

    expect(window.localStorage.getItem("toolars.stock-average.plan")).toContain("150");
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    render(
      <NextIntlClientProvider locale="es" messages={localizedMessages}>
        <StockAverageWorkspace />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("heading", { name: "ES Stock Average Calculator" })).toBeInTheDocument();
    expect(screen.getByText("ES Purchase lots")).toBeInTheDocument();
    expect(screen.getByLabelText("ES Lot 1 shares")).toHaveValue(100);
    expect(screen.getByText("ES Run calculation to see average cost and breakeven price.")).toBeInTheDocument();
    expect(screen.getByText("ES Average cost")).toBeInTheDocument();
    expect(screen.getByText("ES Cost-basis notes")).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.recommendation.body)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ES Calculate average" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ES Tool details" })).toHaveAttribute(
      "href",
      "/es/tools/stock-average/about"
    );

    fireEvent.click(screen.getByRole("button", { name: "ES Calculate average" }));

    expect(screen.getAllByText("ES 150 shares at $140.00 average").length).toBeGreaterThan(0);
    expect(screen.getByText("ES Cost basis excludes fees, taxes, and corporate actions unless included in lot prices.")).toBeInTheDocument();
  });
});
