import { describe, expect, it } from "vitest";
import { planPdfSignature } from "./pdf-signer";

describe("planPdfSignature", () => {
  it("creates a local signature placement plan with signing-engine disclosure", () => {
    const result = planPdfSignature({
      file: { name: "Offer Letter.pdf", pages: 5, sizeBytes: 1_900_000, type: "application/pdf" },
      page: 5,
      signatureIntent: "typed",
      signerName: "Avery Stone"
    });

    expect(result.status).toBe("ready-for-signing-engine");
    expect(result.output).toMatchObject({
      fileName: "Offer_Letter_signed.pdf",
      page: 5,
      signerName: "Avery Stone",
      signatureIntent: "typed"
    });
    expect(result.trustBoundary).toMatchObject({
      mode: "local-signature-placement",
      embedsSignature: false,
      requiresPdfEngine: true
    });
  });

  it("blocks invalid signature placement before claiming a signed PDF exists", () => {
    const result = planPdfSignature({
      file: { name: "Offer Letter.pdf", pages: 5, sizeBytes: 1_900_000, type: "application/pdf" },
      page: 6,
      signatureIntent: "drawn",
      signerName: ""
    });

    expect(result.status).toBe("blocked");
    expect(result.validationIssues).toEqual(["Add the signer name before planning a signature.", "Signature page must be between 1 and 5."]);
  });
});
