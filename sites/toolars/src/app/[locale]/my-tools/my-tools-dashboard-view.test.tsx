import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { describe, expect, it } from "vitest";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../scripts/audit-i18n.mjs";
import en from "../../../../messages/en.json";
import { MyToolsDashboardView } from "./my-tools-dashboard-view";

const localizedDashboardCopy = {
  hero: {
    eyebrow: "Sentinel personal workspace",
    title: "Sentinel welcome back",
    subtitle: "Sentinel dashboard subtitle."
  },
  command: {
    prompt: "Sentinel next action prompt",
    runNextWorkflowLabel: "Sentinel run next workflow",
    chips: {
      all: "Sentinel all",
      tools: "Sentinel tools",
      workflows: "Sentinel workflows",
      outputs: "Sentinel outputs"
    }
  },
  kpis: {
    recentOutputs: { label: "Sentinel recent outputs", note: "Sentinel recent output note" },
    favoriteTools: { label: "Sentinel favorite tools", note: "Sentinel favorite tools note" },
    savedWorkflows: { label: "Sentinel saved workflows", note: "Sentinel saved workflows note" },
    aiCredits: { label: "Sentinel AI credits", note: "Sentinel AI credits note" }
  },
  recentOutputs: {
    title: "Sentinel continue section",
    viewAll: "Sentinel view history",
    open: "Sentinel open",
    items: {
      q2PdfSummary: {
        title: "Sentinel Q2 PDF summary",
        tool: "Sentinel PDF tool",
        time: "Sentinel 2h",
        status: "Sentinel completed"
      },
      imageCompressionBatch: {
        title: "Sentinel image batch",
        tool: "Sentinel image tool",
        time: "Sentinel 5h",
        status: "Sentinel processing"
      },
      mortgageScenario: {
        title: "Sentinel mortgage scenario",
        tool: "Sentinel mortgage tool",
        time: "Sentinel yesterday",
        status: "Sentinel done"
      },
      csvCleanup: {
        title: "Sentinel CSV cleanup",
        tool: "Sentinel data tool",
        time: "Sentinel 2 days",
        status: "Sentinel complete"
      }
    }
  },
  savedCollections: {
    title: "Sentinel saved collections",
    viewAll: "Sentinel view collections",
    items: {
      pdfOpsKit: { title: "Sentinel PDF Ops Kit", meta: "Sentinel PDF meta" },
      aiDeveloperLab: { title: "Sentinel AI Developer Lab", meta: "Sentinel lab meta" },
      marketingSprint: { title: "Sentinel Marketing Sprint", meta: "Sentinel marketing meta" }
    }
  },
  nextWorkflows: {
    title: "Sentinel next workflows",
    viewAll: "Sentinel view workflows",
    use: "Sentinel use",
    items: {
      pdfSummary: { title: "Sentinel PDF summary workflow", meta: "Sentinel PDF workflow meta" },
      llmCostReview: { title: "Sentinel LLM review", meta: "Sentinel LLM meta" },
      mcpToolLaunch: { title: "Sentinel MCP launch", meta: "Sentinel MCP meta" }
    }
  },
  favoriteTools: {
    title: "Sentinel favorite tools section",
    manage: "Sentinel manage favorites",
    open: "Sentinel open favorite",
    items: {
      pdfToolkit: {
        title: "Sentinel PDF Toolkit",
        description: "Sentinel PDF description",
        badge: "Sentinel traditional"
      },
      jsonRepair: {
        title: "Sentinel JSON Repair",
        description: "Sentinel JSON description",
        badge: "Sentinel local"
      },
      aiEmailWriter: {
        title: "Sentinel AI Email Writer",
        description: "Sentinel email description",
        badge: "Sentinel AI"
      },
      llmCostCalculator: {
        title: "Sentinel LLM Cost Calculator",
        description: "Sentinel cost description",
        badge: "Sentinel calculator"
      }
    }
  },
  sharedLinks: {
    title: "Sentinel shared links",
    viewAll: "Sentinel view links",
    linkLabel: "Sentinel link label",
    items: {
      marketingReport: "Sentinel marketing report",
      cleanedData: "Sentinel cleaned data",
      socialPost: "Sentinel social post"
    }
  },
  storage: {
    title: "Sentinel storage",
    usage: "Sentinel storage usage"
  },
  extension: {
    title: "Sentinel install extension",
    description: "Sentinel extension description",
    action: "Sentinel install action"
  },
  teamUpsell: {
    title: "Sentinel team disabled",
    description: "Sentinel team upsell description.",
    action: "Sentinel upgrade team"
  }
};

const localizedMessages = {
  ...en,
  myToolsDashboard: localizedDashboardCopy
};

function renderWithLocalizedMessages(locale = "en") {
  return render(
    <NextIntlClientProvider locale={locale} messages={localizedMessages}>
      <MyToolsDashboardView />
    </NextIntlClientProvider>
  );
}

const myToolsSourceFile = "src/app/[locale]/my-tools/my-tools-dashboard-view.tsx";

function scanMyToolsSource() {
  return scanSourceText(readFileSync(myToolsSourceFile, "utf8"), myToolsSourceFile);
}

describe("MyToolsDashboardView", () => {
  it("does not leave hardcoded UI audit candidates in the dashboard source", () => {
    const scan = scanMyToolsSource();

    expect(scan.hardcodedText).toHaveLength(0);
    expect(scan.absoluteHrefs).toHaveLength(0);
  });

  it("renders visible dashboard copy from localized messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedDashboardCopy.hero.title })).toBeInTheDocument();
    expect(screen.getByText(localizedDashboardCopy.command.prompt)).toBeInTheDocument();
    expect(screen.getByText(localizedDashboardCopy.kpis.recentOutputs.label)).toBeInTheDocument();
    expect(screen.getByText(localizedDashboardCopy.recentOutputs.title)).toBeInTheDocument();
    expect(screen.getByText(localizedDashboardCopy.savedCollections.title)).toBeInTheDocument();
    expect(screen.getByText(localizedDashboardCopy.nextWorkflows.title)).toBeInTheDocument();
    expect(screen.getByText(localizedDashboardCopy.sharedLinks.title)).toBeInTheDocument();
    expect(screen.getByText(localizedDashboardCopy.storage.title)).toBeInTheDocument();
    expect(screen.getByText(localizedDashboardCopy.extension.title)).toBeInTheDocument();
  });

  it("renders the personal workspace dashboard modules from the design", () => {
    const { container } = renderWithIntl(<MyToolsDashboardView />);

    expect(container.querySelector('[data-my-tools-page="true"]')).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Welcome back, Alex" })).toBeInTheDocument();
    expect(screen.getByText("What do you want to do next?")).toBeInTheDocument();
    expect(screen.getByText("Recent outputs")).toBeInTheDocument();
    expect(screen.getByText("Favorite tools")).toBeInTheDocument();
    expect(screen.getByText("Saved workflows")).toBeInTheDocument();
    expect(screen.getByText("AI credits remaining")).toBeInTheDocument();
    expect(screen.getByText("Continue where you left off")).toBeInTheDocument();
    expect(screen.getByText("Saved collections")).toBeInTheDocument();
    expect(screen.getByText("Recommended next workflows")).toBeInTheDocument();
    expect(screen.getByText("Recent shared links")).toBeInTheDocument();
  });

  it("links workspace cards to existing tools, workflows, and collections", () => {
    const { container } = renderWithIntl(<MyToolsDashboardView />);

    expect(container.querySelector('a[href="/tools/pdf-toolkit"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/workflows/pdf-summary"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/collections/pdf-ops-kit"]')).toBeInTheDocument();
    expect(screen.getByText("Storage")).toBeInTheDocument();
    expect(screen.getByText("Install Toolars Extension")).toBeInTheDocument();
  });

  it("derives dashboard counts and uses semantic icons instead of text placeholders", () => {
    const { container } = renderWithIntl(<MyToolsDashboardView />);

    const expectedKpis = [
      ["recentOutputs", "4"],
      ["favoriteTools", "4"],
      ["savedWorkflows", "3"],
      ["aiCredits", "0"]
    ] as const;

    for (const [key, value] of expectedKpis) {
      const icon = container.querySelector(`[data-kpi-icon="${key}"]`);

      expect(icon?.querySelector("svg")).toBeInTheDocument();
      expect(icon).not.toHaveTextContent(value.slice(0, 2));
      expect(screen.getAllByText(value).length).toBeGreaterThan(0);
    }

    expect(screen.queryByText("1,250")).not.toBeInTheDocument();
    expect(container.querySelectorAll("[data-recent-output-icon] svg")).toHaveLength(4);
    expect(container.querySelectorAll("[data-favorite-tool-icon] svg")).toHaveLength(4);
    expect(screen.queryByText("Marketing Sprint")).not.toBeInTheDocument();
  });

  it("prefixes internal dashboard links for routed non-default locales", () => {
    const { container } = renderWithLocalizedMessages("zh-hans");

    expect(container.querySelector('a[href="/zh-hans/workflows/pdf-summary"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/zh-hans/collections"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/zh-hans/workflows"]')).toBeInTheDocument();
  });
});
