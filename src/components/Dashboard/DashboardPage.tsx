import React from 'react';
import { useStore } from '../../store/useStore';
import { StatsCards } from './StatsCards';
import { TasksWidget } from './TasksWidget';
import { ProgressChart } from './ProgressChart';
import { motion } from 'framer-motion';

export const DashboardPage: React.FC = () => {
  const { goals, settings, isLoading } = useStore();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent"></div>
      </div>
    );
  }

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');
  const userName = settings.profile?.name || 'Achiever';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-8"
    >
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold text-[var(--color-text-dark)]">
          Welcome back, {userName}! 👋
        </h1>
        <p className="text-[var(--color-text-light)]">
          You have {activeGoals.length} active goals and have completed {completedGoals.length} goals so far.
        </p>
      </div>

      <StatsCards goals={goals} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProgressChart goals={goals} />
        </div>
        <div className="lg:col-span-1">
          <TasksWidget goals={activeGoals} />
        </div>
      </div>
    </motion.div>
  );
};
