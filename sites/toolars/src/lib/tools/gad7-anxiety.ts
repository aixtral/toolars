export type Gad7Answer = 0 | 1 | 2 | 3;

export type Gad7Severity = "minimal" | "mild" | "moderate" | "severe";

export interface Gad7Result {
  totalScore: number;
  formattedScore: string;
  severity: Gad7Severity;
}

export const gad7AnswerOptions: Gad7Answer[] = [0, 1, 2, 3];
export const defaultGad7Answers: Gad7Answer[] = [1, 1, 1, 1, 1, 1, 1];

export function calculateGad7Anxiety(answers: Gad7Answer[]): Gad7Result {
  const totalScore = answers.reduce<number>((sum, answer) => sum + cleanAnswer(answer), 0);
  const severity = getSeverityBand(totalScore);

  return {
    totalScore,
    formattedScore: `${totalScore} / 21`,
    severity
  };
}

function getSeverityBand(totalScore: number): Gad7Severity {
  if (totalScore <= 4) return "minimal";
  if (totalScore <= 9) return "mild";
  if (totalScore <= 14) return "moderate";
  return "severe";
}

function cleanAnswer(value: number): Gad7Answer {
  if (value <= 0) return 0;
  if (value >= 3) return 3;
  return value as Gad7Answer;
}
