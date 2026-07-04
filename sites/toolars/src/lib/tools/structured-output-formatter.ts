export interface StructuredOutputFormatterInput {
  rawOutput: string;
  requiredFields: string;
}

export interface StructuredOutputFormatterResult {
  success: boolean;
  parsed: unknown;
  output: string;
  missingFields: string[];
  warnings: string[];
  privacyNote: string;
}

export function formatStructuredOutput(input: StructuredOutputFormatterInput): StructuredOutputFormatterResult {
  const requiredFields = input.requiredFields.split(/[\n,]+/).map((field) => field.trim()).filter(Boolean);
  const jsonText = extractJson(input.rawOutput);

  try {
    const parsed = JSON.parse(jsonText) as Record<string, unknown>;
    const missingFields = requiredFields.filter((field) => !(field in parsed));
    const warnings = missingFields.map((field) => `Missing fields: ${field}`);

    return {
      success: true,
      parsed,
      output: JSON.stringify(parsed, null, 2),
      missingFields,
      warnings,
      privacyNote: "Structured output is parsed locally in the browser."
    };
  } catch {
    return {
      success: false,
      parsed: null,
      output: "",
      missingFields: requiredFields,
      warnings: ["Output is not valid JSON."],
      privacyNote: "Structured output is parsed locally in the browser."
    };
  }
}

function extractJson(value: string): string {
  const fenced = value.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return (fenced?.[1] ?? value).trim();
}
