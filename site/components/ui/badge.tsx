import * as React from 'react';
import { cn } from '@/components/ui/classnames';

type BadgeVariant = 'default' | 'ai' | 'finance' | 'health' | 'success' | 'warning';

const variantClasses: Record<BadgeVariant, string> = {
  default: 'border-neutral-200 bg-neutral-50 text-neutral-700',
  ai: 'border-neutral-200 bg-neutral-50 text-accent-ai',
  finance: 'border-neutral-200 bg-neutral-50 text-accent-finance',
  health: 'border-neutral-200 bg-neutral-50 text-accent-health',
  success: 'border-neutral-200 bg-neutral-50 text-success',
  warning: 'border-neutral-200 bg-neutral-50 text-warning',
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex min-h-6 items-center rounded-md border px-2 py-0.5 text-xs font-semibold leading-4',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  ),
);

Badge.displayName = 'Badge';
