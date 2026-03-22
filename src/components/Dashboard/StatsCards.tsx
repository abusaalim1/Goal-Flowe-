import React from 'react';
import { Target, CheckCircle2, Flame, TrendingUp } from 'lucide-react';
import { Goal } from '../../types';
import { Card } from '../common/Card';

interface StatsCardsProps {
  goals: Goal[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ goals }) => {
  const activeGoals = goals.filter(g => g.status === 'active').length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const totalGoals = goals.length;
  const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  // Simple streak calculation (mocked for now)
  const streak = completedGoals > 0 ? 3 : 0;

  const stats = [
    {
      title: 'Active Goals',
      value: activeGoals,
      icon: Target,
      color: 'text-blue-500',
      bg: 'bg-blue-100',
    },
    {
      title: 'Completed',
      value: completedGoals,
      icon: CheckCircle2,
      color: 'text-[var(--color-success)]',
      bg: 'bg-[var(--color-success)]/20',
    },
    {
      title: 'Current Streak',
      value: `${streak} Days`,
      icon: Flame,
      color: 'text-[var(--color-warning)]',
      bg: 'bg-[var(--color-warning)]/20',
    },
    {
      title: 'Completion Rate',
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: 'text-[var(--color-accent)]',
      bg: 'bg-[var(--color-accent)]/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="flex items-center gap-4 p-5">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}>
            <stat.icon className={`h-6 w-6 ${stat.color}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--color-text-light)]">{stat.title}</p>
            <h3 className="font-display text-2xl font-bold text-[var(--color-text-dark)]">{stat.value}</h3>
          </div>
        </Card>
      ))}
    </div>
  );
};
