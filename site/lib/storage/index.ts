import type { CalculatorOutputValue } from '@/lib/calculators';

const savedResultsKey = 'toolars:saved-calculator-results';
const comparisonsKey = 'toolars:calculator-comparisons';
const maxLocalItems = 20;

export interface CalculatorStorageInput {
  slug: string;
  title: string;
  primaryLabel: string;
  primaryValue: number;
  values: Record<string, CalculatorOutputValue>;
}

export interface StoredCalculatorResult extends CalculatorStorageInput {
  id: string;
  createdAt: string;
}

function storage() {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

function readList(key: string): StoredCalculatorResult[] {
  const localStorage = storage();
  if (!localStorage) return [];

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeList(key: string, results: readonly StoredCalculatorResult[]) {
  const localStorage = storage();
  if (!localStorage) return;

  localStorage.setItem(key, JSON.stringify(results.slice(0, maxLocalItems)));

  // Notify client components (e.g. SavedToolsCard) that saved results changed,
  // so they can re-read localStorage without polling. `storage` events only
  // fire across tabs, so we also dispatch a same-tab custom event.
  if (typeof window !== 'undefined' && key === savedResultsKey) {
    window.dispatchEvent(new CustomEvent('toolars:saved-results-changed'));
  }
}

function createStoredResult(result: CalculatorStorageInput): StoredCalculatorResult {
  const createdAt = new Date().toISOString();
  return {
    ...result,
    id: `${result.slug}-${Date.now()}`,
    createdAt,
  };
}

export function readSavedCalculatorResults() {
  return readList(savedResultsKey);
}

export function readCalculatorComparisons() {
  return readList(comparisonsKey);
}

export function saveCalculatorResult(result: CalculatorStorageInput) {
  const saved = createStoredResult(result);
  writeList(savedResultsKey, [saved, ...readSavedCalculatorResults()]);
  return saved;
}

export function addCalculatorComparison(result: CalculatorStorageInput) {
  const comparison = createStoredResult(result);
  writeList(comparisonsKey, [comparison, ...readCalculatorComparisons()]);
  return comparison;
}
