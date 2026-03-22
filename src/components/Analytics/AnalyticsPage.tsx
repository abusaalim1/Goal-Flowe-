import React from 'react';
import { useStore } from '../../store/useStore';
import { Charts } from './Charts';
import { Insights } from './Insights';
import { motion } from 'framer-motion';
import { Download, Share2 } from 'lucide-react';
import { Button } from '../common/Button';
import { exportData } from '../../services/exportService';

export const AnalyticsPage: React.FC = () => {
  const { goals, activities } = useStore();

  const handleExport = () => {
    exportData({ goals, activities }, 'json');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-[var(--color-text-dark)]">Analytics & Insights</h1>
          <p className="text-[var(--color-text-light)]">Understand your productivity patterns.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2" onClick={handleExport}>
            <Download className="h-5 w-5" />
            Export Data
          </Button>
          <Button className="gap-2">
            <Share2 className="h-5 w-5" />
            Share Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Charts goals={goals} activities={activities} />
        </div>
        <div className="lg:col-span-1">
          <Insights goals={goals} />
        </div>
      </div>
    </motion.div>
  );
};
