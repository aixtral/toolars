'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock3, Star } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui';
import type { ToolDefinition } from '@/data/types';

interface ToolCardProps {
  tool: ToolDefinition;
}

const iconFileBySlug: Record<string, string> = {
  'ai-content-repurposer': 'ai_content_repurposer.png',
  'brand-voice': 'brand_voice_manager.png',
  'bmi-calculator': 'bmi_calculator.png',
  'bmr-calculator': 'bmr_calculator.png',
  'body-fat-calculator': 'body_fat_calculator.png',
  'blood-pressure': 'blood_pressure_calculator.png',
  'compound-interest': 'compound_interest_calculator.png',
  'content-history': 'history.png',
  'gad7-anxiety': 'gad7_anxiety_test.png',
  'ideal-weight-calculator': 'ideal_weight_calculator.png',
  'loan-calculator': 'loan_payment_calculator.png',
  'macro-calculator': 'macro_calculator.png',
  'mortgage-calculator': 'mortgage_calculator.png',
  'net-worth-calculator': 'net_worth_calculator.png',
  'performance-analytics': 'analytics.png',
  'phq9-depression': 'phq9_depression_test.png',
  'pregnancy-due-date': 'pregnancy_due_date_calculator.png',
  'retirement-calculator': 'retirement_calculator.png',
  'roi-calculator': 'roi_calculator.png',
  'sleep-calculator': 'sleep_calculator.png',
  'tdee-calculator': 'tdee_calculator.png',
  'template-library': 'template_library.png',
  'vo2-max': 'vo2_max_calculator.png',
  'waist-hip-ratio': 'waist_to_hip_ratio_calculator.png',
  'water-intake': 'water_intake_calculator.png',
  'workspace-settings': 'settings.png',
};

function iconSrcFor(tool: ToolDefinition) {
  const file = iconFileBySlug[tool.slug];
  return file ? `/assets/icons/toolars/${file}` : null;
}

function badgeVariantFor(tool: ToolDefinition) {
  if (tool.type === 'ai') return 'ai';
  if (tool.category === 'finance' || tool.category === 'wealth') return 'finance';
  if (tool.category === 'body' || tool.category === 'fitness-nutrition' || tool.category === 'wellness') {
    return 'health';
  }
  return 'default';
}

function categoryLabelFor(tool: ToolDefinition) {
  const labels: Record<ToolDefinition['category'], string> = {
    'ai-content': 'AI Content',
    body: 'Body',
    finance: 'Finance',
    'fitness-nutrition': 'Fitness & Nutrition',
    wealth: 'Wealth',
    wellness: 'Wellness',
  };

  return labels[tool.category];
}

function timeLabelFor(tool: ToolDefinition) {
  return tool.type === 'ai' ? 'Account workflow' : 'Under 2 min';
}

export function ToolCard({ tool }: ToolCardProps) {
  const [favorite, setFavorite] = useState(false);
  const iconSrc = iconSrcFor(tool);
  const openLabel = tool.type === 'ai' ? 'Open AI tool' : 'Open tool';
  const favoriteLabel = favorite
    ? `Remove ${tool.title} from favorites`
    : `Save ${tool.title} to favorites`;

  return (
    <article className="group flex h-full flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition-colors hover:border-brand-500 hover:shadow-toolars">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50">
          {iconSrc ? (
            <Image
              src={iconSrc}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
          ) : (
            <span className="text-sm font-semibold text-brand-700">{tool.title.slice(0, 1)}</span>
          )}
        </span>
        <div className="flex items-center gap-2">
          <Badge variant={badgeVariantFor(tool)}>{tool.type === 'ai' ? 'AI' : 'Free'}</Badge>
          <button
            type="button"
            aria-label={favoriteLabel}
            aria-pressed={favorite}
            onClick={() => setFavorite((current) => !current)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition-colors hover:border-brand-500 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            <Star
              aria-hidden="true"
              size={17}
              strokeWidth={2}
              className={favorite ? 'fill-brand-500 text-brand-600' : undefined}
            />
          </button>
        </div>
      </div>

      <Link href={tool.route} className="min-h-[100px]">
        <p className="text-xs font-semibold uppercase leading-4 text-neutral-500">
          {categoryLabelFor(tool)}
        </p>
        <h3 className="mt-2 text-lg font-semibold leading-6 text-ink group-hover:text-brand-700">
          {tool.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-5 text-neutral-600">
          {tool.description}
        </p>
      </Link>

      <div className="mt-auto flex flex-wrap items-center gap-2">
        <span className="inline-flex min-h-7 items-center gap-1 rounded-md bg-neutral-50 px-2 py-1 text-xs font-semibold text-neutral-600">
          <Clock3 aria-hidden="true" size={13} strokeWidth={2} />
          {timeLabelFor(tool)}
        </span>
        {(tool.badges ?? []).slice(0, 2).map((badge) => (
          <span key={badge} className="rounded-md bg-neutral-50 px-2 py-1 text-xs font-semibold text-neutral-600">
            {badge}
          </span>
        ))}
      </div>

      <Link
        href={tool.route}
        className="inline-flex min-h-10 items-center justify-between gap-2 rounded-lg border border-neutral-200 px-3 text-sm font-semibold text-neutral-700 transition-colors hover:border-brand-500 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      >
        {openLabel}
        <ArrowRight aria-hidden="true" size={16} strokeWidth={2} />
      </Link>
    </article>
  );
}
