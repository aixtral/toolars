export type SubscriptionFrequency = "month" | "year" | "week" | "quarter";
export type SubscriptionCategory = "video" | "music" | "software" | "cloud" | "news" | "game" | "fitness" | "shopping" | "other";

export interface SubscriptionEntry {
  name: string;
  cost: number;
  frequency: SubscriptionFrequency;
  category: SubscriptionCategory;
}

export interface SubscriptionCategoryBreakdown {
  category: SubscriptionCategory;
  label: string;
  monthlySpend: number;
  formattedMonthlySpend: string;
  sharePercent: number;
}

export interface SubscriptionAuditResult {
  monthlySpend: number;
  yearlySpend: number;
  subscriptionCount: number;
  averageMonthly: number;
  categoryBreakdown: SubscriptionCategoryBreakdown[];
  savingsTips: string[];
  formattedMonthlySpend: string;
  formattedYearlySpend: string;
  formattedAverageMonthly: string;
  summary: string;
}

export const categoryLabels: Record<SubscriptionCategory, string> = {
  video: "Video Streaming",
  music: "Music/Podcast",
  software: "Software/SaaS",
  cloud: "Cloud Storage",
  news: "News/Reading",
  game: "Gaming",
  fitness: "Fitness/Health",
  shopping: "Shopping/Membership",
  other: "Other"
};

export const defaultSubscriptionAuditEntries: SubscriptionEntry[] = [
  { name: "Netflix", cost: 15.49, frequency: "month", category: "video" },
  { name: "Spotify", cost: 10.99, frequency: "month", category: "music" },
  { name: "Cloud Storage", cost: 99, frequency: "year", category: "cloud" },
  { name: "Newsletter", cost: 12, frequency: "week", category: "news" },
  { name: "Design Suite", cost: 120, frequency: "quarter", category: "software" }
];

export function calculateSubscriptionAudit(entries: SubscriptionEntry[]): SubscriptionAuditResult {
  const normalized = entries.map((entry) => ({
    ...entry,
    monthlyCost: normalizeMonthlyCost(entry.cost, entry.frequency)
  }));
  const monthlySpend = normalized.reduce((total, entry) => total + entry.monthlyCost, 0);
  const yearlySpend = monthlySpend * 12;
  const subscriptionCount = normalized.length;
  const averageMonthly = subscriptionCount > 0 ? monthlySpend / subscriptionCount : 0;
  const categoryTotals = new Map<SubscriptionCategory, number>();

  normalized.forEach((entry) => {
    categoryTotals.set(entry.category, (categoryTotals.get(entry.category) ?? 0) + entry.monthlyCost);
  });

  const categoryBreakdown = Array.from(categoryTotals.entries())
    .map(([category, monthly]) => ({
      category,
      label: categoryLabels[category],
      monthlySpend: monthly,
      formattedMonthlySpend: formatDollars(monthly),
      sharePercent: monthlySpend > 0 ? (monthly / monthlySpend) * 100 : 0
    }))
    .sort((a, b) => b.monthlySpend - a.monthlySpend);

  const savingsTips = buildSavingsTips(normalized, monthlySpend);

  return {
    monthlySpend,
    yearlySpend,
    subscriptionCount,
    averageMonthly,
    categoryBreakdown,
    savingsTips,
    formattedMonthlySpend: formatDollars(monthlySpend),
    formattedYearlySpend: formatDollars(yearlySpend),
    formattedAverageMonthly: formatDollars(averageMonthly),
    summary:
      subscriptionCount > 0
        ? `${formatDollars(monthlySpend)} monthly across ${subscriptionCount} subscriptions`
        : "No subscriptions added yet"
  };
}

export function normalizeMonthlyCost(cost: number, frequency: SubscriptionFrequency) {
  const cleanCost = Math.max(0, Number.isFinite(cost) ? cost : 0);
  if (frequency === "year") return cleanCost / 12;
  if (frequency === "week") return cleanCost * 4.33;
  if (frequency === "quarter") return cleanCost / 3;
  return cleanCost;
}

function buildSavingsTips(entries: Array<SubscriptionEntry & { monthlyCost: number }>, monthlySpend: number) {
  const tips: string[] = [];
  if (entries.length >= 5) tips.push(`You have ${entries.length} subscriptions. Review duplicates and low-use services.`);
  const videoCount = entries.filter((entry) => entry.category === "video").length;
  if (videoCount >= 2) tips.push(`You have ${videoCount} video streaming subscriptions. Consider rotating them.`);
  const musicCount = entries.filter((entry) => entry.category === "music").length;
  if (musicCount >= 2) tips.push(`You have ${musicCount} music subscriptions. Keep the one you use most.`);
  const yearlyCount = entries.filter((entry) => entry.frequency === "year").length;
  if (yearlyCount > 0) tips.push(`You have ${yearlyCount} annual subscriptions. Review them before renewal.`);
  if (monthlySpend > 500) tips.push("Monthly subscription spending exceeds $500. Consider setting a subscription budget.");
  return tips;
}

function formatDollars(value: number) {
  return `$${value.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
}
