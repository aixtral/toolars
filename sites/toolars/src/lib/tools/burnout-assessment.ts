export type BurnoutAnswer = 0 | 1 | 2 | 3 | 4;

export interface BurnoutQuestion {
  label: string;
  description: string;
}

export interface BurnoutResult {
  totalScore: number;
  formattedScore: string;
  exhaustionScore: number;
  detachmentScore: number;
  formattedExhaustionScore: string;
  formattedDetachmentScore: string;
  exhaustionAverage: string;
  detachmentAverage: string;
  severity: string;
  supportLevel: "none" | "mild" | "moderate" | "severe";
  isHighRisk: boolean;
  guidance: string;
  summary: string;
}

export const burnoutQuestions: BurnoutQuestion[] = [
  { label: "Feeling physically drained and exhausted", description: "Over the last month" },
  { label: "Difficulty concentrating or feeling mentally slowed", description: "Over the last month" },
  { label: "Lost enthusiasm and interest in work", description: "Over the last month" },
  { label: "Feeling cold or cynical toward work", description: "Over the last month" },
  { label: "Feeling exhausted at the end of each workday", description: "Over the last month" },
  { label: "Feeling tired even after a full night of sleep", description: "Over the last month" },
  { label: "No longer feeling proud or satisfied with work outcomes", description: "Detachment dimension" },
  { label: "Feeling emotionally drained by work pressure", description: "Detachment dimension" },
  { label: "Work demands feel beyond what you can handle", description: "Detachment dimension" },
  { label: "Questioning the meaning and value of your work", description: "Detachment dimension" }
];

export const burnoutAnswerLabels: Record<BurnoutAnswer, string> = {
  0: "Never",
  1: "Rarely",
  2: "Sometimes",
  3: "Often",
  4: "Very often"
};

export const burnoutAnswerOptions: BurnoutAnswer[] = [0, 1, 2, 3, 4];
export const defaultBurnoutAnswers: BurnoutAnswer[] = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2];

export function calculateBurnoutAssessment(answers: BurnoutAnswer[]): BurnoutResult {
  const cleanedAnswers = burnoutQuestions.map((_, index) => cleanAnswer(answers[index] ?? 0));
  const exhaustionScore = cleanedAnswers.slice(0, 6).reduce<number>((sum, answer) => sum + answer, 0);
  const detachmentScore = cleanedAnswers.slice(6, 10).reduce<number>((sum, answer) => sum + answer, 0);
  const totalScore = exhaustionScore + detachmentScore;
  const band = getBurnoutBand(totalScore);

  return {
    totalScore,
    formattedScore: `${totalScore} / 40`,
    exhaustionScore,
    detachmentScore,
    formattedExhaustionScore: `${exhaustionScore} / 24`,
    formattedDetachmentScore: `${detachmentScore} / 16`,
    exhaustionAverage: `${(exhaustionScore / 6).toFixed(1)} / 4`,
    detachmentAverage: `${(detachmentScore / 4).toFixed(1)} / 4`,
    severity: band.severity,
    supportLevel: band.supportLevel,
    isHighRisk: totalScore >= 26,
    guidance: band.guidance,
    summary: `${totalScore} / 40 - ${band.severity}`
  };
}

function getBurnoutBand(totalScore: number) {
  if (totalScore >= 36) {
    return {
      severity: "Severe burnout",
      supportLevel: "severe" as const,
      guidance: "Your score suggests a high burnout risk. Consider professional support, workload changes, and short-term recovery planning."
    };
  }

  if (totalScore >= 26) {
    return {
      severity: "Moderate burnout",
      supportLevel: "moderate" as const,
      guidance: "Your score suggests a noticeable burnout risk. Discuss workload, recovery, and support options soon."
    };
  }

  if (totalScore >= 16) {
    return {
      severity: "Mild burnout",
      supportLevel: "mild" as const,
      guidance: "Your score suggests early burnout signs. Review stress sources, rest, boundaries, and recovery routines."
    };
  }

  return {
    severity: "No significant burnout",
    supportLevel: "none" as const,
    guidance: "Your score does not suggest significant burnout in this short screening model. Keep protecting rest and work-life balance."
  };
}

function cleanAnswer(value: number): BurnoutAnswer {
  if (value <= 0) return 0;
  if (value >= 4) return 4;
  return value as BurnoutAnswer;
}
