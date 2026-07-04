export type CronPreset = "every-minute" | "hourly" | "daily" | "weekdays" | "weekly";

export interface CronFieldInput {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

export interface CronFieldBreakdown {
  name: "Minute" | "Hour" | "Day" | "Month" | "Weekday";
  value: string;
  meaning: string;
}

export interface CronBuildResult {
  valid: boolean;
  expression: string;
  description: string;
  fields: CronFieldBreakdown[];
  errors: string[];
  privacyNote: string;
}

const privacyNote = "Cron expressions are built locally in the browser.";

const presets: Record<CronPreset, CronFieldInput> = {
  "every-minute": { minute: "*", hour: "*", dayOfMonth: "*", month: "*", dayOfWeek: "*" },
  hourly: { minute: "0", hour: "*", dayOfMonth: "*", month: "*", dayOfWeek: "*" },
  daily: { minute: "0", hour: "9", dayOfMonth: "*", month: "*", dayOfWeek: "*" },
  weekdays: { minute: "0", hour: "9", dayOfMonth: "*", month: "*", dayOfWeek: "1-5" },
  weekly: { minute: "0", hour: "9", dayOfMonth: "*", month: "*", dayOfWeek: "1" }
};

export function applyCronPreset(preset: CronPreset): CronBuildResult {
  return buildCronExpression(presets[preset]);
}

export function buildCronExpression(input: CronFieldInput): CronBuildResult {
  const values = [input.minute, input.hour, input.dayOfMonth, input.month, input.dayOfWeek].map((value) => value.trim() || "*");
  const expression = values.join(" ");
  const fields = createCronFields(values);
  const errors = validateCronValues(values);

  return {
    valid: errors.length === 0,
    expression,
    description: errors.length === 0 ? describeCronValues(values) : "Cron fields need review.",
    fields,
    errors,
    privacyNote
  };
}

export function describeCronValues(values: string[]): string {
  const [minute, hour, day, month, weekday] = values;
  const parts: string[] = [];

  if (minute === "*" && hour === "*") {
    parts.push("Every minute");
  } else if (minute.startsWith("*/") && hour === "*") {
    parts.push(`Every ${minute.slice(2)} minutes`);
  } else if (minute.startsWith("*/")) {
    parts.push(`Every ${minute.slice(2)} minutes`);
    parts.push(`during hours ${hour}`);
  } else if (minute === "0" && hour === "*") {
    parts.push("Every hour");
  } else {
    parts.push(`At ${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`);
  }

  if (day !== "*") parts.push(`on day ${day}`);
  if (month !== "*") parts.push(`in month ${month}`);
  if (weekday !== "*") parts.push(`on ${describeWeekday(weekday)}`);

  return parts.join(", ");
}

function createCronFields(values: string[]): CronFieldBreakdown[] {
  const names = ["Minute", "Hour", "Day", "Month", "Weekday"] as const;
  return values.map((value, index) => ({
    name: names[index],
    value,
    meaning: names[index] === "Weekday" ? describeWeekday(value) : describeField(value, names[index].toLowerCase())
  }));
}

function validateCronValues(values: string[]): string[] {
  const ranges = [
    [0, 59],
    [0, 23],
    [1, 31],
    [1, 12],
    [0, 7]
  ];

  return values.flatMap((value, index) => (isValidCronPart(value, ranges[index][0], ranges[index][1]) ? [] : [`Invalid ${index + 1} field`]));
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

function describeField(value: string, name: string): string {
  if (value === "*") return `every ${name}`;
  if (value.startsWith("*/")) return `every ${value.slice(2)} ${name}s`;
  if (value.includes("-")) return `${value.replace("-", " through ")}`;
  if (value.includes(",")) return value.split(",").join(", ");
  return `at ${value}`;
}

function describeWeekday(value: string): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  if (value === "*") return "every weekday";
  if (value === "1-5") return "Monday through Friday";
  if (value === "0,6" || value === "6,0") return "Saturday and Sunday";
  if (/^\d$/.test(value)) return days[Number(value)] ?? value;
  if (value.includes("-")) {
    const [start, end] = value.split("-");
    return `${days[Number(start)] ?? start} through ${days[Number(end)] ?? end}`;
  }
  return value
    .split(",")
    .map((part) => days[Number(part)] ?? part)
    .join(", ");
}
