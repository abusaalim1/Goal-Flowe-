import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { X, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { autoCategorize } from '../../services/aiService';

interface GoalFormProps {
  onClose: () => void;
}

export const GoalForm: React.FC<GoalFormProps> = ({ onClose }) => {
  const { addGoal, settings } = useStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Personal');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [color, setColor] = useState('#D4AF37');
  const [isProcessingAI, setIsProcessingAI] = useState(false);

  const handleAutoCategorize = async () => {
    if (!title && !description) return;
    setIsProcessingAI(true);
    try {
      const suggestedCategory = await autoCategorize(title, description);
      setCategory(suggestedCategory);
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) return;

    await addGoal({
      title,
      description,
      category,
      priority,
      dueDate: new Date(dueDate).getTime(),
      status: 'active',
      subTasks: [],
      notes: '',
      tags: [],
      color,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="flex w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border-soft)] px-6 py-4">
          <h2 className="font-display text-xl font-bold text-[var(--color-text-dark)]">Create New Goal</h2>
          <button onClick={onClose} className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6">
          <Input
            label="Goal Title"
            placeholder="e.g., Run a Marathon"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-[var(--color-text-dark)]">Description</label>
            <textarea
              placeholder="Describe your goal..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-24 w-full resize-none rounded-lg border border-[#E8E0D8] bg-white px-4 py-3 text-[15px] text-[var(--color-text-dark)] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[var(--color-text-dark)]">Category</label>
                {settings.aiEnabled && (
                  <button
                    type="button"
                    onClick={handleAutoCategorize}
                    disabled={isProcessingAI || (!title && !description)}
                    className="flex items-center gap-1 text-[10px] font-semibold text-[var(--color-accent)] hover:underline disabled:opacity-50"
                  >
                    <Sparkles className="h-3 w-3" /> Auto
                  </button>
                )}
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-12 w-full rounded-lg border border-[#E8E0D8] bg-white px-4 text-[15px] text-[var(--color-text-dark)] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              >
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Health">Health</option>
                <option value="Finance">Finance</option>
                <option value="Learning">Learning</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-[var(--color-text-dark)]">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="h-12 w-full rounded-lg border border-[#E8E0D8] bg-white px-4 text-[15px] text-[var(--color-text-dark)] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              label="Due Date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-[var(--color-text-dark)]">Color</label>
              <div className="flex h-12 items-center gap-2 rounded-lg border border-[#E8E0D8] bg-white px-2">
                {['#D4AF37', '#A8D5BA', '#F4A460', '#E89B9B', '#8B5CF6', '#3B82F6'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`h-8 w-8 rounded-full border-2 ${color === c ? 'border-gray-800' : 'border-transparent'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit">Create Goal</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
