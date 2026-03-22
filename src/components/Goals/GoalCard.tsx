import React from 'react';
import { Goal } from '../../types';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';
import { Tag } from '../common/Tag';
import { Calendar, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';

interface GoalCardProps {
  goal: Goal;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
  const navigate = useNavigate();
  const { deleteGoal } = useStore();
  const [showMenu, setShowMenu] = React.useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-[var(--color-success)]/20 text-green-700';
      case 'paused': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Card className="relative flex flex-col gap-4 overflow-visible">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${goal.color}20` }}>
            <span className="text-lg font-bold" style={{ color: goal.color }}>{goal.title.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-[var(--color-text-dark)] line-clamp-1">{goal.title}</h3>
            <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${getStatusColor(goal.status)}`}>
              {goal.status}
            </span>
          </div>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-[var(--color-text-dark)]"
          >
            <MoreVertical className="h-5 w-5" />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-8 z-20 w-40 rounded-xl border border-[var(--color-border-soft)] bg-white py-1 shadow-lg">
                <button 
                  onClick={() => { setShowMenu(false); navigate(`/goals/${goal.id}`); }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[var(--color-text-dark)] hover:bg-gray-50"
                >
                  <Eye className="h-4 w-4" /> View Details
                </button>
                <button 
                  onClick={() => { setShowMenu(false); deleteGoal(goal.id); }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[var(--color-error)] hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <p className="text-sm text-[var(--color-text-light)] line-clamp-2 min-h-[40px]">
        {goal.description}
      </p>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs font-medium text-[var(--color-text-light)]">
          <span>Progress</span>
          <span>{goal.progress}%</span>
        </div>
        <ProgressBar progress={goal.progress} />
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-[var(--color-border-soft)] pt-4">
        <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-light)]">
          <Calendar className="h-4 w-4" />
          {format(new Date(goal.dueDate), 'MMM dd, yyyy')}
        </div>
        <div className="flex gap-2">
          <Tag variant={getPriorityColor(goal.priority)}>{goal.priority}</Tag>
          <Tag>{goal.category}</Tag>
        </div>
      </div>
    </Card>
  );
};
