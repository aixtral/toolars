import { describe, expect, it } from "vitest";
import { getLegalDocument, PRIVACY_POLICY_LAST_UPDATED, TERMS_OF_SERVICE_LAST_UPDATED, type LegalDocument } from "./legal";

describe("legal documents", () => {
  it("exposes a privacy policy with required GDPR sections", async () => {
    const doc = await getLegalDocument("privacy-policy");
    expect(doc).toBeDefined();
    expect(doc?.title).toMatch(/privacy/i);
    expect(doc?.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}/);
    const headings = doc?.sections.map((section) => section.heading) ?? [];
    expect(headings.some((heading) => /data we collect|information we collect/i.test(heading))).toBe(true);
    expect(headings.some((heading) => /cookies/i.test(heading))).toBe(true);
    expect(headings.some((heading) => /rights/i.test(heading))).toBe(true);
    expect(headings.some((heading) => /contact/i.test(heading))).toBe(true);
  });

  it("exposes terms of service with required sections", async () => {
    const doc = await getLegalDocument("terms-of-service");
    expect(doc).toBeDefined();
    expect(doc?.title).toMatch(/terms/i);
    const headings = doc?.sections.map((section) => section.heading) ?? [];
    expect(headings.some((heading) => /acceptable use|use of/i.test(heading))).toBe(true);
    expect(headings.some((heading) => /disclaimer|no warranty/i.test(heading))).toBe(true);
    expect(headings.some((heading) => /limitation of liability/i.test(heading))).toBe(true);
  });

  it("returns undefined for an unknown document slug", async () => {
    expect(await getLegalDocument("unknown")).toBeUndefined();
  });

  it("every section has a heading and non-empty paragraphs", async () => {
    const docs: LegalDocument[] = [
      (await getLegalDocument("privacy-policy"))!,
      (await getLegalDocument("terms-of-service"))!
    ];
    for (const doc of docs) {
      expect(doc.sections.length).toBeGreaterThan(0);
      for (const section of doc.sections) {
        expect(section.heading.length).toBeGreaterThan(0);
        expect(section.paragraphs.length).toBeGreaterThan(0);
      }
    }
  });

  it("privacy policy last updated is a valid date constant", () => {
    expect(PRIVACY_POLICY_LAST_UPDATED).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("terms of service last updated is a valid date constant", () => {
    expect(TERMS_OF_SERVICE_LAST_UPDATED).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
