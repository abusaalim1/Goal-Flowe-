import React from 'react';
import { Goal } from '../../types';
import { Card } from '../common/Card';
import { CheckCircle2, Circle } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface TasksWidgetProps {
  goals: Goal[];
}

export const TasksWidget: React.FC<TasksWidgetProps> = ({ goals }) => {
  const { toggleSubTask } = useStore();

  const allTasks = goals.flatMap(goal => 
    goal.subTasks.map(task => ({ ...task, goalId: goal.id, goalTitle: goal.title }))
  );

  const pendingTasks = allTasks.filter(t => !t.completed).slice(0, 5);

  return (
    <Card className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-[var(--color-text-dark)]">Today's Tasks</h3>
        <span className="rounded-full bg-[var(--color-primary)] px-2.5 py-0.5 text-xs font-medium text-yellow-800">
          {pendingTasks.length} pending
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {pendingTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-3 rounded-full bg-gray-100 p-3">
              <CheckCircle2 className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-[var(--color-text-dark)]">All caught up!</p>
            <p className="text-xs text-[var(--color-text-light)]">You have no pending tasks today.</p>
          </div>
        ) : (
          pendingTasks.map(task => (
            <div 
              key={task.id} 
              className="group flex cursor-pointer items-start gap-3 rounded-xl border border-transparent p-2 transition-colors hover:bg-gray-50"
              onClick={() => toggleSubTask(task.goalId, task.id)}
            >
              <button className="mt-0.5 flex-shrink-0 text-gray-400 transition-colors group-hover:text-[var(--color-success)]">
                {task.completed ? <CheckCircle2 className="h-5 w-5 text-[var(--color-success)]" /> : <Circle className="h-5 w-5" />}
              </button>
              <div className="flex flex-col">
                <span className={`text-sm font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-[var(--color-text-dark)]'}`}>
                  {task.title}
                </span>
                <span className="text-xs text-[var(--color-text-light)]">{task.goalTitle}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
