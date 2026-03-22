import React from 'react';
import { Goal } from '../../types';
import { GoalCard } from './GoalCard';
import { Target } from 'lucide-react';

interface GoalListProps {
  goals: Goal[];
}

export const GoalList: React.FC<GoalListProps> = ({ goals }) => {
  if (goals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 rounded-full bg-[var(--color-primary)]/30 p-6">
          <Target className="h-12 w-12 text-[var(--color-accent)]" />
        </div>
        <h3 className="font-display text-xl font-bold text-[var(--color-text-dark)]">No goals found</h3>
        <p className="mt-2 max-w-sm text-[var(--color-text-light)]">
          You haven't added any goals yet, or none match your search criteria. Start by creating a new goal!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  );
};
