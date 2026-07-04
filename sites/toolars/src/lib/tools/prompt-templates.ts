export interface PromptTemplateInput {
  task: string;
  audience: string;
  tone: string;
  variables: string;
  constraints: string;
}

export interface PromptTemplateResult {
  template: string;
  variables: string[];
  reviewChecklist: string[];
  summary: string;
  privacyNote: string;
}

export function buildPromptTemplate(input: PromptTemplateInput): PromptTemplateResult {
  const variables = parseList(input.variables).map((item) => item.replace(/[^\w.-]/g, "_"));
  const constraints = parseLines(input.constraints);
  const task = input.task.trim() || "Complete the requested task";
  const audience = input.audience.trim() || "the target reader";
  const tone = input.tone.trim() || "clear";
  const variableLines = variables.length
    ? variables.map((variable) => `- {{${variable}}}`).join("\n")
    : "- {{input}}";
  const constraintLines = constraints.length
    ? constraints.map((constraint) => `- ${constraint}`).join("\n")
    : "- State assumptions and uncertainty.";
  const template = [
    `System: You are a ${tone} assistant for ${audience}.`,
    `Task: ${task}.`,
    "Variables:",
    variableLines,
    "Constraints:",
    constraintLines,
    "User: Use the variables above to produce the requested output."
  ].join("\n");

  return {
    template,
    variables,
    reviewChecklist: constraints.length ? constraints : ["State assumptions and uncertainty."],
    summary: `${variables.length || 1} variables mapped for ${audience}.`,
    privacyNote: "Prompt templates are assembled locally and should be reviewed before provider use."
  };
}

function parseList(value: string): string[] {
  return value.split(/[\n,]+/).map((item) => item.trim()).filter(Boolean);
}

function parseLines(value: string): string[] {
  return value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
}
