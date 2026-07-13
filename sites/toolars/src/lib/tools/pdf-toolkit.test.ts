import { describe, expect, it } from "vitest";
import { buildPdfJob, getPdfOperationPolicies, getPdfOperationPolicy } from "./pdf-toolkit";

const queuedPdf = {
  id: "client-brief",
  name: "Client_Brief.pdf",
  pages: 2,
  sizeMb: 0.1,
  source: "local" as const
};

describe("PDF Toolkit operation policy", () => {
  it("only exposes locally implemented operations", () => {
    expect(getPdfOperationPolicies().map((policy) => policy.operation)).toEqual(["merge", "split", "compress"]);
    expect(getPdfOperationPolicy("merge")).toMatchObject({
      label: "Merge",
      consentRequired: false,
      processing: "local"
    });
  });

  it("requires a PDF before an operation can run", () => {
    const result = buildPdfJob({
      files: [],
      operation: "compress",
      consentGranted: false
    });

    expect(result.status).toBe("blocked");
    expect(result.message).toBe("Add at least one PDF file to continue.");
  });

  it("never manufactures an output before the local processor returns bytes", () => {
    const result = buildPdfJob({
      files: [queuedPdf],
      operation: "merge",
      consentGranted: false
    });

    expect(result.status).toBe("blocked");
    expect(result.output).toBeUndefined();
    expect(result.message).toBe("Choose a local operation to process the queued PDFs.");
  });
});
