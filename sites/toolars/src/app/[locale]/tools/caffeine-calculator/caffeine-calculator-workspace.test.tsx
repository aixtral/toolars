import { execFileSync } from "node:child_process";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { CaffeineCalculatorWorkspace } from "./caffeine-calculator-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "ES VitalCalc caffeine workspace",
  title: "ES Caffeine Safe Limit Calculator",
  subtitle: "ES Calculate a daily caffeine allowance from weight, pregnancy status, and selected drink sources.",
  modelTitle: "ES Local calculation model",
  detailsLink: "ES Tool details",
  trustRows: {
    local: { label: "ES Local", text: "ES Weight and drink choices stay in this browser session" },
    timing: { label: "ES Timing", text: "ES Sleep impact varies by metabolism and timing" },
    private: { label: "ES Private", text: "ES Save stores only this caffeine sample locally" }
  },
  inputSection: {
    title: "ES Caffeine inputs",
    description: "ES Use source allowance caps and common drink caffeine references."
  },
  drinksSection: {
    title: "ES Today's drinks",
    description: "ES Select any sources already consumed today."
  },
  badges: {
    local: "ES Local",
    reference: "ES Reference"
  },
  fields: {
    weight: "ES Weight (kg)",
    pregnant: "ES Pregnant"
  },
  pregnancyOptions: {
    no: "ES No",
    yes: "ES Yes"
  },
  drinkLabels: {
    blackCoffee: "ES Brewed coffee",
    latte: "ES Latte",
    energyDrink: "ES Energy drink",
    blackTea: "ES Black tea",
    greenTea: "ES Green tea",
    cola: "ES Cola"
  },
  actions: {
    save: "ES Save caffeine plan",
    calculate: "ES Calculate safe limit"
  },
  resultSection: {
    title: "ES Allowance summary",
    emptyDescription: "ES Run calculation to show safe limit and remaining allowance.",
    waitingTitle: "ES Waiting for calculation",
    waitingDescription: "ES Calculate first to review intake and remaining allowance.",
    halfLifeDescription: "ES Caffeine half-life is commonly around five hours.",
    pending: "ES Pending"
  },
  metrics: {
    dailyLimit: "ES Daily safe limit",
    consumed: "ES Consumed",
    remaining: "ES Remaining",
    limitMode: "ES Limit mode"
  },
  review: {
    eyebrow: "ES Review checklist",
    title: "ES Caffeine notes",
    notes: {
      adultCap: "ES VitalCalc uses 5.7 mg per kg with a 400 mg daily adult cap.",
      pregnancy: "ES Pregnancy mode applies the source 50% weight adjustment and 200 mg cap.",
      tolerance: "ES Medication, sleep timing, anxiety, pregnancy, and individual tolerance can change safe intake."
    }
  },
  recommendation: {
    title: "ES Local-first",
    body: "ES Caffeine intake assumptions stay in this browser and are not sent to a provider."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "caffeine-calculator": {
      ...en.tools["caffeine-calculator"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function scanCaffeineCalculatorWorkspaceSource() {
  const script = `
    import fs from "node:fs/promises";
    import { scanSourceText } from "./scripts/audit-i18n.mjs";

    const file = "src/app/[locale]/tools/caffeine-calculator/caffeine-calculator-workspace.tsx";
    const source = await fs.readFile(file, "utf8");
    console.log(JSON.stringify(scanSourceText(source, file)));
  `;

  return JSON.parse(execFileSync(process.execPath, ["--input-type=module", "-e", script], { encoding: "utf8" })) as {
    absoluteHrefs: Array<{ file: string; href: string }>;
    hardcodedText: Array<{ file: string; kind: string; text: string }>;
  };
}

describe("CaffeineCalculatorWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("keeps the workspace source clear of i18n audit candidates", () => {
    const scan = scanCaffeineCalculatorWorkspaceSource();

    expect(scan.hardcodedText).toEqual([]);
    expect(scan.absoluteHrefs).toEqual([]);
  });

  it("renders the local VitalCalc caffeine workspace sections", () => {
    renderWithIntl(<CaffeineCalculatorWorkspace />);

    expect(screen.getByRole("heading", { name: "Caffeine Safe Limit Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Caffeine inputs")).toBeInTheDocument();
    expect(screen.getByText("Allowance summary")).toBeInTheDocument();
    expect(screen.getByText("Caffeine notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Weight (kg)")).toHaveValue(70);
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/caffeine-calculator/about");
  });

  it("renders visible workspace copy from localized non-English messages", () => {
    render(
      <NextIntlClientProvider locale="es" messages={localizedMessages}>
        <CaffeineCalculatorWorkspace />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("heading", { name: "ES Caffeine Safe Limit Calculator" })).toBeInTheDocument();
    expect(screen.getByText("ES Caffeine inputs")).toBeInTheDocument();
    expect(screen.getByLabelText("ES Weight (kg)")).toHaveValue(70);
    expect(screen.getByRole("button", { name: "ES Calculate safe limit" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ES Tool details" })).toHaveAttribute(
      "href",
      "/es/tools/caffeine-calculator/about"
    );
  });

  it("calculates caffeine allowance and saves selected drinks locally", () => {
    renderWithIntl(<CaffeineCalculatorWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Calculate safe limit" }));

    expect(screen.getByText("399 mg")).toBeInTheDocument();
    expect(screen.getByText("175 mg")).toBeInTheDocument();
    expect(screen.getByText("224 mg")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save caffeine plan" }));

    expect(window.localStorage.getItem("toolars.caffeine-calculator.plan:v1")).toContain("blackCoffee");
  });
});
