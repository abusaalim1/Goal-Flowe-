import React, { useEffect, useState } from 'react';
import { Goal } from '../../types';
import { Card } from '../common/Card';
import { Sparkles, Lightbulb, TrendingUp, AlertCircle } from 'lucide-react';
import { getProductivityInsights } from '../../services/aiService';
import { useStore } from '../../store/useStore';

interface InsightsProps {
  goals: Goal[];
}

export const Insights: React.FC<InsightsProps> = ({ goals }) => {
  const [insights, setInsights] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { settings } = useStore();

  useEffect(() => {
    const fetchInsights = async () => {
      if (!settings.aiEnabled) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const generatedInsights = getProductivityInsights(goals);
        setInsights(generatedInsights);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInsights();
  }, [goals, settings.aiEnabled]);

  return (
    <Card className="flex h-full flex-col gap-6">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-[var(--color-accent)]" />
        <h3 className="font-display text-lg font-semibold text-[var(--color-text-dark)]">AI Insights</h3>
      </div>

      <div className="flex flex-col gap-4">
        {!settings.aiEnabled ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-[var(--color-text-light)]">
            <Lightbulb className="mb-2 h-8 w-8 text-gray-300" />
            <p>AI Insights are currently disabled. Enable them in Settings to get personalized productivity tips.</p>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 w-full animate-pulse rounded-xl bg-gray-100"></div>
            ))}
          </div>
        ) : insights.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-[var(--color-text-light)]">
            <Lightbulb className="mb-2 h-8 w-8 text-gray-300" />
            <p>Add more goals and track your progress to unlock personalized insights.</p>
          </div>
        ) : (
          insights.map((insight, index) => (
            <div key={index} className="flex items-start gap-3 rounded-xl border border-[var(--color-border-soft)] bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 p-4">
              {index % 2 === 0 ? (
                <TrendingUp className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--color-success)]" />
              ) : (
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--color-warning)]" />
              )}
              <p className="text-sm font-medium text-[var(--color-text-dark)]">{insight}</p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
