import { describeCronValues, type CronFieldBreakdown } from "./cron-builder";

export interface CronExplainInput {
  expression: string;
  nextRunCount?: number;
}

export interface CronExplainIssue {
  type: "empty-input" | "field-count" | "invalid-field";
  message: string;
}

export interface CronExplainResult {
  valid: boolean;
  summary: string;
  fields: CronFieldBreakdown[];
  nextRuns: string[];
  errors: CronExplainIssue[];
  privacyNote: string;
}

const privacyNote = "Cron expressions are explained locally; schedules are not uploaded.";

export function explainCronExpression({ expression, nextRunCount = 3 }: CronExplainInput): CronExplainResult {
  const trimmed = expression.trim();
  if (!trimmed) {
    return invalidResult("empty-input", "Enter a cron expression.");
  }

  const fields = trimmed.split(/\s+/);
  if (fields.length !== 5) {
    return invalidResult("field-count", "Cron expressions need exactly five fields.");
  }

  const builtFields = buildFields(fields);
  const invalidField = builtFields.find((field) => field.meaning === "invalid");
  if (invalidField) {
    return {
      valid: false,
      summary: "Cron expression needs review.",
      fields: builtFields,
      nextRuns: [],
      errors: [{ type: "invalid-field", message: `${invalidField.name} is outside the supported range.` }],
      privacyNote
    };
  }

  return {
    valid: true,
    summary: describeCronValues(fields),
    fields: builtFields,
    nextRuns: createNextRunHints(nextRunCount),
    errors: [],
    privacyNote
  };
}

function invalidResult(type: CronExplainIssue["type"], message: string): CronExplainResult {
  return {
    valid: false,
    summary: "Cron expression needs review.",
    fields: [],
    nextRuns: [],
    errors: [{ type, message }],
    privacyNote
  };
}

function buildFields(values: string[]): CronFieldBreakdown[] {
  const names = ["Minute", "Hour", "Day", "Month", "Weekday"] as const;
  const ranges = [
    [0, 59],
    [0, 23],
    [1, 31],
    [1, 12],
    [0, 7]
  ];

  return values.map((value, index) => ({
    name: names[index],
    value,
    meaning: isValidCronPart(value, ranges[index][0], ranges[index][1]) ? describePart(value, names[index]) : "invalid"
  }));
}

function isValidCronPart(value: string, min: number, max: number): boolean {
  if (value === "*") return true;
  if (value.startsWith("*/")) return isNumberInRange(value.slice(2), 1, max);
  return value.split(",").every((part) => {
    if (part.includes("-")) {
      const [start, end] = part.split("-");
      return isNumberInRange(start, min, max) && isNumberInRange(end, min, max) && Number(start) <= Number(end);
    }
    return isNumberInRange(part, min, max);
  });
}

function isNumberInRange(value: string, min: number, max: number): boolean {
  if (!/^\d+$/.test(value)) return false;
  const parsed = Number(value);
  return parsed >= min && parsed <= max;
}

function describePart(value: string, name: CronFieldBreakdown["name"]): string {
  if (value === "*") return `Every ${name.toLowerCase()}`;
  if (value === "1-5" && name === "Weekday") return "Monday through Friday";
  if (value.startsWith("*/")) return `Every ${value.slice(2)} ${name.toLowerCase()}s`;
  if (value.includes("-")) return `${value.replace("-", " through ")}`;
  return `At ${value}`;
}

function createNextRunHints(count: number): string[] {
  const now = new Date();
  return Array.from({ length: count }, (_, index) => new Date(now.getTime() + (index + 1) * 60 * 60 * 1000).toISOString());
}
