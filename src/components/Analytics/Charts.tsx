import React from 'react';
import { Goal, Activity } from '../../types';
import { Card } from '../common/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ChartsProps {
  goals: Goal[];
  activities: Activity[];
}

export const Charts: React.FC<ChartsProps> = ({ goals, activities }) => {
  const categoryCounts = goals.reduce((acc, goal) => {
    acc[goal.category] = (acc[goal.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ['#D4AF37', '#A8D5BA', '#F4A460', '#E89B9B', '#8B5CF6', '#3B82F6'];

  return (
    <div className="flex flex-col gap-8">
      <Card className="flex h-[400px] flex-col gap-6">
        <h3 className="font-display text-lg font-semibold text-[var(--color-text-dark)]">Goals by Category</h3>
        
        {pieData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-[var(--color-text-light)]">
            No data available yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  backgroundColor: 'var(--color-bg-pure)'
                }} 
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
};
