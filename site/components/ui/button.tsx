import * as React from 'react';
import { cn } from '@/components/ui/classnames';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'md' | 'sm' | 'icon';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border-transparent bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700',
  secondary:
    'border-neutral-200 bg-white text-ink hover:border-brand-500 hover:bg-neutral-50',
  ghost:
    'border-transparent bg-transparent text-neutral-700 hover:bg-neutral-100 hover:text-ink',
  danger:
    'border-transparent bg-danger text-white hover:bg-red-600 active:bg-red-700',
};

const sizeClasses: Record<ButtonSize, string> = {
  md: 'min-h-11 px-4 py-2 text-base',
  sm: 'min-h-11 px-3 py-2 text-sm',
  icon: 'h-11 w-11 p-0',
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = 'Button';
