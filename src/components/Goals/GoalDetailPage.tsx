import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';
import { Tag } from '../common/Tag';
import { ArrowLeft, Plus, CheckCircle2, Circle, Clock, Edit3, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export const GoalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { goals, addSubTask, toggleSubTask, updateGoal, deleteGoal } = useStore();
  
  const [newSubTask, setNewSubTask] = useState('');
  const [notes, setNotes] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const goal = goals.find(g => g.id === id);

  if (!goal) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h3 className="font-display text-xl font-bold text-[var(--color-text-dark)]">Goal not found</h3>
        <Button onClick={() => navigate('/goals')} className="mt-4">Back to Goals</Button>
      </div>
    );
  }

  const handleAddSubTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubTask.trim()) return;
    addSubTask(goal.id, { title: newSubTask });
    setNewSubTask('');
  };

  const handleSaveNotes = () => {
    updateGoal(goal.id, { notes });
    setIsEditingNotes(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      deleteGoal(goal.id);
      navigate('/goals');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-8 pb-20"
    >
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/goals')}
          className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-light)] hover:text-[var(--color-text-dark)]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Goals
        </button>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleDelete} className="text-[var(--color-error)] hover:bg-red-50">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex flex-1 flex-col gap-6">
          <Card className="flex flex-col gap-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl" style={{ backgroundColor: `${goal.color}20` }}>
                  <span className="text-3xl font-bold" style={{ color: goal.color }}>{goal.title.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <h1 className="font-display text-2xl font-bold text-[var(--color-text-dark)]">{goal.title}</h1>
                  <div className="flex gap-2">
                    <Tag>{goal.category}</Tag>
                    <Tag variant={goal.priority === 'high' ? 'error' : goal.priority === 'medium' ? 'warning' : 'success'}>
                      {goal.priority}
                    </Tag>
                  </div>
                </div>
              </div>
              <select 
                value={goal.status}
                onChange={(e) => updateGoal(goal.id, { status: e.target.value as any })}
                className="rounded-xl border border-[var(--color-border-soft)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-text-dark)] focus:border-[var(--color-secondary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-secondary)]"
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <p className="text-[var(--color-text-light)]">{goal.description}</p>

            <div className="flex flex-col gap-2 rounded-xl bg-gray-50 p-4">
              <div className="flex items-center justify-between text-sm font-medium text-[var(--color-text-dark)]">
                <span>Overall Progress</span>
                <span>{goal.progress}%</span>
              </div>
              <ProgressBar progress={goal.progress} />
              <div className="mt-2 flex items-center justify-between text-xs text-[var(--color-text-light)]">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Created {format(new Date(goal.createdDate), 'MMM dd, yyyy')}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Due {format(new Date(goal.dueDate), 'MMM dd, yyyy')}</span>
              </div>
            </div>
          </Card>

          <Card className="flex flex-col gap-4">
            <h3 className="font-display text-lg font-bold text-[var(--color-text-dark)]">Sub-tasks</h3>
            
            <form onSubmit={handleAddSubTask} className="flex gap-2">
              <input
                type="text"
                value={newSubTask}
                onChange={(e) => setNewSubTask(e.target.value)}
                placeholder="Add a new sub-task..."
                className="flex-1 rounded-xl border border-[var(--color-border-soft)] bg-white px-4 py-2 text-sm text-[var(--color-text-dark)] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              />
              <Button type="submit" size="sm" className="gap-1">
                <Plus className="h-4 w-4" /> Add
              </Button>
            </form>

            <div className="mt-4 flex flex-col gap-2">
              {goal.subTasks.length === 0 ? (
                <p className="py-4 text-center text-sm text-[var(--color-text-light)]">No sub-tasks yet. Break your goal down into smaller steps!</p>
              ) : (
                goal.subTasks.map(task => (
                  <div 
                    key={task.id}
                    onClick={() => toggleSubTask(goal.id, task.id)}
                    className="group flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--color-border-soft)] bg-white p-3 transition-colors hover:bg-gray-50"
                  >
                    <button className="flex-shrink-0 text-gray-400 transition-colors group-hover:text-[var(--color-success)]">
                      {task.completed ? <CheckCircle2 className="h-5 w-5 text-[var(--color-success)]" /> : <Circle className="h-5 w-5" />}
                    </button>
                    <span className={`text-sm font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-[var(--color-text-dark)]'}`}>
                      {task.title}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        <div className="flex w-full flex-col gap-6 lg:w-80">
          <Card className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-[var(--color-text-dark)]">Notes & Journal</h3>
              {!isEditingNotes && (
                <button onClick={() => { setNotes(goal.notes || ''); setIsEditingNotes(true); }} className="text-gray-400 hover:text-[var(--color-text-dark)]">
                  <Edit3 className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {isEditingNotes ? (
              <div className="flex flex-col gap-2">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[150px] w-full resize-y rounded-xl border border-[var(--color-border-soft)] bg-white p-3 text-sm text-[var(--color-text-dark)] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                  placeholder="Write your thoughts, progress, or blockers here..."
                />
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setIsEditingNotes(false)}>Cancel</Button>
                  <Button size="sm" onClick={handleSaveNotes}>Save</Button>
                </div>
              </div>
            ) : (
              <div className="min-h-[100px] rounded-xl bg-gray-50 p-4 text-sm text-[var(--color-text-dark)]">
                {goal.notes ? (
                  <p className="whitespace-pre-wrap">{goal.notes}</p>
                ) : (
                  <p className="text-[var(--color-text-light)] italic">No notes added yet. Click the edit icon to add some.</p>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </motion.div>
  );
};
