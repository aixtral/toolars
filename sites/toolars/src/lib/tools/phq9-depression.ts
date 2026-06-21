export type Phq9Answer = 0 | 1 | 2 | 3;

export interface Phq9Question {
  label: string;
  description: string;
}

export interface Phq9Result {
  totalScore: number;
  formattedScore: string;
  severity: string;
  supportLevel: "minimal" | "mild" | "moderate" | "moderately-severe" | "severe";
  guidance: string;
  hasSelfHarmRisk: boolean;
  crisisNote: string;
  summary: string;
}

export const phq9Questions: Phq9Question[] = [
  { label: "Little interest or pleasure in doing things", description: "Over the last 2 weeks" },
  { label: "Feeling down, depressed, or hopeless", description: "Over the last 2 weeks" },
  { label: "Trouble falling or staying asleep, or sleeping too much", description: "Over the last 2 weeks" },
  { label: "Feeling tired or having little energy", description: "Over the last 2 weeks" },
  { label: "Poor appetite or overeating", description: "Over the last 2 weeks" },
  { label: "Feeling bad about yourself or that you are a failure", description: "Over the last 2 weeks" },
  { label: "Trouble concentrating on things", description: "Over the last 2 weeks" },
  { label: "Moving or speaking slowly, or being fidgety or restless", description: "Over the last 2 weeks" },
  { label: "Thoughts that you would be better off dead or of hurting yourself", description: "Item 9 safety flag" }
];

export const phq9AnswerLabels: Record<Phq9Answer, string> = {
  0: "Not at all",
  1: "Several days",
  2: "More than half the days",
  3: "Nearly every day"
};

export const phq9AnswerOptions: Phq9Answer[] = [0, 1, 2, 3];
export const defaultPhq9Answers: Phq9Answer[] = [1, 1, 1, 1, 1, 1, 1, 1, 0];

export function calculatePhq9Depression(answers: Phq9Answer[]): Phq9Result {
  const cleanedAnswers = phq9Questions.map((_, index) => cleanAnswer(answers[index] ?? 0));
  const totalScore = cleanedAnswers.reduce<number>((sum, answer) => sum + answer, 0);
  const hasSelfHarmRisk = cleanedAnswers[8] > 0;
  const band = getPhq9Band(totalScore);
  const crisisNote = hasSelfHarmRisk
    ? "Item 9 is non-zero. Treat this as urgent and contact emergency, crisis, or qualified clinical support now."
    : "No item 9 self-harm flag in this local screening snapshot.";

  return {
    totalScore,
    formattedScore: `${totalScore} / 27`,
    severity: band.severity,
    supportLevel: band.supportLevel,
    guidance: band.guidance,
    hasSelfHarmRisk,
    crisisNote,
    summary: `${totalScore} / 27 - ${band.severity}`
  };
}

function getPhq9Band(totalScore: number) {
  if (totalScore <= 4) {
    return {
      severity: "Minimal depression",
      supportLevel: "minimal" as const,
      guidance: "Your score suggests no obvious depression symptoms in this screening model. Keep watching sleep, mood, and daily functioning."
    };
  }

  if (totalScore <= 9) {
    return {
      severity: "Mild depression",
      supportLevel: "mild" as const,
      guidance: "Your score suggests possible mild depression symptoms. Notice mood changes and consider supportive routines or a clinician conversation."
    };
  }

  if (totalScore <= 14) {
    return {
      severity: "Moderate depression",
      supportLevel: "moderate" as const,
      guidance: "Your score suggests possible moderate depression symptoms. Consider booking a counselor, doctor, or qualified clinician."
    };
  }

  if (totalScore <= 19) {
    return {
      severity: "Moderately severe depression",
      supportLevel: "moderately-severe" as const,
      guidance: "Your score suggests possible moderately severe depression symptoms. Please seek professional medical help promptly."
    };
  }

  return {
    severity: "Severe depression",
    supportLevel: "severe" as const,
    guidance: "Your score suggests possible severe depression symptoms. Please contact a psychiatrist, doctor, or emergency support promptly."
  };
}

function cleanAnswer(value: number): Phq9Answer {
  if (value <= 0) return 0;
  if (value >= 3) return 3;
  return value as Phq9Answer;
}
