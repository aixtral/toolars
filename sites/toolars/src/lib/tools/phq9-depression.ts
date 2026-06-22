export type Phq9Answer = 0 | 1 | 2 | 3;

export type Phq9Severity = "minimal" | "mild" | "moderate" | "moderately-severe" | "severe";

export interface Phq9Result {
  totalScore: number;
  formattedScore: string;
  severity: Phq9Severity;
  hasSelfHarmRisk: boolean;
}

export const phq9AnswerOptions: Phq9Answer[] = [0, 1, 2, 3];
export const defaultPhq9Answers: Phq9Answer[] = [1, 1, 1, 1, 1, 1, 1, 1, 0];

export function calculatePhq9Depression(answers: Phq9Answer[]): Phq9Result {
  const cleanedAnswers = answers.map((a) => cleanAnswer(a));
  const totalScore = cleanedAnswers.reduce<number>((sum, answer) => sum + answer, 0);
  const hasSelfHarmRisk = cleanedAnswers[8] > 0;
  const severity = getPhq9Band(totalScore);

  return {
    totalScore,
    formattedScore: `${totalScore} / 27`,
    severity,
    hasSelfHarmRisk
  };
}

function getPhq9Band(totalScore: number): Phq9Severity {
  if (totalScore <= 4) return "minimal";
  if (totalScore <= 9) return "mild";
  if (totalScore <= 14) return "moderate";
  if (totalScore <= 19) return "moderately-severe";
  return "severe";
}

function cleanAnswer(value: number): Phq9Answer {
  if (value <= 0) return 0;
  if (value >= 3) return 3;
  return value as Phq9Answer;
}
