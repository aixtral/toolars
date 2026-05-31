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
import { UpgradePrompt } from '@/components/billing';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui';
import { evaluateAiGenerationAccess } from '@/lib/plans';
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

function emptyOutput(platform: RepurposePlatform, tone: RepurposeTone): RepurposeOutput {
  const definition = AI_PLATFORMS.find((item) => item.id === platform);
  const content = `Drafting ${definition?.label ?? platform}...`;

  return {
    id: `${platform}-draft`,
    platform,
    platformLabel: definition?.label ?? platform,
    tone,
    content,
    wordCount: wordCount(content),
    status: 'streaming',
    createdAt: new Date().toISOString(),
  };
}

interface RepurposeWorkspaceProps {
  planId?: PlanId;
}

export function RepurposeWorkspace({ planId = 'pro' }: RepurposeWorkspaceProps) {
  const [sourceType, setSourceType] = useState<RepurposeSourceType>('text');
  const [sourceValue, setSourceValue] = useState('');
  const [platforms, setPlatforms] = useState<RepurposePlatform[]>(defaultPlatforms);
  const [tone, setTone] = useState<RepurposeTone>('professional');
  const [brandVoiceId, setBrandVoiceId] = useState('founder');
  const [model, setModel] = useState('toolars-fast');
  const [status, setStatus] = useState<RepurposeStatus>('draft');
  const [outputs, setOutputs] = useState<RepurposeOutput[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [message, setMessage] = useState('Ready to generate.');
  const [upgradeReason, setUpgradeReason] = useState('');
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
        setMessage('Completed. Outputs are ready to copy, save, or regenerate.');
      }
    }, 90);
  }

  async function generate(request: RepurposeRequest = selectedRequest) {
    setUpgradeReason('');
    const validationErrors = validateRepurposeRequest(request);
    setErrors(validationErrors);

    if (validationErrors.length > 0) {
      setStatus('failed');
      setMessage('Check the highlighted AI inputs.');
      return;
    }

    const gate = evaluateAiGenerationAccess({
      planId,
      selectedPlatformCount: request.platforms.length,
      usedGenerations: 0,
    });

    if (!gate.allowed) {
      setStatus('failed');
      setUpgradeReason(gate.reason);
      setMessage(gate.reason);
      return;
    }

    clearStream();
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();

    setStatus('streaming');
    setMessage('Streaming outputs...');
    setOutputs(request.platforms.map((platform) => emptyOutput(platform, request.tone)));

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
        const nextErrors = payload.errors ?? [payload.error ?? 'Generation failed.'];
        setErrors(nextErrors);
        setUpgradeReason(response.status === 402 ? nextErrors.join(' ') : '');
        setStatus('failed');
        setMessage(nextErrors.join(' '));
        return;
      }

      const payload = (await response.json()) as { job: RepurposeJob };
      revealOutputs(payload.job);
    } catch (error) {
      if ((error as Error).name === 'AbortError') return;
      setStatus('failed');
      setMessage('Generation failed. Try again.');
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
    setMessage('Canceled. Partial output preserved.');
  }

  function saveOutput(platformLabel: string) {
    setMessage(`${platformLabel} saved to local draft history.`);
  }

  function copyOutput(output: RepurposeOutput) {
    void navigator.clipboard?.writeText(output.content).catch(() => undefined);
    setMessage(`${output.platformLabel} copied.`);
  }

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,420px)_1fr]">
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-neutral-200 bg-neutral-50">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="ai">AI workspace</Badge>
            <Badge>Account required</Badge>
            <Badge variant="warning">Pro preview</Badge>
            <Badge>{planId} plan</Badge>
          </div>
          <CardTitle className="text-2xl leading-8">Source and controls</CardTitle>
          <p className="text-sm leading-5 text-neutral-600">
            Repurpose a URL or source text into platform-native drafts with tone,
            brand voice, model, and cancellation controls.
          </p>
        </CardHeader>
        <CardContent className="space-y-5 p-5">
          <div className="grid grid-cols-2 gap-2" aria-label="Source type">
            <Button
              type="button"
              variant={sourceType === 'text' ? 'primary' : 'secondary'}
              onClick={() => setSourceType('text')}
            >
              <FileText aria-hidden="true" size={18} strokeWidth={2} />
              Text
            </Button>
            <Button
              type="button"
              variant={sourceType === 'url' ? 'primary' : 'secondary'}
              onClick={() => setSourceType('url')}
            >
              <Globe2 aria-hidden="true" size={18} strokeWidth={2} />
              URL
            </Button>
          </div>

          <div className="grid gap-2">
            {sourceType === 'text' ? (
              <>
                <label className="text-sm font-semibold text-neutral-700" htmlFor="source-text">
                  Source text
                </label>
                <textarea
                  id="source-text"
                  aria-label="Source text"
                  className="min-h-36 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-base text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  value={sourceValue}
                  onChange={(event) => setSourceValue(event.target.value)}
                />
              </>
            ) : (
              <>
                <label className="text-sm font-semibold text-neutral-700" htmlFor="source-url">
                  Source URL
                </label>
                <Input
                  id="source-url"
                  aria-label="Source URL"
                  type="url"
                  placeholder="https://example.com/article"
                  value={sourceValue}
                  onChange={(event) => setSourceValue(event.target.value)}
                />
              </>
            )}
          </div>

          <fieldset className="grid gap-3">
            <legend className="text-sm font-semibold text-neutral-700">Platforms</legend>
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
              Tone
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
              Brand voice
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
              Model
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
                Cancel
              </Button>
            ) : (
              <Button type="button" onClick={() => void generate()}>
                <Play aria-hidden="true" size={18} strokeWidth={2} />
                Generate
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
                setMessage('Ready to generate.');
              }}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-5">
        {upgradeReason ? (
          <UpgradePrompt feature="AI generation" reason={upgradeReason} />
        ) : null}

        <Card>
          <CardHeader className="border-b border-neutral-200">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="text-2xl leading-8">Output variants</CardTitle>
                <p className="mt-1 text-sm leading-5 text-neutral-600">
                  Streamed drafts stay visible when canceled.
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
              aria-label="Generated outputs"
              aria-live="polite"
              className="grid gap-4 lg:grid-cols-2"
              role="region"
            >
              {outputs.length === 0 ? (
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-5 text-sm font-semibold text-neutral-600">
                  Generated platform drafts will appear here.
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
                          {output.tone} tone
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
                        {output.wordCount} words
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <Button type="button" size="sm" variant="secondary" onClick={() => copyOutput(output)}>
                          <Copy aria-hidden="true" size={16} strokeWidth={2} />
                          Copy
                        </Button>
                        <Button type="button" size="sm" variant="secondary" onClick={() => saveOutput(output.platformLabel)}>
                          <Save aria-hidden="true" size={16} strokeWidth={2} />
                          Save
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
                          Regenerate
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
