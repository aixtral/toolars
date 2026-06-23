import { screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { describe, expect, it } from "vitest";
import { AdminReviewView } from "./admin-review-view";

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
});
