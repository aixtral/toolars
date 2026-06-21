export type AdhdAnswer = 0 | 1 | 2 | 3 | 4;

export interface AdhdQuestion {
  label: string;
  description: string;
}

export interface AdhdScreenerResult {
  totalScore: number;
  formattedScore: string;
  partAScore: number;
  partBScore: number;
  partAPositiveCount: number;
  partBPositiveCount: number;
  positiveCount: number;
  outcome: string;
  supportLevel: "negative" | "borderline" | "positive";
  guidance: string;
  summary: string;
}

export const adhdQuestions: AdhdQuestion[] = [
  { label: "Trouble wrapping up final details", description: "Over the last 6 months" },
  { label: "Difficulty getting things in order", description: "Over the last 6 months" },
  { label: "Problems remembering appointments or obligations", description: "Over the last 6 months" },
  { label: "Avoiding or delaying tasks that require thought", description: "Over the last 6 months" },
  { label: "Fidgeting when you must sit for a long time", description: "Over the last 6 months" },
  { label: "Feeling overly active as if driven by a motor", description: "Over the last 6 months" }
];

export const adhdAnswerLabels: Record<AdhdAnswer, string> = {
  0: "Never",
  1: "Rarely",
  2: "Sometimes",
  3: "Often",
  4: "Very often"
};

export const adhdAnswerOptions: AdhdAnswer[] = [0, 1, 2, 3, 4];
export const defaultAdhdScreenerAnswers: AdhdAnswer[] = [2, 2, 2, 2, 1, 1];

export function calculateAdhdScreener(answers: AdhdAnswer[]): AdhdScreenerResult {
  const cleanedAnswers = adhdQuestions.map((_, index) => cleanAnswer(answers[index] ?? 0));
  const partA = cleanedAnswers.slice(0, 3);
  const partB = cleanedAnswers.slice(3, 6);
  const partAScore = partA.reduce<number>((sum, answer) => sum + answer, 0);
  const partBScore = partB.reduce<number>((sum, answer) => sum + answer, 0);
  const totalScore = partAScore + partBScore;
  const partAPositiveCount = partA.filter((answer) => answer >= 2).length;
  const partBPositiveCount = partB.filter((answer) => answer >= 2).length;
  const positiveCount = partAPositiveCount + partBPositiveCount;
  const band = getAdhdOutcome(positiveCount);

  return {
    totalScore,
    formattedScore: `${totalScore} / 24`,
    partAScore,
    partBScore,
    partAPositiveCount,
    partBPositiveCount,
    positiveCount,
    outcome: band.outcome,
    supportLevel: band.supportLevel,
    guidance: band.guidance,
    summary: `${positiveCount} / 6 positive answers - ${band.outcome}`
  };
}

function getAdhdOutcome(positiveCount: number) {
  if (positiveCount >= 4) {
    return {
      outcome: "Screening positive",
      supportLevel: "positive" as const,
      guidance: "Your ASRS screen suggests ADHD symptoms may be significant. Consider a professional evaluation with a qualified clinician."
    };
  }

  if (positiveCount >= 2) {
    return {
      outcome: "Borderline / uncertain",
      supportLevel: "borderline" as const,
      guidance: "Your ASRS screen is below the positive threshold but shows some symptoms. Consider professional advice if symptoms impair daily life."
    };
  }

  return {
    outcome: "Screening negative",
    supportLevel: "negative" as const,
    guidance: "Your ASRS screen does not suggest significant ADHD symptoms in this short screening model."
  };
}

function cleanAnswer(value: number): AdhdAnswer {
  if (value <= 0) return 0;
  if (value >= 4) return 4;
  return value as AdhdAnswer;
}
