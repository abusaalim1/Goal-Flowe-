import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { GoalList } from './GoalList';
import { GoalForm } from './GoalForm';
import { Button } from '../common/Button';
import { Plus, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

export const GoalsPage: React.FC = () => {
  const { goals } = useStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredGoals = goals.filter(g => {
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || g.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-[var(--color-text-dark)]">Your Goals</h1>
          <p className="text-[var(--color-text-light)]">Track and manage your personal objectives.</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="gap-2">
          <Plus className="h-5 w-5" />
          Add New Goal
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search goals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 w-full rounded-xl border border-[var(--color-border-soft)] bg-white pl-10 pr-4 text-sm text-[var(--color-text-dark)] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
          />
        </div>
        <div className="relative sm:w-48">
          <Filter className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-12 w-full appearance-none rounded-xl border border-[var(--color-border-soft)] bg-white pl-10 pr-4 text-sm text-[var(--color-text-dark)] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
          </select>
        </div>
      </div>

      <GoalList goals={filteredGoals} />

      {isFormOpen && <GoalForm onClose={() => setIsFormOpen(false)} />}
    </motion.div>
  );
};
