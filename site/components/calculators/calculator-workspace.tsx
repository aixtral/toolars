'use client';

import { CheckCircle2, Copy, GitCompareArrows, Save } from 'lucide-react';
import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';
import type { CalculatorDefinition, ToolDefinition } from '@/data/types';
import type {
  CalculatorEngine,
  CalculatorInputValue,
  CalculatorResult,
  CalculatorSlug,
  CalculatorSuccess,
} from '@/lib/calculators';
import { calculateCalculator, getCalculatorEngine } from '@/lib/calculators';
import { addCalculatorComparison, saveCalculatorResult } from '@/lib/storage';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui';

interface CalculatorWorkspaceProps {
  tool: CalculatorDefinition;
  slug: CalculatorSlug;
  relatedTools: readonly ToolDefinition[];
}

function initialValues(engine: CalculatorEngine) {
  return Object.fromEntries(
    engine.inputs.map((input) => [input.name, String(input.defaultValue)]),
  );
}

function valuesForEngine(
  engine: CalculatorEngine,
  values: Record<string, string>,
): Record<string, CalculatorInputValue> {
  return Object.fromEntries(
    engine.inputs.map((input) => {
      if (typeof input.defaultValue === 'number') {
        return [input.name, Number(values[input.name])];
      }

      if (typeof input.defaultValue === 'boolean') {
        return [input.name, values[input.name] === 'true'];
      }

      return [input.name, values[input.name]];
    }),
  );
}

function displayValue(value: string | number | boolean) {
  if (typeof value === 'number') return displayNumber(value);
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return value;
}

function displayNumber(value: number) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(value);
}

function resultForStorage(tool: CalculatorDefinition, result: CalculatorSuccess) {
  return {
    slug: tool.slug,
    title: tool.title,
    primaryLabel: result.primaryLabel,
    primaryValue: result.primaryValue,
    values: result.values,
  };
}

export function CalculatorWorkspace({
  tool,
  slug,
  relatedTools,
}: CalculatorWorkspaceProps) {
  const engine = useMemo(() => getCalculatorEngine(slug), [slug]);
  const defaults = useMemo(() => initialValues(engine), [engine]);
  const [values, setValues] = useState(defaults);
  const [result, setResult] = useState<CalculatorResult>(() =>
    calculateCalculator(engine.slug, valuesForEngine(engine, defaults)),
  );
  const [statusMessage, setStatusMessage] = useState('');

  const errorsByField = useMemo(() => {
    if (result.ok) return new Map<string, string>();
    return new Map(result.errors.map((error) => [error.field, error.message]));
  }, [result]);

  function calculate() {
    const nextResult = calculateCalculator(engine.slug, valuesForEngine(engine, values));
    setResult(nextResult);
    setStatusMessage(nextResult.ok ? 'Result updated.' : 'Check the highlighted inputs.');
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    calculate();
  }

  function handleSaveResult() {
    if (!result.ok) return;
    saveCalculatorResult(resultForStorage(tool, result));
    setStatusMessage('Saved locally on this device.');
  }

  function handleCompareResult() {
    if (!result.ok) return;
    addCalculatorComparison(resultForStorage(tool, result));
    setStatusMessage('Added to compare.');
  }

  function handleShare() {
    const href = window.location.href;
    void navigator.clipboard?.writeText(href).catch(() => undefined);
    setStatusMessage('Share link copied.');
  }

  return (
    <section aria-label={`${tool.title} workspace`} className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-neutral-200 bg-neutral-50">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="success">Free</Badge>
              <Badge>No login</Badge>
              <Badge>Local actions</Badge>
            </div>
            <CardTitle className="text-2xl leading-8">Calculator inputs</CardTitle>
            <p className="max-w-2xl text-sm leading-5 text-neutral-600">
              Calculators stay free and private. Results run in your browser and basic use
              never requires an account.
            </p>
          </CardHeader>
          <CardContent className="p-5">
            <form className="grid gap-4" onSubmit={handleSubmit}>
              {engine.inputs.map((input) => {
                const error = errorsByField.get(input.name);
                const fieldId = `calculator-${input.name}`;

                return (
                  <div key={input.name} className="grid gap-2">
                    <label
                      className="flex items-center justify-between gap-3 text-sm font-semibold text-neutral-700"
                      htmlFor={fieldId}
                    >
                      <span>{input.label}</span>
                      {input.unit ? (
                        <span className="text-xs font-semibold text-neutral-500">
                          {input.unit}
                        </span>
                      ) : null}
                    </label>
                    <Input
                      aria-describedby={error ? `${fieldId}-error` : undefined}
                      aria-invalid={Boolean(error)}
                      id={fieldId}
                      inputMode={typeof input.defaultValue === 'number' ? 'decimal' : undefined}
                      min={input.min}
                      max={input.max}
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          [input.name]: event.target.value,
                        }))
                      }
                      type={typeof input.defaultValue === 'number' ? 'number' : 'text'}
                      value={values[input.name] ?? ''}
                    />
                    {error ? (
                      <p className="text-sm font-medium text-danger" id={`${fieldId}-error`}>
                        {error}
                      </p>
                    ) : null}
                  </div>
                );
              })}

              {!result.ok ? (
                <div
                  className="rounded-lg border border-danger/30 bg-red-50 p-3 text-sm font-semibold text-danger"
                  role="alert"
                >
                  {result.errors.map((error) => error.message).join(' ')}
                </div>
              ) : null}

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button type="submit">Calculate</Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setValues(defaults);
                    setResult(calculateCalculator(engine.slug, valuesForEngine(engine, defaults)));
                    setStatusMessage('Defaults restored.');
                  }}
                >
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card
          aria-label="Result"
          aria-live="polite"
          className="overflow-hidden lg:sticky lg:top-24 lg:self-start"
          role="region"
        >
          <CardHeader className="border-b border-neutral-200 bg-brand-900 text-white">
            <div className="flex items-center gap-2 text-sm font-semibold text-teal-100">
              <CheckCircle2 aria-hidden="true" size={18} strokeWidth={2} />
              Instant result
            </div>
            <CardTitle className="text-2xl leading-8 text-white">
              {result.ok ? result.primaryLabel : 'Needs valid inputs'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 p-5">
            {result.ok ? (
              <>
                <div>
                  <div className="text-5xl font-bold leading-[56px] text-ink">
                    {displayNumber(result.primaryValue)}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-neutral-600">
                    {result.formulaLabel}
                  </p>
                </div>

                <dl className="grid gap-2">
                  {Object.entries(result.values).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2"
                    >
                      <dt className="text-sm font-semibold capitalize text-neutral-600">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </dt>
                      <dd className="text-sm font-bold text-ink">{displayValue(value)}</dd>
                    </div>
                  ))}
                </dl>

                <div className="grid gap-2">
                  <Button type="button" onClick={handleSaveResult} variant="secondary">
                    <Save aria-hidden="true" size={18} strokeWidth={2} />
                    Save result
                  </Button>
                  <Button type="button" onClick={handleCompareResult} variant="secondary">
                    <GitCompareArrows aria-hidden="true" size={18} strokeWidth={2} />
                    Add to compare
                  </Button>
                  <Button type="button" onClick={handleShare} variant="secondary">
                    <Copy aria-hidden="true" size={18} strokeWidth={2} />
                    Copy share link
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-sm leading-5 text-neutral-600">
                Correct the highlighted fields and calculate again. No result is shown until
                the inputs pass validation.
              </p>
            )}

            <p className="min-h-5 text-sm font-semibold text-brand-700" role="status">
              {statusMessage}
            </p>
          </CardContent>
        </Card>
      </div>

      {relatedTools.length > 0 ? (
        <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-bold leading-8 text-ink">Related tools</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {relatedTools.map((relatedTool) => (
              <a
                key={relatedTool.slug}
                className="rounded-lg border border-neutral-200 bg-white p-4 transition-colors hover:border-brand-500"
                href={relatedTool.route}
              >
                <span className="text-sm font-bold text-ink">{relatedTool.title}</span>
                <span className="mt-2 block text-sm leading-5 text-neutral-600">
                  {relatedTool.description}
                </span>
              </a>
            ))}
          </div>
        </section>
      ) : null}
    </section>
  );
}
