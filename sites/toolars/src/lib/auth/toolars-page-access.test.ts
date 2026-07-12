import { describe, expect, it } from "vitest";
import { isToolarsAdminUserId } from "./toolars-page-access";

describe("isToolarsAdminUserId", () => {
  it("requires an explicit server-side allowlist", () => {
    expect(isToolarsAdminUserId("admin-a")).toBe(false);
    expect(isToolarsAdminUserId("admin-a", "admin-b, admin-a")).toBe(true);
    expect(isToolarsAdminUserId("admin-c", "admin-b, admin-a")).toBe(false);
  });
});
