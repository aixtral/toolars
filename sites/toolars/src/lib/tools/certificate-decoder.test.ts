import { afterEach, describe, expect, it, vi } from "vitest";
import { decodeCertificatePem, SAMPLE_CERTIFICATE_PEM } from "./certificate-decoder";

describe("decodeCertificatePem", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("decodes subject, issuer, validity, serial, public key, and fingerprints from PEM", async () => {
    const result = await decodeCertificatePem(SAMPLE_CERTIFICATE_PEM);

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.subject.CN).toBe("testca");
    expect(result.issuer.CN).toBe("testca");
    expect(result.validity.notBefore).toBe("2024-01-01T00:00:00.000Z");
    expect(result.validity.notAfter).toBe("2025-01-01T00:00:00.000Z");
    expect(result.validity.status).toBe("expired");
    expect(result.serialNumber).toMatch(/^[0-9A-F]+$/);
    expect(result.publicKey.type).toBe("RSA");
    expect(result.publicKey.keySize).toBeGreaterThan(0);
    expect(result.fingerprints.sha256).toMatch(/^[0-9A-F:]+$/);
    expect(result.privacyNote).toBe("Local certificate decoding only; PEM input stays in the browser.");
  });

  it("returns a parse error for invalid or empty PEM input", async () => {
    await expect(decodeCertificatePem("not a valid certificate")).resolves.toMatchObject({
      success: false,
      error: "Expected a PEM certificate block."
    });
    await expect(decodeCertificatePem("  \n\t")).resolves.toMatchObject({
      success: false,
      error: "Certificate input is empty."
    });
  });

  it("falls back to a local digest when Web Crypto rejects a digest request", async () => {
    vi.stubGlobal("crypto", {
      subtle: {
        digest: vi.fn().mockRejectedValue(new Error("digest unavailable"))
      }
    });

    await expect(decodeCertificatePem(SAMPLE_CERTIFICATE_PEM)).resolves.toMatchObject({
      success: true,
      fingerprints: { sha256: expect.stringMatching(/^[0-9A-F:]+$/) }
    });
  });
});
