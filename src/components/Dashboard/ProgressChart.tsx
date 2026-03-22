import React from 'react';
import { Goal } from '../../types';
import { Card } from '../common/Card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';

interface ProgressChartProps {
  goals: Goal[];
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ goals }) => {
  // Generate mock data for the last 7 days based on goal creation and completion
  const data = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = format(date, 'MMM dd');
    
    // Mock progress calculation
    const progress = Math.floor(Math.random() * 40) + 20 + (i * 10);
    
    return {
      name: dateStr,
      progress: Math.min(progress, 100),
    };
  });

  return (
    <Card className="flex h-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-[var(--color-text-dark)]">Progress Overview</h3>
        <select className="rounded-lg border border-[var(--color-border-soft)] bg-white px-3 py-1.5 text-sm text-[var(--color-text-dark)] outline-none focus:ring-2 focus:ring-[var(--color-secondary)]">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-soft)" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--color-text-light)', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--color-text-light)', fontSize: 12 }} 
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                backgroundColor: 'var(--color-bg-pure)'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="progress" 
              stroke="var(--color-accent)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorProgress)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
