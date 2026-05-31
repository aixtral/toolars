import Link from 'next/link';
import Image from 'next/image';
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

export function ToolCard({ tool }: ToolCardProps) {
  const iconSrc = iconSrcFor(tool);

  return (
    <article className="group rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition-colors hover:border-brand-500 hover:shadow-toolars">
      <Link href={tool.route} className="grid h-full gap-3">
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
          <Badge variant={badgeVariantFor(tool)}>
            {tool.type === 'ai' ? 'AI' : 'Free'}
          </Badge>
        </div>
        <div>
          <h3 className="text-lg font-semibold leading-6 text-ink group-hover:text-brand-700">
            {tool.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-5 text-neutral-600">
            {tool.description}
          </p>
        </div>
        <div className="mt-auto flex flex-wrap gap-2">
          {(tool.badges ?? []).slice(0, 2).map((badge) => (
            <span key={badge} className="rounded-md bg-neutral-50 px-2 py-1 text-xs font-semibold text-neutral-600">
              {badge}
            </span>
          ))}
        </div>
      </Link>
    </article>
  );
}
