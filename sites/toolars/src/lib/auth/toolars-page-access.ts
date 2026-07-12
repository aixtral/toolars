import { notFound, redirect } from "next/navigation";
import { requireAuthenticatedUser } from "./toolars-api-auth-context";

export async function requireToolarsPageUser(locale: string) {
  try {
    return await requireAuthenticatedUser();
  } catch {
    redirect(`/${locale}`);
  }
}

export async function requireToolarsAdminPageUser(locale: string) {
  const user = await requireToolarsPageUser(locale);
  if (!isToolarsAdminUserId(user.accountId)) notFound();
  return user;
}

export function isToolarsAdminUserId(userId: string | null, adminUserIds = process.env.TOOLARS_ADMIN_USER_IDS) {
  if (!userId || !adminUserIds) return false;
  return adminUserIds
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .includes(userId);
}
