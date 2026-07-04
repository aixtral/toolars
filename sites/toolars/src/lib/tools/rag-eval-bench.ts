export type RagEvalStatus = "pass" | "review";

export interface RagEvalCaseInput {
  question: string;
  answer: string;
  expectedTerms: string[];
  sourceIds: string[];
}

export interface RagEvalBenchInput {
  cases: RagEvalCaseInput[];
}

export interface RagEvalRow {
  index: number;
  question: string;
  groundedness: number;
  status: RagEvalStatus;
  missingTerms: string[];
  missingSourceIds: string[];
}

export interface RagEvalBenchResult {
  caseCount: number;
  averageGroundedness: number;
  rows: RagEvalRow[];
  summary: string;
  privacyNote: string;
}

export function runRagEvalBench(input: RagEvalBenchInput): RagEvalBenchResult {
  const rows = input.cases.map((testCase, index) => scoreCase(testCase, index));
  const caseCount = rows.length;
  const averageGroundedness =
    caseCount > 0 ? Math.round(rows.reduce((sum, row) => sum + row.groundedness, 0) / caseCount) : 0;

  return {
    caseCount,
    averageGroundedness,
    rows,
    summary: `${caseCount} eval cases scored at ${averageGroundedness}% average groundedness.`,
    privacyNote: "Local eval heuristics only; questions, answers, and sources stay in the browser."
  };
}

function scoreCase(testCase: RagEvalCaseInput, index: number): RagEvalRow {
  const answer = testCase.answer.toLowerCase();
  const missingTerms = testCase.expectedTerms.filter((term) => !answer.includes(term.toLowerCase()));
  const missingSourceIds = testCase.sourceIds.filter((sourceId) => !answer.includes(sourceId.toLowerCase()));
  const requiredSignals = testCase.expectedTerms.length + testCase.sourceIds.length;
  const matchedSignals = requiredSignals - missingTerms.length - missingSourceIds.length;
  const groundedness = requiredSignals > 0 ? Math.round((matchedSignals / requiredSignals) * 100) : 0;

  return {
    index: index + 1,
    question: testCase.question,
    groundedness,
    status: groundedness >= 75 && missingSourceIds.length === 0 ? "pass" : "review",
    missingTerms,
    missingSourceIds
  };
}
