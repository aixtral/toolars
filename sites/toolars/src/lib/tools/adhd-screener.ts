export type AdhdAnswer = 0 | 1 | 2 | 3 | 4;

export type AdhdOutcome = "negative" | "borderline" | "positive";

export interface AdhdScreenerResult {
  totalScore: number;
  formattedScore: string;
  partAScore: number;
  partBScore: number;
  partAPositiveCount: number;
  partBPositiveCount: number;
  positiveCount: number;
  outcome: AdhdOutcome;
}

export const adhdAnswerOptions: AdhdAnswer[] = [0, 1, 2, 3, 4];
export const defaultAdhdScreenerAnswers: AdhdAnswer[] = [2, 2, 2, 2, 1, 1];

export function calculateAdhdScreener(answers: AdhdAnswer[]): AdhdScreenerResult {
  const cleanedAnswers = answers.map((a) => cleanAnswer(a));
  const partA = cleanedAnswers.slice(0, 3);
  const partB = cleanedAnswers.slice(3, 6);
  const partAScore = partA.reduce<number>((sum, answer) => sum + answer, 0);
  const partBScore = partB.reduce<number>((sum, answer) => sum + answer, 0);
  const totalScore = partAScore + partBScore;
  const partAPositiveCount = partA.filter((answer) => answer >= 2).length;
  const partBPositiveCount = partB.filter((answer) => answer >= 2).length;
  const positiveCount = partAPositiveCount + partBPositiveCount;
  const outcome = getAdhdOutcome(positiveCount);

  return {
    totalScore,
    formattedScore: `${totalScore} / 24`,
    partAScore,
    partBScore,
    partAPositiveCount,
    partBPositiveCount,
    positiveCount,
    outcome
  };
}

function getAdhdOutcome(positiveCount: number): AdhdOutcome {
  if (positiveCount >= 4) return "positive";
  if (positiveCount >= 2) return "borderline";
  return "negative";
}

function cleanAnswer(value: number): AdhdAnswer {
  if (value <= 0) return 0;
  if (value >= 4) return 4;
  return value as AdhdAnswer;
}
