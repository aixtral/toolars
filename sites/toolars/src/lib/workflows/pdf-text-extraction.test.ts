import { readFileSync } from "node:fs";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { describe, expect, it } from "vitest";
import { extractPdfText } from "./pdf-text-extraction";

async function createTextPdf(pages: string[]): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  for (const text of pages) {
    const page = doc.addPage([420, 320]);
    page.drawText(text, { color: rgb(0, 0, 0), font, size: 14, x: 24, y: 260 });
  }
  return new Uint8Array(await doc.save());
}

async function createMultiLinePdf(lines: string[]): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const page = doc.addPage([420, 640]);
  lines.forEach((line, index) => {
    page.drawText(line, { color: rgb(0, 0, 0), font, size: 12, x: 24, y: 600 - index * 24 });
  });
  return new Uint8Array(await doc.save());
}

describe("extractPdfText", () => {
  it("extracts real text with page markers from a generated PDF", async () => {
    const bytes = await createTextPdf(["Revenue grew 12 percent year over year.", "Action items for the board meeting."]);

    const result = await extractPdfText(bytes);

    expect(result.pageCount).toBe(2);
    expect(result.truncated).toBe(false);
    expect(result.text).toContain("[Page 1]");
    expect(result.text).toContain("Revenue grew 12 percent year over year.");
    expect(result.text).toContain("[Page 2]");
    expect(result.text).toContain("Action items for the board meeting.");
    expect(result.charCount).toBe(result.text.length);
  });

  it("caps the output at maxChars and reports truncation", async () => {
    const bytes = await createMultiLinePdf(Array.from({ length: 12 }, (_, i) => `Line ${i + 1} of the quarterly revenue summary details.`));

    const result = await extractPdfText(bytes, { maxChars: 120 });

    expect(result.truncated).toBe(true);
    expect(result.text.length).toBeLessThanOrEqual(120);
  });

  it("limits the number of pages read and marks the document as truncated", async () => {
    const bytes = await createTextPdf(["one", "two", "three"]);

    const result = await extractPdfText(bytes, { maxPages: 1 });

    expect(result.pageCount).toBe(3);
    expect(result.truncated).toBe(true);
    expect(result.text).toContain("one");
    expect(result.text).not.toContain("three");
  });

  it("serves the pdf.js worker from a checked-in public asset", () => {
    const workerPath = path.resolve(import.meta.dirname, "../../../public/pdf-worker.min.mjs");
    expect(readFileSync(workerPath).byteLength).toBeGreaterThan(100_000);
  });
});
