import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { describe, expect, it } from "vitest";
import zhHans from "../../../../../messages/zh-hans.json";
import { AdminReviewView } from "./admin-review-view";

function renderAdminReviewInLocale(locale: string, messages: Record<string, unknown>) {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AdminReviewView />
    </NextIntlClientProvider>
  );
}

describe("AdminReviewView", () => {
  it("renders the admin review modules from the design", () => {
    const { container } = renderWithIntl(<AdminReviewView />);

    expect(container.querySelector('[data-admin-review-page="true"]')).toBeInTheDocument();
    expect(screen.getAllByText("Review queue")[0]).toBeInTheDocument();
    expect(screen.getByText("Pending reviews")).toBeInTheDocument();
    expect(screen.getByText("Security flags")).toBeInTheDocument();
    expect(screen.getByText("AI consent reviews")).toBeInTheDocument();
    expect(screen.getByText("Published this month")).toBeInTheDocument();
    expect(screen.getByLabelText("Submission table")).toBeInTheDocument();
    expect(screen.getByText("Submission details")).toBeInTheDocument();
    expect(screen.getByText("Automated checks")).toBeInTheDocument();
    expect(screen.getByText("Review checklist")).toBeInTheDocument();
    expect(screen.getByText("Audit trail")).toBeInTheDocument();
    expect(screen.getByText("Internal comments")).toBeInTheDocument();
    expect(screen.getByText("Attachments")).toBeInTheDocument();
  });

  it("shows the selected submission risk, checks, and review actions", () => {
    renderWithIntl(<AdminReviewView />);

    expect(screen.getAllByText("AI Research Summarizer").length).toBeGreaterThan(0);
    expect(screen.getByText("Sarah Kim")).toBeInTheDocument();
    expect(screen.getAllByText("AI consent required").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Medium").length).toBeGreaterThan(0);
    expect(screen.getByText("URL reachable")).toBeInTheDocument();
    expect(screen.getByText("Privacy policy found")).toBeInTheDocument();
    expect(screen.getByText("Not detected")).toBeInTheDocument();
    expect(screen.getByText("AI disclosure present")).toBeInTheDocument();
    expect(screen.getByText("4/6 complete")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Approve" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Request changes" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reject" })).toBeInTheDocument();
  });

  it("localizes the admin review queue in simplified Chinese", () => {
    renderAdminReviewInLocale("zh-hans", zhHans);

    expect(screen.getByRole("heading", { name: "审核队列" })).toBeInTheDocument();
    expect(screen.getByText("待审核")).toBeInTheDocument();
    expect(screen.getByLabelText("提交表格")).toBeInTheDocument();
    expect(screen.getAllByText("AI 研究摘要器").length).toBeGreaterThan(0);
    expect(screen.getByText("截图-1.png")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "打开提交表单" })).toHaveAttribute("href", "/zh-hans/submit");
    expect(screen.getByRole("button", { name: "批准" })).toBeInTheDocument();
    expect(screen.queryByText("Pending reviews")).not.toBeInTheDocument();
    expect(screen.queryAllByText("AI Research Summarizer")).toHaveLength(0);
    expect(screen.queryByText("screenshot-1.png")).not.toBeInTheDocument();
  });
});
