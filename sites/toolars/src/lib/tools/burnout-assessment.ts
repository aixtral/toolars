export type BurnoutAnswer = 0 | 1 | 2 | 3 | 4;

export type BurnoutSeverity = "none" | "mild" | "moderate" | "severe";

export interface BurnoutResult {
  totalScore: number;
  formattedScore: string;
  exhaustionScore: number;
  detachmentScore: number;
  formattedExhaustionScore: string;
  formattedDetachmentScore: string;
  exhaustionAverage: string;
  detachmentAverage: string;
  severity: BurnoutSeverity;
  isHighRisk: boolean;
}

export const burnoutAnswerOptions: BurnoutAnswer[] = [0, 1, 2, 3, 4];
export const defaultBurnoutAnswers: BurnoutAnswer[] = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2];

export function calculateBurnoutAssessment(answers: BurnoutAnswer[]): BurnoutResult {
  const cleanedAnswers = answers.map((a) => cleanAnswer(a));
  const exhaustionScore = cleanedAnswers.slice(0, 6).reduce<number>((sum, answer) => sum + answer, 0);
  const detachmentScore = cleanedAnswers.slice(6, 10).reduce<number>((sum, answer) => sum + answer, 0);
  const totalScore = exhaustionScore + detachmentScore;
  const severity = getBurnoutBand(totalScore);

  return {
    totalScore,
    formattedScore: `${totalScore} / 40`,
    exhaustionScore,
    detachmentScore,
    formattedExhaustionScore: `${exhaustionScore} / 24`,
    formattedDetachmentScore: `${detachmentScore} / 16`,
    exhaustionAverage: `${(exhaustionScore / 6).toFixed(1)} / 4`,
    detachmentAverage: `${(detachmentScore / 4).toFixed(1)} / 4`,
    severity,
    isHighRisk: totalScore >= 26
  };
}

function getBurnoutBand(totalScore: number): BurnoutSeverity {
  if (totalScore >= 36) return "severe";
  if (totalScore >= 26) return "moderate";
  if (totalScore >= 16) return "mild";
  return "none";
}

function cleanAnswer(value: number): BurnoutAnswer {
  if (value <= 0) return 0;
  if (value >= 4) return 4;
  return value as BurnoutAnswer;
}
