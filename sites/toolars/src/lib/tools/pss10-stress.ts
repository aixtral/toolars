export type Pss10Answer = 0 | 1 | 2 | 3 | 4;

export type Pss10Severity = "low" | "moderate" | "high";

export interface Pss10Result {
  totalScore: number;
  formattedScore: string;
  severity: Pss10Severity;
  scoredAnswers: Pss10Answer[];
  reverseScoredItems: number[];
}

const reverseScoredFlags = [false, false, false, true, true, false, true, false, true, true];

export const pss10AnswerOptions: Pss10Answer[] = [0, 1, 2, 3, 4];
export const pss10ReverseScoredItems = [4, 5, 7, 9, 10];
export const defaultPss10Answers: Pss10Answer[] = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2];

export function calculatePss10Stress(answers: Pss10Answer[]): Pss10Result {
  const scoredAnswers = reverseScoredFlags.map((isReverse, index) => {
    const answer = cleanAnswer(answers[index] ?? 0);
    return isReverse ? ((4 - answer) as Pss10Answer) : answer;
  });
  const totalScore = scoredAnswers.reduce<number>((sum, answer) => sum + answer, 0);
  const severity = getPss10Band(totalScore);

  return {
    totalScore,
    formattedScore: `${totalScore} / 40`,
    severity,
    scoredAnswers,
    reverseScoredItems: pss10ReverseScoredItems
  };
}

function getPss10Band(totalScore: number): Pss10Severity {
  if (totalScore <= 13) return "low";
  if (totalScore <= 26) return "moderate";
  return "high";
}

function cleanAnswer(value: number): Pss10Answer {
  if (value <= 0) return 0;
  if (value >= 4) return 4;
  return value as Pss10Answer;
}
