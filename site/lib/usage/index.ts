export interface UsagePeriod {
  periodStart: string;
  periodEnd: string;
}

export interface UsageSnapshot {
  workspaceId: string;
  period: UsagePeriod;
  aiGenerationsUsed: number;
  exportsUsed: number;
  batchRunsUsed: number;
}

export interface UsagePeriodInput {
  workspaceId: string;
  period: UsagePeriod;
}

export interface UsageMeterRepository {
  readUsageSnapshot(input: UsagePeriodInput): Promise<UsageSnapshot>;
  incrementAiGenerations(input: UsagePeriodInput): Promise<UsageSnapshot>;
  incrementExports(input: UsagePeriodInput): Promise<UsageSnapshot>;
  incrementBatchRuns(input: UsagePeriodInput): Promise<UsageSnapshot>;
  reset(): void | Promise<void>;
}

function utcDate(year: number, monthIndex: number, day: number) {
  return new Date(Date.UTC(year, monthIndex, day));
}

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function createMonthlyUsagePeriod(now: Date = new Date()): UsagePeriod {
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const start = utcDate(year, month, 1);
  const end = utcDate(year, month + 1, 1);

  return {
    periodStart: isoDate(start),
    periodEnd: isoDate(end),
  };
}

function usageKey({ workspaceId, period }: UsagePeriodInput) {
  return `${workspaceId}:${period.periodStart}`;
}

function emptySnapshot({ workspaceId, period }: UsagePeriodInput): UsageSnapshot {
  return {
    workspaceId,
    period,
    aiGenerationsUsed: 0,
    exportsUsed: 0,
    batchRunsUsed: 0,
  };
}

export function createInMemoryUsageMeterRepository(): UsageMeterRepository {
  const snapshots = new Map<string, UsageSnapshot>();

  return {
    async readUsageSnapshot(input) {
      return snapshots.get(usageKey(input)) ?? emptySnapshot(input);
    },

    async incrementAiGenerations(input) {
      const current = await this.readUsageSnapshot(input);
      const updated = {
        ...current,
        aiGenerationsUsed: current.aiGenerationsUsed + 1,
      };
      snapshots.set(usageKey(input), updated);
      return updated;
    },

    async incrementExports(input) {
      const current = await this.readUsageSnapshot(input);
      const updated = {
        ...current,
        exportsUsed: current.exportsUsed + 1,
      };
      snapshots.set(usageKey(input), updated);
      return updated;
    },

    async incrementBatchRuns(input) {
      const current = await this.readUsageSnapshot(input);
      const updated = {
        ...current,
        batchRunsUsed: current.batchRunsUsed + 1,
      };
      snapshots.set(usageKey(input), updated);
      return updated;
    },

    reset() {
      snapshots.clear();
    },
  };
}
