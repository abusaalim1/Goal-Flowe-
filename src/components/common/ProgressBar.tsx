import React from 'react';
import { cn } from './Button';

interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, showLabel = false, className }) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={cn('w-full flex flex-col gap-1', className)}>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-secondary-light)]/30">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] transition-all duration-500 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-[var(--color-text-light)] text-right">
          {clampedProgress}%
        </span>
      )}
    </div>
  );
};
