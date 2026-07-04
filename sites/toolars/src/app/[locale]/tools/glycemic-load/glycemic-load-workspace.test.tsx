import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../../scripts/audit-i18n.mjs";
import { GlycemicLoadWorkspace } from "./glycemic-load-workspace";

const glycemicLoadSourceFile = "src/app/[locale]/tools/glycemic-load/glycemic-load-workspace.tsx";

function scanGlycemicLoadWorkspaceSource() {
  return scanSourceText(readFileSync(glycemicLoadSourceFile, "utf8"), glycemicLoadSourceFile);
}

const localizedWorkspaceCopy = {
  eyebrow: "ES VitalCalc glycemic workspace",
  title: "ES Glycemic Load Calculator",
  subtitle: "ES Estimate a food portion's glycemic load from GI, carbs, and serving size.",
  modelTitle: "ES Local calculation model",
  detailsLink: "ES Tool details",
  badges: {
    local: "ES Local",
    glBands: "ES GL bands"
  },
  trustRows: {
    local: {
      label: "ES Local",
      text: "ES Food and serving values stay in this browser session"
    },
    diet: {
      label: "ES Diet",
      text: "ES GL is food-context guidance, not medical advice"
    },
    private: {
      label: "ES Private",
      text: "ES Save stores only this food sample locally"
    }
  },
  foodOptions: {
    "white-rice": "ES White rice (1 bowl 150g)",
    "brown-rice": "ES Brown rice (1 bowl 150g)",
    oatmeal: "ES Oatmeal (1 bowl 250g)",
    "white-bread": "ES White bread (1 slice 30g)",
    "whole-bread": "ES Whole wheat bread (1 slice 30g)",
    apple: "ES Apple (1 pc 180g)",
    watermelon: "ES Watermelon (1 serving 200g)",
    potato: "ES Potato (1 pc 150g)",
    "sweet-potato": "ES Sweet potato (1 pc 150g)",
    cola: "ES Cola (330ml)",
    milk: "ES Milk (250ml)",
    "ice-cream": "ES Ice cream (1 serving 100g)",
    pasta: "ES Pasta (1 serving 180g)",
    noodles: "ES Instant noodles (1 pack 100g)",
    custom: "ES Custom"
  },
  inputSection: {
    title: "ES Food inputs",
    description: "ES Use a source food reference or enter custom GI and carbs."
  },
  fields: {
    food: "ES Food",
    serving: "ES Serving size (g)",
    glycemicIndex: "ES Glycemic Index (GI)",
    carbs: "ES Carbs per 100g"
  },
  actions: {
    save: "ES Save food sample",
    calculate: "ES Calculate glycemic load"
  },
  resultSection: {
    title: "ES Glycemic summary",
    emptyDescription: "ES Run calculation to show GL category and blood-sugar impact.",
    summary: "ES {gl} GL from {carbs} carbs"
  },
  formats: {
    grams: "{value} g"
  },
  metrics: {
    glycemicLoad: "ES Glycemic load",
    totalCarbs: "ES Total carbs",
    category: "ES GL category",
    glycemicIndex: "ES Glycemic index"
  },
  categories: {
    low: {
      label: "ES Low GL (Recommended)",
      impact: "ES Minimal blood sugar impact"
    },
    medium: {
      label: "ES Medium GL (Moderate)",
      impact: "ES Moderate blood sugar impact"
    },
    high: {
      label: "ES High GL (Limit)",
      impact: "ES High blood sugar impact"
    }
  },
  callout: {
    waitingTitle: "ES Waiting for calculation",
    waitingDescription: "ES Calculate first to review the food impact band.",
    calculatedDescription: "ES Pair GL with overall meal context and professional advice when needed."
  },
  review: {
    eyebrow: "ES Review checklist",
    title: "ES Glycemic load notes",
    notes: {
      formula: "ES VitalCalc calculates GL as glycemic index times carbs per serving divided by 100.",
      bands: "ES GL <= 10 is low, 11-19 is medium, and 20 or higher is high.",
      context: "ES Blood sugar response depends on meal composition, medication, activity, and individual metabolism."
    }
  },
  recommendation: {
    title: "ES Local-first",
    body: "ES Food inputs stay local and are meant for practical nutrition planning, not diagnosis."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "glycemic-load": {
      ...en.tools["glycemic-load"],
      workspace: localizedWorkspaceCopy
    }
  }
};

describe("GlycemicLoadWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const sourceScan = scanGlycemicLoadWorkspaceSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc glycemic load workspace sections", () => {
    renderWithIntl(<GlycemicLoadWorkspace />);

    expect(screen.getByRole("heading", { name: "Glycemic Load Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Food inputs")).toBeInTheDocument();
    expect(screen.getByText("Glycemic summary")).toBeInTheDocument();
    expect(screen.getByText("Glycemic load notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Glycemic Index (GI)")).toHaveValue(73);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/glycemic-load/about");
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    render(
      <NextIntlClientProvider locale="es" messages={localizedMessages}>
        <GlycemicLoadWorkspace />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("heading", { name: "ES Glycemic Load Calculator" })).toBeInTheDocument();
    expect(screen.getByText("ES Food inputs")).toBeInTheDocument();
    expect(screen.getByLabelText("ES Glycemic Index (GI)")).toHaveValue(73);
    expect(screen.getByRole("button", { name: "ES Calculate glycemic load" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ES Tool details" })).toHaveAttribute("href", "/es/tools/glycemic-load/about");
    expect(screen.queryByText("Food inputs")).not.toBeInTheDocument();
  });

  it("calculates the default GL result and saves the food sample locally", () => {
    renderWithIntl(<GlycemicLoadWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate glycemic load" }));

    expect(screen.getByText("30.7")).toBeInTheDocument();
    expect(screen.getByText("42.0 g")).toBeInTheDocument();
    expect(screen.getAllByText("High GL (Limit)").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Save food sample" }));

    expect(window.localStorage.getItem("toolars.glycemic-load.sample:v1")).toContain("white-rice");
  });
});
