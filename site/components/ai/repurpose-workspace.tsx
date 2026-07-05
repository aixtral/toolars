'use client';

import {
  Copy,
  FileText,
  Globe2,
  Play,
  RefreshCw,
  Save,
  Square,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  AI_BRAND_VOICES,
  AI_MODELS,
  AI_PLATFORMS,
  AI_TONES,
  validateRepurposeRequest,
} from '@/lib/ai';
import type {
  RepurposeJob,
  RepurposeOutput,
  RepurposePlatform,
  RepurposeRequest,
  RepurposeSourceType,
  RepurposeStatus,
  RepurposeTone,
} from '@/lib/ai';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui';
import type { PlanId } from '@/lib/plans';

const defaultPlatforms: RepurposePlatform[] = ['twitter-thread', 'linkedin-post'];

function wordCount(content: string) {
  return content.trim().split(/\s+/).filter(Boolean).length;
}

function initialRequest(): RepurposeRequest {
  return {
    sourceType: 'text',
    sourceValue: '',
    platforms: defaultPlatforms,
    tone: 'professional',
    brandVoiceId: 'founder',
    model: 'toolars-fast',
  };
}

function emptyOutput(
  platform: RepurposePlatform,
  tone: RepurposeTone,
  draftContent: string,
): RepurposeOutput {
  const definition = AI_PLATFORMS.find((item) => item.id === platform);

  return {
    id: `${platform}-draft`,
    platform,
    platformLabel: definition?.label ?? platform,
    tone,
    content: draftContent,
    wordCount: wordCount(draftContent),
    status: 'streaming',
    createdAt: new Date().toISOString(),
  };
}

interface RepurposeWorkspaceProps {
  planId?: PlanId;
}

export function RepurposeWorkspace({ planId = 'pro' }: RepurposeWorkspaceProps) {
  const t = useTranslations('repurpose');
  const [sourceType, setSourceType] = useState<RepurposeSourceType>('text');
  const [sourceValue, setSourceValue] = useState('');
  const [platforms, setPlatforms] = useState<RepurposePlatform[]>(defaultPlatforms);
  const [tone, setTone] = useState<RepurposeTone>('professional');
  const [brandVoiceId, setBrandVoiceId] = useState('founder');
  const [model, setModel] = useState('toolars-fast');
  const [status, setStatus] = useState<RepurposeStatus>('draft');
  const [outputs, setOutputs] = useState<RepurposeOutput[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [message, setMessage] = useState(t('ready'));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const selectedRequest = useMemo(
    () => ({
      sourceType,
      sourceValue,
      platforms,
      tone,
      brandVoiceId,
      model,
    }),
    [brandVoiceId, model, platforms, sourceType, sourceValue, tone],
  );

  function clearStream() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  useEffect(() => {
    return () => clearStream();
  }, []);

  function togglePlatform(platform: RepurposePlatform) {
    setPlatforms((current) =>
      current.includes(platform)
        ? current.filter((item) => item !== platform)
        : [...current, platform],
    );
  }

  function revealOutputs(job: RepurposeJob) {
    clearStream();
    let frame = 0;
    const maxFrames = 6;
    const outputWords = job.outputs.map((output) => output.content.split(' '));

    intervalRef.current = setInterval(() => {
      frame += 1;
      const completed = frame >= maxFrames;

      setOutputs(
        job.outputs.map((output, index) => {
          const words = outputWords[index];
          const visibleWords = words.slice(
            0,
            Math.max(3, Math.ceil((words.length * frame) / maxFrames)),
          );
          const content = visibleWords.join(' ');

          return {
            ...output,
            content,
            wordCount: wordCount(content),
            status: completed ? 'completed' : 'streaming',
          };
        }),
      );

      if (completed) {
        clearStream();
        setStatus('completed');
        setMessage(t('completed'));
      }
    }, 90);
  }

  async function generate(request: RepurposeRequest = selectedRequest) {
    const validationErrors = validateRepurposeRequest(request);
    setErrors(validationErrors);

    if (validationErrors.length > 0) {
      setStatus('failed');
      setMessage(t('checkInputs'));
      return;
    }

    // v1: AI generation is free for all logged-in users; no client-side paywall.
    clearStream();
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();

    setStatus('streaming');
    setMessage(t('streaming'));
    setOutputs(
      request.platforms.map((platform) => {
        const definition = AI_PLATFORMS.find((item) => item.id === platform);
        const draftContent = t('drafting', { label: definition?.label ?? platform });
        return emptyOutput(platform, request.tone, draftContent);
      }),
    );

    try {
      const response = await fetch('/api/ai/repurpose', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-toolars-preview-user': 'true',
          'x-toolars-preview-plan': planId,
        },
        body: JSON.stringify(request),
        signal: controllerRef.current.signal,
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string; errors?: string[] };
        const nextErrors = payload.errors ?? [payload.error ?? t('failed')];
        setErrors(nextErrors);
        setStatus('failed');
        setMessage(nextErrors.join(' '));
        return;
      }

      const payload = (await response.json()) as { job: RepurposeJob };
      revealOutputs(payload.job);
    } catch (error) {
      if ((error as Error).name === 'AbortError') return;
      setStatus('failed');
      setMessage(t('failedRetry'));
    }
  }

  function cancelGeneration() {
    controllerRef.current?.abort();
    clearStream();
    setOutputs((current) =>
      current.map((output) => ({
        ...output,
        status: 'canceled',
      })),
    );
    setStatus('canceled');
    setMessage(t('canceled'));
  }

  function saveOutput(platformLabel: string) {
    setMessage(t('savedHistory', { platformLabel }));
  }

  function copyOutput(output: RepurposeOutput) {
    void navigator.clipboard?.writeText(output.content).catch(() => undefined);
    setMessage(t('copied', { platformLabel: output.platformLabel }));
  }

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,420px)_1fr]">
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-neutral-200 bg-neutral-50">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="ai">{t('badgeWorkspace')}</Badge>
            <Badge>{t('badgePlan', { planId })}</Badge>
          </div>
          <CardTitle className="text-2xl leading-8">{t('cardTitle')}</CardTitle>
          <p className="text-sm leading-5 text-neutral-600">
            {t('cardDescription')}
          </p>
        </CardHeader>
        <CardContent className="space-y-5 p-5">
          <div className="grid grid-cols-2 gap-2" aria-label={t('sourceTypeLabel')}>
            <Button
              type="button"
              variant={sourceType === 'text' ? 'primary' : 'secondary'}
              onClick={() => setSourceType('text')}
            >
              <FileText aria-hidden="true" size={18} strokeWidth={2} />
              {t('sourceText')}
            </Button>
            <Button
              type="button"
              variant={sourceType === 'url' ? 'primary' : 'secondary'}
              onClick={() => setSourceType('url')}
            >
              <Globe2 aria-hidden="true" size={18} strokeWidth={2} />
              {t('sourceUrl')}
            </Button>
          </div>

          <div className="grid gap-2">
            {sourceType === 'text' ? (
              <>
                <label className="text-sm font-semibold text-neutral-700" htmlFor="source-text">
                  {t('sourceTextLabel')}
                </label>
                <textarea
                  id="source-text"
                  aria-label={t('sourceTextLabel')}
                  className="min-h-36 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-base text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  value={sourceValue}
                  onChange={(event) => setSourceValue(event.target.value)}
                />
              </>
            ) : (
              <>
                <label className="text-sm font-semibold text-neutral-700" htmlFor="source-url">
                  {t('sourceUrlLabel')}
                </label>
                <Input
                  id="source-url"
                  aria-label={t('sourceUrlLabel')}
                  type="url"
                  placeholder="https://example.com/article"
                  value={sourceValue}
                  onChange={(event) => setSourceValue(event.target.value)}
                />
              </>
            )}
          </div>

          <fieldset className="grid gap-3">
            <legend className="text-sm font-semibold text-neutral-700">{t('platforms')}</legend>
            <div className="grid max-h-64 gap-2 overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-1">
              {AI_PLATFORMS.map((platform) => (
                <label
                  key={platform.id}
                  className="flex min-h-11 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-700"
                >
                  <input
                    type="checkbox"
                    checked={platforms.includes(platform.id)}
                    onChange={() => togglePlatform(platform.id)}
                  />
                  <span>{platform.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-1">
            <label className="grid gap-2 text-sm font-semibold text-neutral-700">
              {t('tone')}
              <select
                className="min-h-11 rounded-lg border border-neutral-300 bg-white px-3 text-base text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                value={tone}
                onChange={(event) => setTone(event.target.value as RepurposeTone)}
              >
                {AI_TONES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-neutral-700">
              {t('brandVoice')}
              <select
                className="min-h-11 rounded-lg border border-neutral-300 bg-white px-3 text-base text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                value={brandVoiceId}
                onChange={(event) => setBrandVoiceId(event.target.value)}
              >
                {AI_BRAND_VOICES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-neutral-700">
              {t('model')}
              <select
                className="min-h-11 rounded-lg border border-neutral-300 bg-white px-3 text-base text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                value={model}
                onChange={(event) => setModel(event.target.value)}
              >
                {AI_MODELS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {errors.length > 0 ? (
            <div
              className="rounded-lg border border-danger/30 bg-red-50 p-3 text-sm font-semibold text-danger"
              role="alert"
            >
              {errors.join(' ')}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            {status === 'streaming' ? (
              <Button type="button" variant="danger" onClick={cancelGeneration}>
                <Square aria-hidden="true" size={18} strokeWidth={2} />
                {t('cancel')}
              </Button>
            ) : (
              <Button type="button" onClick={() => void generate()}>
                <Play aria-hidden="true" size={18} strokeWidth={2} />
                {t('generate')}
              </Button>
            )}
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                const request = initialRequest();
                setSourceType(request.sourceType);
                setSourceValue(request.sourceValue);
                setPlatforms(request.platforms);
                setTone(request.tone);
                setBrandVoiceId(request.brandVoiceId);
                setModel(request.model);
                setOutputs([]);
                setErrors([]);
                setStatus('draft');
                setMessage(t('ready'));
              }}
            >
              {t('reset')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-5">
        <Card>
          <CardHeader className="border-b border-neutral-200">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="text-2xl leading-8">{t('outputVariants')}</CardTitle>
                <p className="mt-1 text-sm leading-5 text-neutral-600">
                  {t('outputDescription')}
                </p>
              </div>
              <Badge variant={status === 'failed' ? 'warning' : status === 'completed' ? 'success' : 'ai'}>
                {status === 'draft' ? 'Draft' : status}
              </Badge>
            </div>
            <p className="min-h-5 text-sm font-semibold text-brand-700" role="status">
              {message}
            </p>
          </CardHeader>
          <CardContent className="p-5">
            <div
              aria-label={t('generatedOutputsLabel')}
              aria-live="polite"
              className="grid gap-4 lg:grid-cols-2"
              role="region"
            >
              {outputs.length === 0 ? (
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-5 text-sm font-semibold text-neutral-600">
                  {t('outputPlaceholder')}
                </div>
              ) : (
                outputs.map((output) => (
                  <article
                    key={output.id}
                    className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="text-base font-bold text-ink">{output.platformLabel}</h3>
                        <p className="text-xs font-semibold uppercase text-neutral-500">
                          {t('toneSuffix', { tone: output.tone })}
                        </p>
                      </div>
                      <Badge variant={output.status === 'canceled' ? 'warning' : 'ai'}>
                        {output.status}
                      </Badge>
                    </div>
                    <p className="mt-4 min-h-28 whitespace-pre-wrap text-sm leading-6 text-neutral-700">
                      {output.content}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-neutral-500">
                        {t('wordCount', { count: output.wordCount })}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <Button type="button" size="sm" variant="secondary" onClick={() => copyOutput(output)}>
                          <Copy aria-hidden="true" size={16} strokeWidth={2} />
                          {t('copy')}
                        </Button>
                        <Button type="button" size="sm" variant="secondary" onClick={() => saveOutput(output.platformLabel)}>
                          <Save aria-hidden="true" size={16} strokeWidth={2} />
                          {t('save')}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            void generate({
                              ...selectedRequest,
                              platforms: [output.platform],
                            })
                          }
                        >
                          <RefreshCw aria-hidden="true" size={16} strokeWidth={2} />
                          {t('regenerate')}
                        </Button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </section>
  );
}
