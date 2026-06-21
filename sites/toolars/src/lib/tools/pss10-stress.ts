export type Pss10Answer = 0 | 1 | 2 | 3 | 4;

export interface Pss10Question {
  label: string;
  description: string;
  reverseScored?: boolean;
}

export interface Pss10Result {
  totalScore: number;
  formattedScore: string;
  severity: string;
  supportLevel: "low" | "moderate" | "high";
  guidance: string;
  scoredAnswers: Pss10Answer[];
  reverseScoredItems: number[];
  summary: string;
}

export const pss10Questions: Pss10Question[] = [
  { label: "Upset because of something unexpected", description: "Over the last month" },
  { label: "Unable to control important things in life", description: "Over the last month" },
  { label: "Felt nervous and stressed", description: "Over the last month" },
  { label: "Successfully handled irritating life hassles", description: "Reverse scored", reverseScored: true },
  { label: "Felt things were going your way", description: "Reverse scored", reverseScored: true },
  { label: "Could not cope with all the things you had to do", description: "Over the last month" },
  { label: "Able to control irritations in your life", description: "Reverse scored", reverseScored: true },
  { label: "Felt difficulties were piling up too high", description: "Over the last month" },
  { label: "Able to handle personal problems", description: "Reverse scored", reverseScored: true },
  { label: "Able to control the way you spend your time", description: "Reverse scored", reverseScored: true }
];

export const pss10AnswerLabels: Record<Pss10Answer, string> = {
  0: "Never",
  1: "Almost never",
  2: "Sometimes",
  3: "Fairly often",
  4: "Very often"
};

export const pss10AnswerOptions: Pss10Answer[] = [0, 1, 2, 3, 4];
export const pss10ReverseScoredItems = [4, 5, 7, 9, 10];
export const defaultPss10Answers: Pss10Answer[] = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2];

export function calculatePss10Stress(answers: Pss10Answer[]): Pss10Result {
  const scoredAnswers = pss10Questions.map((question, index) => {
    const answer = cleanAnswer(answers[index] ?? 0);
    return question.reverseScored ? ((4 - answer) as Pss10Answer) : answer;
  });
  const totalScore = scoredAnswers.reduce<number>((sum, answer) => sum + answer, 0);
  const band = getPss10Band(totalScore);

  return {
    totalScore,
    formattedScore: `${totalScore} / 40`,
    severity: band.severity,
    supportLevel: band.supportLevel,
    guidance: band.guidance,
    scoredAnswers,
    reverseScoredItems: pss10ReverseScoredItems,
    summary: `${totalScore} / 40 - ${band.severity}`
  };
}

function getPss10Band(totalScore: number) {
  if (totalScore <= 13) {
    return {
      severity: "Low stress",
      supportLevel: "low" as const,
      guidance: "Your score suggests a lower perceived stress level. Keep maintaining rest, movement, and recovery routines."
    };
  }

  if (totalScore <= 26) {
    return {
      severity: "Moderate stress",
      supportLevel: "moderate" as const,
      guidance: "Your score suggests moderate perceived stress. Add recovery time, exercise, social support, or structured stress-management routines."
    };
  }

  return {
    severity: "High stress",
    supportLevel: "high" as const,
    guidance: "Your score suggests high perceived stress. Consider active stress-management steps and professional support when stress affects daily life."
  };
}

function cleanAnswer(value: number): Pss10Answer {
  if (value <= 0) return 0;
  if (value >= 4) return 4;
  return value as Pss10Answer;
}
