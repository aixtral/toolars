import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";

export type LocalPdfOperation = "merge" | "split" | "compress";

export interface LocalPdfSource {
  bytes: Uint8Array;
  name: string;
}

export interface LocalPdfProcessingResult {
  bytes: Uint8Array;
  fileName: string;
  mimeType: "application/pdf" | "application/zip";
  pages: number;
}

export async function getPdfPageCount(bytes: Uint8Array): Promise<number> {
  const document = await PDFDocument.load(bytes);
  return document.getPageCount();
}

export async function processPdfFiles({
  files,
  operation
}: {
  files: LocalPdfSource[];
  operation: LocalPdfOperation;
}): Promise<LocalPdfProcessingResult> {
  if (files.length === 0) {
    throw new Error("Add at least one PDF file before processing.");
  }

  if (operation === "split") {
    return splitPdfFiles(files);
  }

  const output = await PDFDocument.create();
  let pages = 0;

  for (const file of files) {
    const source = await PDFDocument.load(file.bytes);
    const copiedPages = await output.copyPages(source, source.getPageIndices());
    copiedPages.forEach((page) => output.addPage(page));
    pages += copiedPages.length;
  }

  const baseName = fileBaseName(files[0]!.name);
  const bytes = await output.save({ useObjectStreams: operation === "compress" });

  return {
    bytes,
    fileName: operation === "compress" ? `${baseName}_compressed.pdf` : `${baseName}_merged.pdf`,
    mimeType: "application/pdf",
    pages
  };
}

async function splitPdfFiles(files: LocalPdfSource[]): Promise<LocalPdfProcessingResult> {
  const zip = new JSZip();
  let outputCount = 0;

  for (const file of files) {
    const source = await PDFDocument.load(file.bytes);
    const baseName = fileBaseName(file.name);

    for (const sourcePageIndex of source.getPageIndices()) {
      const pageDocument = await PDFDocument.create();
      const [page] = await pageDocument.copyPages(source, [sourcePageIndex]);
      pageDocument.addPage(page);
      outputCount += 1;
      zip.file(`${baseName}_page-${sourcePageIndex + 1}.pdf`, await pageDocument.save());
    }
  }

  return {
    bytes: await zip.generateAsync({ type: "uint8array", compression: "DEFLATE" }),
    fileName: `${fileBaseName(files[0]!.name)}_pages.zip`,
    mimeType: "application/zip",
    pages: outputCount
  };
}

function fileBaseName(fileName: string): string {
  return fileName.replace(/\.pdf$/i, "") || "toolars-output";
}
