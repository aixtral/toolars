import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../../scripts/audit-i18n.mjs";
import en from "../../../../messages/en.json";
import zhHans from "../../../../messages/zh-hans.json";
import { SubmitToolView } from "./submit-tool-view";

function renderSubmitToolView(locale = "en", messages = en) {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SubmitToolView />
    </NextIntlClientProvider>
  );
}

const submitToolSourceFile = "src/app/[locale]/submit/submit-tool-view.tsx";

function scanSubmitToolSource() {
  return scanSourceText(readFileSync(submitToolSourceFile, "utf8"), submitToolSourceFile);
}

describe("SubmitToolView", () => {
  it("does not contribute submit tool hardcoded UI candidates to the i18n audit", () => {
    const sourceScan = scanSubmitToolSource();

    expect(sourceScan.hardcodedText).toEqual([]);
    expect(sourceScan.absoluteHrefs).toEqual([]);
  });

  it("renders the submit tool form modules from the design", () => {
    const { container } = renderSubmitToolView();

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
    renderSubmitToolView();

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

  it("localizes the submission form surface in simplified Chinese", () => {
    renderSubmitToolView("zh-hans", zhHans);

    expect(screen.getByRole("heading", { name: "提交工具到 Toolars" })).toBeInTheDocument();
    expect(screen.getByLabelText("提交步骤")).toBeInTheDocument();
    expect(screen.getByLabelText("工具名称")).toHaveValue("Image Enhancer AI");
    expect(screen.getByLabelText("工具类型")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "提交审核" })).toBeInTheDocument();
    expect(screen.queryByText("Submit a tool to Toolars")).not.toBeInTheDocument();
  });
});
