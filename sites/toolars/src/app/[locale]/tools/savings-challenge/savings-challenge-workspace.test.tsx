import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import en from "../../../../../messages/en.json";
import { SavingsChallengeWorkspace } from "./savings-challenge-workspace";

const localizedWorkspaceCopy = {
  eyebrow: "Sentinel savings workspace eyebrow",
  title: "Sentinel Savings Challenge Workspace",
  subtitle: "Sentinel savings challenge subtitle.",
  modelTitle: "Sentinel savings model",
  detailsLink: "Sentinel savings details",
  badges: {
    local: "Sentinel local",
    challenge: "Sentinel challenge"
  },
  trustRows: {
    local: {
      label: "Sentinel trust local",
      text: "Sentinel savings inputs stay local."
    },
    flexible: {
      label: "Sentinel trust flexible",
      text: "Sentinel savings patterns can switch."
    },
    private: {
      label: "Sentinel trust private",
      text: "Sentinel saved challenge copy."
    }
  },
  inputSection: {
    title: "Sentinel challenge inputs",
    description: "Sentinel challenge input helper copy."
  },
  fields: {
    mode: "Sentinel challenge mode",
    currency: "Sentinel currency symbol",
    startingAmount: "Sentinel starting amount",
    weeklyIncrease: "Sentinel weekly increase",
    envelopeCount: "Sentinel envelope count",
    savingsGoal: "Sentinel savings goal",
    alreadySaved: "Sentinel already saved",
    targetMonths: "Sentinel target months"
  },
  options: {
    mode: {
      week52: "Sentinel 52-week",
      envelope: "Sentinel envelope",
      nospend: "Sentinel no-spend",
      reverse: "Sentinel reverse goal"
    }
  },
  actions: {
    save: "Sentinel save challenge",
    calculate: "Sentinel generate challenge"
  },
  resultSection: {
    title: "Sentinel challenge summary",
    emptyDescription: "Sentinel savings empty state."
  },
  metrics: {
    totalSaved: "Sentinel total saved",
    averageAmount: "Sentinel average amount",
    duration: "Sentinel duration",
    scheduleRows: "Sentinel schedule rows",
    emptyCurrency: "Sentinel empty currency",
    emptyDuration: "Sentinel run first",
    emptyCount: "Sentinel empty count"
  },
  callout: {
    generatedTitle: "Sentinel {frequency} challenge",
    generatedDescription: "Sentinel generated schedule copy.",
    waitingTitle: "Sentinel waiting for savings calculation",
    waitingDescription: "Sentinel calculate first cadence copy."
  },
  review: {
    eyebrow: "Sentinel review checklist",
    title: "Sentinel challenge notes",
    notes: {
      week52: "Sentinel note 52-week.",
      envelope: "Sentinel note envelope.",
      reverse: "Sentinel note reverse."
    }
  },
  caveat: {
    title: "Sentinel local-first",
    body: "Sentinel local savings caveat."
  }
};

const localizedMessages = {
  ...en,
  tools: {
    ...en.tools,
    "savings-challenge": {
      ...en.tools["savings-challenge"],
      workspace: localizedWorkspaceCopy
    }
  }
};

function renderWithLocalizedMessages() {
  return render(
    <NextIntlClientProvider locale="es" messages={localizedMessages}>
      <SavingsChallengeWorkspace />
    </NextIntlClientProvider>
  );
}

describe("SavingsChallengeWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders visible workspace copy from localized messages", () => {
    renderWithLocalizedMessages();

    expect(screen.getByRole("heading", { name: localizedWorkspaceCopy.title })).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.inputSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.resultSection.title)).toBeInTheDocument();
    expect(screen.getByText(localizedWorkspaceCopy.review.title)).toBeInTheDocument();
    expect(screen.getByLabelText(localizedWorkspaceCopy.fields.mode)).toHaveValue("52week");
    expect(screen.getByRole("button", { name: localizedWorkspaceCopy.actions.calculate })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: localizedWorkspaceCopy.detailsLink })).toHaveAttribute("href", "/es/tools/savings-challenge/about");
    expect(screen.getByText(localizedWorkspaceCopy.caveat.body)).toBeInTheDocument();
  });

  it("renders the local VitalCalc savings challenge workspace sections", () => {
    renderWithIntl(<SavingsChallengeWorkspace />);

    expect(screen.getByRole("heading", { name: "Savings Challenge Calculator" })).toBeInTheDocument();
    expect(screen.getByText("Challenge inputs")).toBeInTheDocument();
    expect(screen.getByText("Challenge summary")).toBeInTheDocument();
    expect(screen.getByText("Challenge notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Challenge mode")).toHaveValue("52week");
    expect(screen.getByRole("link", { name: "Tool details" })).toHaveAttribute("href", "/tools/savings-challenge/about");
  });

  it("calculates the default 52-week challenge and saves assumptions locally", () => {
    renderWithIntl(<SavingsChallengeWorkspace />);

    fireEvent.click(screen.getByRole("button", { name: "Generate savings challenge" }));

    expect(screen.getByText("¥1,378")).toBeInTheDocument();
    expect(screen.getByText("¥27")).toBeInTheDocument();
    expect(screen.getByText("52 weeks")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save challenge" }));

    expect(window.localStorage.getItem("toolars.savings-challenge.plan")).toContain("52week");
  });
});
