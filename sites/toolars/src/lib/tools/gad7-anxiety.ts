export type Gad7Answer = 0 | 1 | 2 | 3;

export interface Gad7Question {
  label: string;
  description: string;
}

export interface Gad7Result {
  totalScore: number;
  formattedScore: string;
  severity: string;
  guidance: string;
  supportLevel: "minimal" | "mild" | "moderate" | "severe";
  summary: string;
}

export const gad7Questions: Gad7Question[] = [
  { label: "Feeling nervous, anxious, or on edge", description: "Over the last 2 weeks" },
  { label: "Not being able to stop or control worrying", description: "Over the last 2 weeks" },
  { label: "Worrying too much about different things", description: "Over the last 2 weeks" },
  { label: "Trouble relaxing", description: "Over the last 2 weeks" },
  { label: "Being so restless that it is hard to sit still", description: "Over the last 2 weeks" },
  { label: "Becoming easily annoyed or irritable", description: "Over the last 2 weeks" },
  { label: "Feeling afraid as if something awful might happen", description: "Over the last 2 weeks" }
];

export const gad7AnswerLabels: Record<Gad7Answer, string> = {
  0: "Not at all",
  1: "Several days",
  2: "More than half the days",
  3: "Nearly every day"
};

export const defaultGad7Answers: Gad7Answer[] = [1, 1, 1, 1, 1, 1, 1];

export function calculateGad7Anxiety(answers: Gad7Answer[]): Gad7Result {
  const totalScore = answers.reduce<number>((sum, answer) => sum + cleanAnswer(answer), 0);
  const band = getSeverityBand(totalScore);

  return {
    totalScore,
    formattedScore: `${totalScore} / 21`,
    severity: band.severity,
    guidance: band.guidance,
    supportLevel: band.supportLevel,
    summary: `${totalScore} / 21 - ${band.severity}`
  };
}

function getSeverityBand(totalScore: number) {
  if (totalScore <= 4) {
    return {
      severity: "Minimal anxiety",
      supportLevel: "minimal" as const,
      guidance: "Your score suggests no obvious anxiety symptoms in this screening model. Keep watching sleep, stress, and daily functioning."
    };
  }

  if (totalScore <= 9) {
    return {
      severity: "Mild anxiety",
      supportLevel: "mild" as const,
      guidance: "Your score suggests possible mild anxiety symptoms. Notice stressors and try relaxation or support routines."
    };
  }

  if (totalScore <= 14) {
    return {
      severity: "Moderate anxiety",
      supportLevel: "moderate" as const,
      guidance: "Your score suggests possible moderate anxiety symptoms. Consider booking a counselor, doctor, or qualified clinician."
    };
  }

  return {
    severity: "Severe anxiety",
    supportLevel: "severe" as const,
    guidance: "Your score suggests possible severe anxiety symptoms. Please seek professional medical help promptly."
  };
}

function cleanAnswer(value: number): Gad7Answer {
  if (value <= 0) return 0;
  if (value >= 3) return 3;
  return value as Gad7Answer;
}
