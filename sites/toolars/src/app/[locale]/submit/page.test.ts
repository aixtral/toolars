import { describe, expect, it } from "vitest";
import { getDisabledSubmitRedirectPath } from "./page";

describe("SubmitPage disabled redirect", () => {
  it("keeps disabled submit redirects inside the active routed locale", () => {
    expect(getDisabledSubmitRedirectPath("en")).toBe("/");
    expect(getDisabledSubmitRedirectPath("zh-hans")).toBe("/zh-hans");
    expect(getDisabledSubmitRedirectPath("zh-hant")).toBe("/zh-hant");
    expect(getDisabledSubmitRedirectPath("es")).toBe("/es");
  });

  it("falls back to the default home route for invalid locales", () => {
    expect(getDisabledSubmitRedirectPath("fr")).toBe("/");
    expect(getDisabledSubmitRedirectPath("")).toBe("/");
  });
});
