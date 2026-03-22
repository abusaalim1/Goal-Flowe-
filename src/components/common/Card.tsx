import React from 'react';
import { cn } from './Button';

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl border border-[var(--color-border-soft)] bg-gradient-to-b from-[var(--color-bg-pure)] to-[var(--color-bg-soft)] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]',
        className
      )}
      {...props}
    />
  )
);

Card.displayName = 'Card';
