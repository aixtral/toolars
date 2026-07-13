import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";
import { describe, expect, it } from "vitest";
import { getPdfPageCount, processPdfFiles } from "./pdf-local-processor";

async function createPdf(pageCount: number): Promise<Uint8Array> {
  const document = await PDFDocument.create();
  for (let page = 0; page < pageCount; page += 1) {
    document.addPage([320, 240]);
  }
  return document.save();
}

describe("local PDF processor", () => {
  it("reads the actual page count from valid PDF bytes", async () => {
    await expect(getPdfPageCount(await createPdf(3))).resolves.toBe(3);
    await expect(getPdfPageCount(new Uint8Array([1, 2, 3]))).rejects.toThrow();
  });

  it("merges uploaded PDF bytes into a real downloadable PDF", async () => {
    const result = await processPdfFiles({
      files: [
        { bytes: await createPdf(1), name: "first.pdf" },
        { bytes: await createPdf(2), name: "second.pdf" }
      ],
      operation: "merge"
    });

    expect(result.fileName).toBe("first_merged.pdf");
    expect(result.mimeType).toBe("application/pdf");
    expect((await PDFDocument.load(result.bytes)).getPageCount()).toBe(3);
  });

  it("splits PDF pages into a downloadable ZIP of real PDF files", async () => {
    const result = await processPdfFiles({
      files: [{ bytes: await createPdf(2), name: "report.pdf" }],
      operation: "split"
    });

    expect(result.fileName).toBe("report_pages.zip");
    expect(result.mimeType).toBe("application/zip");

    const zip = await JSZip.loadAsync(result.bytes);
    const entries = Object.values(zip.files).filter((entry) => !entry.dir);

    expect(entries.map((entry) => entry.name)).toEqual(["report_page-1.pdf", "report_page-2.pdf"]);
    await expect(PDFDocument.load(await entries[0]!.async("uint8array"))).resolves.toBeInstanceOf(PDFDocument);
  });

  it("rewrites a PDF locally for compression without inventing an output", async () => {
    const result = await processPdfFiles({
      files: [{ bytes: await createPdf(1), name: "report.pdf" }],
      operation: "compress"
    });

    expect(result.fileName).toBe("report_compressed.pdf");
    expect(result.bytes.byteLength).toBeGreaterThan(0);
    expect((await PDFDocument.load(result.bytes)).getPageCount()).toBe(1);
  });

  it("rejects an empty queue before a fake result can be created", async () => {
    await expect(processPdfFiles({ files: [], operation: "merge" })).rejects.toThrow("Add at least one PDF file");
  });
});
