import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf.mjs";

export interface PdfTextExtractionResult {
  charCount: number;
  pageCount: number;
  text: string;
  truncated: boolean;
}

const DEFAULT_MAX_CHARS = 6000;
const DEFAULT_MAX_PAGES = 40;

let workerConfigured = false;

/**
 * Extracts real text from a PDF on device (no upload). Text is capped at
 * maxChars so provider prompts stay inside a predictable cost/context budget;
 * `truncated` tells the caller the cap cut content off.
 */
export async function extractPdfText(
  data: Uint8Array,
  { maxChars = DEFAULT_MAX_CHARS, maxPages = DEFAULT_MAX_PAGES }: { maxChars?: number; maxPages?: number } = {}
): Promise<PdfTextExtractionResult> {
  configureWorkerOnce();

  const loadingTask = getDocument({ data, useSystemFonts: true });
  const pdf = await loadingTask.promise;
  try {
    const pagesToRead = Math.min(pdf.numPages, maxPages);
    const chunks: string[] = [];
    let truncated = pdf.numPages > pagesToRead;

    for (let pageNumber = 1; pageNumber <= pagesToRead; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      if (pageText) chunks.push(`[Page ${pageNumber}] ${pageText}`);
      if (chunks.join("\n\n").length >= maxChars) {
        truncated = true;
        break;
      }
    }

    const text = chunks.join("\n\n").slice(0, maxChars);
    return {
      charCount: text.length,
      pageCount: pdf.numPages,
      text,
      truncated
    };
  } finally {
    await loadingTask.destroy();
  }
}

function configureWorkerOnce() {
  if (workerConfigured) return;
  workerConfigured = true;

  // Node (tests, SSR) extracts on the main thread; only the real browser
  // needs the worker file, served as a checked-in public asset so no
  // bundler-specific URL magic is involved.
  const isNode = typeof process !== "undefined" && Boolean(process.versions?.node);
  if (!isNode && typeof window !== "undefined") {
    GlobalWorkerOptions.workerSrc = "/pdf-worker.min.mjs";
  }
}
