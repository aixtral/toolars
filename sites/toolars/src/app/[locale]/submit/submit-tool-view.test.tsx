import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SubmitToolView } from "./submit-tool-view";

describe("SubmitToolView", () => {
  it("renders the submit tool form modules from the design", () => {
    const { container } = render(<SubmitToolView />);

    expect(container.querySelector('[data-submit-tool-page="true"]')).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Submit a tool to Toolars" })).toBeInTheDocument();
    expect(screen.getAllByText("Tool basics").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Classification").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Pricing & processing").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Review preview").length).toBeGreaterThan(0);
    expect(screen.getByText("Preview")).toBeInTheDocument();
    expect(screen.getByText("Review checklist")).toBeInTheDocument();
    expect(screen.getByText("Submission guidelines")).toBeInTheDocument();
    expect(screen.getByText("What happens next?")).toBeInTheDocument();
  });

  it("exposes the required submission controls and pending review handoff", () => {
    render(<SubmitToolView />);

    expect(screen.getByLabelText("Tool name")).toHaveValue("Image Enhancer AI");
    expect(screen.getByLabelText("Website URL")).toHaveValue("https://imageenhancer.ai");
    expect(screen.getByLabelText("Short description")).toHaveValue("Enhance image quality, remove noise, and upscale images using AI.");
    expect(screen.getByLabelText("Long description")).toHaveValue(
      "Image Enhancer AI helps you improve image quality in seconds. Remove noise, fix blur, enhance colors, and upscale images up to 4x using advanced AI models. Perfect for product photos, portraits, and artwork."
    );
    expect(screen.getByLabelText("Contact email")).toHaveValue("hello@imageenhancer.ai");
    expect(screen.getByRole("button", { name: "Traditional" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "AI-powered" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Workflow" })).toBeInTheDocument();
    expect(screen.getByLabelText("Local / On device")).toBeInTheDocument();
    expect(screen.getByLabelText("Cloud")).toBeChecked();
    expect(screen.getByLabelText("AI consent required")).toBeChecked();
    expect(screen.getByRole("button", { name: "Submit for review" })).toBeInTheDocument();
    expect(screen.getAllByText("pending_review").length).toBeGreaterThan(0);
  });
});
