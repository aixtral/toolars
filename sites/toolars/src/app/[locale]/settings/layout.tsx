import { requireToolarsPageUser } from "@/lib/auth/toolars-page-access";

export default async function SettingsLayout({
  children,
  params
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  await requireToolarsPageUser(locale);
  return children;
}
