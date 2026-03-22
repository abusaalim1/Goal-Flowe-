import React from 'react';
import { cn } from './Button';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && <label className="text-xs font-bold text-[var(--color-text-dark)]">{label}</label>}
        <input
          ref={ref}
          className={cn(
            'flex h-12 w-full rounded-lg border border-[#E8E0D8] bg-white px-4 py-3 text-[15px] text-[var(--color-text-dark)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition-all',
            error && 'border-[var(--color-error)] focus:ring-[var(--color-error)]',
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-[var(--color-error)]">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
