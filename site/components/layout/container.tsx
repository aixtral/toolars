import * as React from 'react';
import { cn } from '@/components/ui/classnames';

export type ContainerProps = React.HTMLAttributes<HTMLDivElement>;

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mx-auto w-full max-w-content px-4 sm:px-6 lg:px-8', className)}
      {...props}
    />
  ),
);

Container.displayName = 'Container';
