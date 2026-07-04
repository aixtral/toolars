import type { Metadata } from "next";
import { describe, expect, it } from "vitest";
import { generateMetadata as generateCollectionsMetadata } from "./collections/page";
import { generateMetadata as generateAiDeveloperMetadata } from "./explore/ai-developer/page";
import { generateMetadata as generatePdfMetadata } from "./explore/pdf/page";
import { generateMetadata as generateMyToolsMetadata } from "./my-tools/page";
import { generateMetadata as generatePricingMetadata } from "./pricing/page";
import { generateMetadata as generateWorkflowsMetadata } from "./workflows/page";

type MetadataGenerator = (input: { params: Promise<{ locale: string }> }) => Promise<Metadata>;

async function metadataFor(generateMetadata: MetadataGenerator, locale = "zh-hans") {
  return generateMetadata({ params: Promise.resolve({ locale }) });
}

describe("localized route metadata", () => {
  it("localizes workflows index metadata", async () => {
    const metadata = await metadataFor(generateWorkflowsMetadata);

    expect(metadata.title).toBe("完成工作的工作流");
    expect(metadata.description).toContain("将经典工具、本地处理和经同意的 AI 步骤链接成可重复的工作流");
    expect(metadata.alternates?.canonical).toBe("/zh-hans/workflows");
    expect(metadata.openGraph).toMatchObject({
      title: "完成工作的工作流",
      url: "/zh-hans/workflows"
    });
  });

  it("localizes collections index metadata", async () => {
    const metadata = await metadataFor(generateCollectionsMetadata);

    expect(metadata.title).toBe("适合各种工作的集合");
    expect(metadata.description).toBe("为常见任务和目标精选的最佳工具和工作流工具包。");
    expect(metadata.alternates?.canonical).toBe("/zh-hans/collections");
  });

  it("localizes workspace metadata while keeping it noindex", async () => {
    const metadata = await metadataFor(generateMyToolsMetadata);

    expect(metadata.title).toBe("欢迎回来，Alex");
    expect(metadata.description).toBe("继续处理最近输出，重新打开收藏，管理已保存合集，并跟踪 AI 点数。");
    expect(metadata.robots).toMatchObject({ index: false, follow: false });
  });

  it("localizes PDF and AI developer directory metadata", async () => {
    const pdfMetadata = await metadataFor(generatePdfMetadata);
    const aiDeveloperMetadata = await metadataFor(generateAiDeveloperMetadata);

    expect(pdfMetadata.title).toBe("PDF 工具和 AI 工作流");
    expect(pdfMetadata.description).toContain("所有最佳 PDF 工具集中一处");
    expect(pdfMetadata.alternates?.canonical).toBe("/zh-hans/explore/pdf");
    expect(aiDeveloperMetadata.title).toBe("AI 开发者实验室工具");
    expect(aiDeveloperMetadata.description).toContain("安全、LLM 成本、提示词工程");
    expect(aiDeveloperMetadata.alternates?.canonical).toBe("/zh-hans/explore/ai-developer");
  });

  it("localizes pricing metadata", async () => {
    const metadata = await metadataFor(generatePricingMetadata);

    expect(metadata.title).toBe("开始免费试用 Toolars。");
    expect(metadata.description).toContain("传统本地工具保持免费");
    expect(metadata.alternates?.canonical).toBe("/zh-hans/pricing");
    expect(metadata.openGraph).toMatchObject({
      title: "开始免费试用 Toolars。",
      url: "/zh-hans/pricing"
    });
  });
});
