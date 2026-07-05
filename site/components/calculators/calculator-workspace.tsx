'use client';

import { CheckCircle2, Copy, GitCompareArrows, Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';
import { Link } from '@/i18n/navigation';
import type { CalculatorDefinition, ToolDefinition } from '@/data/types';
import type {
  CalculatorEngine,
  CalculatorInputValue,
  CalculatorResult,
  CalculatorSlug,
  CalculatorSuccess,
  CalculatorValidationError,
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

function displayValue(
  value: string | number | boolean,
  formatBoolean: (value: boolean) => string,
) {
  if (typeof value === 'number') return displayNumber(value);
  if (typeof value === 'boolean') return formatBoolean(value);
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

/**
 * Look up a translation, falling back to `fallback` when the key is missing.
 * next-intl translators throw on a missing key, so `.has()` guards the call.
 */
function safeTranslate(
  translator: { has: (key: string) => boolean },
  key: string,
  fallback: string,
  params?: Record<string, string | number>,
): string {
  if (!translator.has(key)) return fallback;
  // next-intl translators accept an optional values object; cast for the
  // union signature without forcing a heavy generic on callers.
  return (translator as unknown as (k: string, v?: Record<string, string | number>) => string)(
    key,
    params,
  );
}

/**
 * Humanize a result value key as a fallback label when no translation exists.
 * e.g. "totalInterest" -> "total Interest" -> "Total interest".
 */
function humanizeKey(key: string) {
  const spaced = key.replace(/([A-Z])/g, ' $1').trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function CalculatorWorkspace({
  tool,
  slug,
  relatedTools,
}: CalculatorWorkspaceProps) {
  const t = useTranslations('calculator');
  const tCommon = useTranslations('common');
  const tCalc = useTranslations('calculators.' + tool.slug);
  const engine = useMemo(() => getCalculatorEngine(slug), [slug]);
  const defaults = useMemo(() => initialValues(engine), [engine]);
  const [values, setValues] = useState(defaults);
  const [result, setResult] = useState<CalculatorResult>(() =>
    calculateCalculator(engine.slug, valuesForEngine(engine, defaults)),
  );
  const [statusMessage, setStatusMessage] = useState('');

  const errorsByField = useMemo(() => {
    if (result.ok) return new Map<string, CalculatorValidationError>();
    return new Map(result.errors.map((error) => [error.field, error]));
  }, [result]);

  function inputLabel(inputName: string, fallback: string) {
    return safeTranslate(tCalc, `inputs.${inputName}.label`, fallback);
  }

  function inputUnit(inputName: string, fallback: string | undefined) {
    if (!fallback) return '';
    return safeTranslate(tCalc, `inputs.${inputName}.unit`, fallback);
  }

  /** Row label (<dt>) for a result value key: a translated label or humanized key. */
  function resultRowLabel(key: string) {
    const path = `results.${key}`;
    // Categorical results map to an object (e.g. {normal, underweight});
    // fall back to a humanized key for those and let the value cell translate.
    if (tCalc.has(path)) {
      try {
        const resolved = tCalc(path);
        if (typeof resolved === 'string') return resolved;
      } catch {
        // next-intl throws INSUFFICIENT_PATH when the key resolves to an object
        // (categorical results) instead of a string — fall through to humanize.
      }
    }
    return humanizeKey(key);
  }

  /** Display value (<dd>) for a result value: categorical strings are translated. */
  function resultValueDisplay(key: string, value: string | number | boolean) {
    if (typeof value === 'string') {
      const valueKey = value.charAt(0).toLowerCase() + value.slice(1);
      return safeTranslate(tCalc, `results.${key}.${valueKey}`, value);
    }
    return displayValue(value, (bool) => (bool ? t('yes') : t('no')));
  }

  function errorText(error: CalculatorValidationError) {
    if (error.code) {
      const label = safeTranslate(
        tCalc,
        `inputs.${error.field}.label`,
        error.label ?? error.field,
      );
      return safeTranslate(t, `errors.${error.code}`, error.message, {
        label,
        bound: error.bound ?? 0,
      });
    }
    return error.message;
  }

  function calculate() {
    const nextResult = calculateCalculator(engine.slug, valuesForEngine(engine, values));
    setResult(nextResult);
    setStatusMessage(nextResult.ok ? t('resultUpdated') : t('checkInputs'));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    calculate();
  }

  function handleSaveResult() {
    if (!result.ok) return;
    saveCalculatorResult(resultForStorage(tool, result));
    setStatusMessage(t('savedLocally'));
  }

  function handleCompareResult() {
    if (!result.ok) return;
    addCalculatorComparison(resultForStorage(tool, result));
    setStatusMessage(t('addedToCompare'));
  }

  function handleShare() {
    const href = window.location.href;
    void navigator.clipboard?.writeText(href).catch(() => undefined);
    setStatusMessage(t('shareLinkCopied'));
  }

  return (
    <section aria-label={t('workspaceLabel', { title: tool.title })} className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-neutral-200 bg-neutral-50">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="success">{tCommon('free')}</Badge>
              <Badge>{tCommon('noLogin')}</Badge>
              <Badge>{tCommon('localActions')}</Badge>
            </div>
            <CardTitle className="text-2xl leading-8">{t('inputsTitle')}</CardTitle>
            <p className="max-w-2xl text-sm leading-5 text-neutral-600">
              {t('inputsDescription')}
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
                      <span>{inputLabel(input.name, input.label)}</span>
                      {input.unit ? (
                        <span className="text-xs font-semibold text-neutral-500">
                          {inputUnit(input.name, input.unit)}
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
                        {errorText(error)}
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
                  {result.errors.map((error) => errorText(error)).join(' ')}
                </div>
              ) : null}

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button type="submit">{t('calculate')}</Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setValues(defaults);
                    setResult(calculateCalculator(engine.slug, valuesForEngine(engine, defaults)));
                    setStatusMessage(t('defaultsRestored'));
                  }}
                >
                  {t('reset')}
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
              {t('resultLabel')}
            </div>
            <CardTitle className="text-2xl leading-8 text-white">
              {result.ok
                ? safeTranslate(tCalc, 'primaryLabel', result.primaryLabel)
                : t('needsValidInputs')}
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
                        {resultRowLabel(key)}
                      </dt>
                      <dd className="text-sm font-bold text-ink">
                        {resultValueDisplay(key, value)}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="grid gap-2">
                  <Button type="button" onClick={handleSaveResult} variant="secondary">
                    <Save aria-hidden="true" size={18} strokeWidth={2} />
                    {t('saveResult')}
                  </Button>
                  <Button type="button" onClick={handleCompareResult} variant="secondary">
                    <GitCompareArrows aria-hidden="true" size={18} strokeWidth={2} />
                    {t('addToCompare')}
                  </Button>
                  <Button type="button" onClick={handleShare} variant="secondary">
                    <Copy aria-hidden="true" size={18} strokeWidth={2} />
                    {t('copyShareLink')}
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
          <h2 className="text-2xl font-bold leading-8 text-ink">{t('relatedTools')}</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {relatedTools.map((relatedTool) => (
              <Link
                key={relatedTool.slug}
                className="rounded-lg border border-neutral-200 bg-white p-4 transition-colors hover:border-brand-500"
                href={relatedTool.route}
              >
                <span className="text-sm font-bold text-ink">{relatedTool.title}</span>
                <span className="mt-2 block text-sm leading-5 text-neutral-600">
                  {relatedTool.description}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </section>
  );
}
