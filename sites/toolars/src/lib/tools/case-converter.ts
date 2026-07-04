export type CaseConverterVariantKey =
  | "camelCase"
  | "pascalCase"
  | "snakeCase"
  | "kebabCase"
  | "constantCase"
  | "titleCase"
  | "sentenceCase"
  | "dotCase"
  | "lowerCase"
  | "upperCase";

export interface CaseConverterFormat {
  key: CaseConverterVariantKey;
  label: string;
  convert: (words: string[]) => string;
}

export interface CaseConverterVariant {
  key: CaseConverterVariantKey;
  label: string;
  value: string;
}

export interface CaseConverterResult {
  input: string;
  words: string[];
  variants: CaseConverterVariant[];
  summary: string;
  privacyNote: string;
}

export const caseConverterFormats: CaseConverterFormat[] = [
  { key: "camelCase", label: "camelCase", convert: toCamelCase },
  { key: "pascalCase", label: "PascalCase", convert: toPascalCase },
  { key: "snakeCase", label: "snake_case", convert: toSnakeCase },
  { key: "kebabCase", label: "kebab-case", convert: toKebabCase },
  { key: "constantCase", label: "CONSTANT_CASE", convert: toConstantCase },
  { key: "titleCase", label: "Title Case", convert: toTitleCase },
  { key: "sentenceCase", label: "Sentence case", convert: toSentenceCase },
  { key: "dotCase", label: "dot.case", convert: toDotCase },
  { key: "lowerCase", label: "lower case", convert: toLowerCase },
  { key: "upperCase", label: "UPPER CASE", convert: toUpperCase }
];

export function convertCaseText(input: string): CaseConverterResult {
  const words = toWords(input);
  const variants = caseConverterFormats.map((format) => ({
    key: format.key,
    label: format.label,
    value: format.convert(words)
  }));

  return {
    input,
    words,
    variants,
    summary: `${variants.length} case formats generated from ${words.length} detected words.`,
    privacyNote: "Local conversion only; input text stays in the browser."
  };
}

export function toWords(input: string): string[] {
  return input
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/[-_.]+/g, " ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function toCamelCase(words: string[]): string {
  return words.map((word, index) => (index === 0 ? normalizeWord(word) : capitalizeWord(word))).join("");
}

export function toPascalCase(words: string[]): string {
  return words.map(capitalizeWord).join("");
}

export function toSnakeCase(words: string[]): string {
  return words.map(normalizeWord).join("_");
}

export function toKebabCase(words: string[]): string {
  return words.map(normalizeWord).join("-");
}

export function toConstantCase(words: string[]): string {
  return words.map((word) => word.toLocaleUpperCase("en-US")).join("_");
}

export function toTitleCase(words: string[]): string {
  return words.map(capitalizeWord).join(" ");
}

export function toSentenceCase(words: string[]): string {
  return words.map((word, index) => (index === 0 ? capitalizeWord(word) : normalizeWord(word))).join(" ");
}

export function toDotCase(words: string[]): string {
  return words.map(normalizeWord).join(".");
}

export function toLowerCase(words: string[]): string {
  return words.map(normalizeWord).join(" ");
}

export function toUpperCase(words: string[]): string {
  return words.map((word) => word.toLocaleUpperCase("en-US")).join(" ");
}

function normalizeWord(word: string): string {
  return word.toLocaleLowerCase("en-US");
}

function capitalizeWord(word: string): string {
  const normalized = normalizeWord(word);

  return normalized.charAt(0).toLocaleUpperCase("en-US") + normalized.slice(1);
}
