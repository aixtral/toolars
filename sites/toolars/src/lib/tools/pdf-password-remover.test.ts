import { describe, expect, it } from "vitest";
import { planPdfPasswordRemoval } from "./pdf-password-remover";

describe("planPdfPasswordRemoval", () => {
  it("validates owned PDF unlock intent before handing off to a PDF engine", () => {
    const result = planPdfPasswordRemoval({
      file: { name: "Client Contract.pdf", pages: 12, sizeBytes: 2_800_000, type: "application/pdf" },
      hasRightsToUnlock: true,
      passwordProvided: true
    });

    expect(result.status).toBe("ready-for-engine");
    expect(result.output).toMatchObject({
      fileName: "Client_Contract_unlocked.pdf",
      pages: 12
    });
    expect(result.trustBoundary).toMatchObject({
      mode: "local-ownership-validation",
      requiresPdfEngine: true,
      cracksPasswords: false
    });
  });

  it("blocks password removal when ownership or password evidence is missing", () => {
    const result = planPdfPasswordRemoval({
      file: { name: "Locked.pdf", pages: 2, sizeBytes: 600_000, type: "application/pdf" },
      hasRightsToUnlock: false,
      passwordProvided: false
    });

    expect(result.status).toBe("blocked");
    expect(result.validationIssues).toEqual([
      "Confirm you own the PDF or have permission to remove its password.",
      "Enter the existing password before planning unlock."
    ]);
  });
});
