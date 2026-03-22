import React from 'react';
import { cn } from './Button';

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export const Tag: React.FC<TagProps> = ({ children, variant = 'default', className, ...props }) => {
  const variants = {
    default: 'bg-[var(--color-secondary)]/20 text-[var(--color-text-light)]',
    success: 'bg-[var(--color-success)]/20 text-green-700',
    warning: 'bg-[var(--color-warning)]/20 text-orange-700',
    error: 'bg-[var(--color-error)]/20 text-red-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
