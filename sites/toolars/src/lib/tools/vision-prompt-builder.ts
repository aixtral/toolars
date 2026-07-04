export interface VisionPromptBuilderInput {
  subject: string;
  framing: string;
  visualChecks: string;
  outputFormat: string;
}

export interface VisionPromptBuilderResult {
  prompt: string;
  checks: string[];
  summary: string;
  reviewNote: string;
  privacyNote: string;
}

export function buildVisionPrompt(input: VisionPromptBuilderInput): VisionPromptBuilderResult {
  const subject = input.subject.trim() || "Review the provided image";
  const framing = input.framing.trim() || "full image";
  const checks = input.visualChecks.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
  const outputFormat = input.outputFormat.trim() || "Return concise findings with evidence.";
  const checkLines = checks.length ? checks.map((check) => `- ${check}`).join("\n") : "- Describe visible evidence.";

  return {
    prompt: [
      `Image task: ${subject}`,
      `Framing: ${framing}`,
      "Visual checks:",
      checkLines,
      `Output format: ${outputFormat}`,
      "Avoid guessing details that are not visible in the image."
    ].join("\n"),
    checks,
    summary: `${checks.length || 1} visual checks prepared for image review.`,
    reviewNote: "Image prompts should ask for visible evidence and avoid unsupported visual claims.",
    privacyNote: "Vision prompt drafts are assembled locally before any image or text is sent to a provider."
  };
}
