import * as React from 'react';
import { cn } from '@/components/ui/classnames';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        'flex min-h-11 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-base text-ink shadow-none transition-colors',
        'placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
        'disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:opacity-70',
        'aria-[invalid=true]:border-danger aria-[invalid=true]:ring-danger',
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = 'Input';
