import { create } from 'zustand';
import { Goal, Activity, Settings, SubTask } from '../types';
import * as storage from '../services/storageService';
import { v4 as uuidv4 } from 'uuid';

interface AppState {
  goals: Goal[];
  activities: Activity[];
  settings: Settings;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadData: () => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id' | 'createdDate' | 'progress' | 'timeSpent'>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  addSubTask: (goalId: string, subTask: Omit<SubTask, 'id' | 'completed'>) => Promise<void>;
  toggleSubTask: (goalId: string, subTaskId: string) => Promise<void>;
  logActivity: (goalId: string, type: Activity['type'], description: string) => Promise<void>;
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
}

const defaultSettings: Settings = {
  theme: 'light',
  aiEnabled: true,
  autoBackup: false,
  notificationsEnabled: true,
  profile: {
    name: 'Achiever',
  },
};

export const useStore = create<AppState>((set, get) => ({
  goals: [],
  activities: [],
  settings: defaultSettings,
  isLoading: true,
  error: null,

  loadData: async () => {
    try {
      set({ isLoading: true });
      const goals = await storage.getGoals();
      const activities = await storage.getActivities();
      const settings = await storage.getSettings() || defaultSettings;
      
      set({ goals, activities, settings, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load data', isLoading: false });
    }
  },

  addGoal: async (goalData) => {
    try {
      const newGoal: Goal = {
        ...goalData,
        id: uuidv4(),
        createdDate: Date.now(),
        progress: 0,
        timeSpent: 0,
      };
      await storage.saveGoal(newGoal);
      await get().logActivity(newGoal.id, 'created', `Created goal: ${newGoal.title}`);
      
      set((state) => ({ goals: [...state.goals, newGoal] }));
    } catch (error) {
      set({ error: 'Failed to add goal' });
    }
  },

  updateGoal: async (id, updates) => {
    try {
      const { goals } = get();
      const goalIndex = goals.findIndex(g => g.id === id);
      if (goalIndex === -1) return;

      const updatedGoal = { ...goals[goalIndex], ...updates };
      
      // Recalculate progress if subtasks changed
      if (updates.subTasks) {
        const completed = updates.subTasks.filter(st => st.completed).length;
        updatedGoal.progress = updates.subTasks.length > 0 
          ? Math.round((completed / updates.subTasks.length) * 100) 
          : 0;
      }

      await storage.saveGoal(updatedGoal);
      
      const newGoals = [...goals];
      newGoals[goalIndex] = updatedGoal;
      set({ goals: newGoals });
      
      if (updates.status === 'completed' && goals[goalIndex].status !== 'completed') {
        await get().logActivity(id, 'completed', `Completed goal: ${updatedGoal.title}`);
      } else {
        await get().logActivity(id, 'updated', `Updated goal: ${updatedGoal.title}`);
      }
    } catch (error) {
      set({ error: 'Failed to update goal' });
    }
  },

  deleteGoal: async (id) => {
    try {
      await storage.deleteGoal(id);
      set((state) => ({ goals: state.goals.filter(g => g.id !== id) }));
    } catch (error) {
      set({ error: 'Failed to delete goal' });
    }
  },

  addSubTask: async (goalId, subTaskData) => {
    const { goals, updateGoal } = get();
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const newSubTask: SubTask = {
      ...subTaskData,
      id: uuidv4(),
      completed: false,
    };

    await updateGoal(goalId, { subTasks: [...goal.subTasks, newSubTask] });
  },

  toggleSubTask: async (goalId, subTaskId) => {
    const { goals, updateGoal } = get();
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const newSubTasks = goal.subTasks.map(st => 
      st.id === subTaskId ? { ...st, completed: !st.completed } : st
    );

    await updateGoal(goalId, { subTasks: newSubTasks });
  },

  logActivity: async (goalId, type, description) => {
    try {
      const activity: Activity = {
        id: uuidv4(),
        goalId,
        type,
        description,
        timestamp: Date.now(),
      };
      await storage.saveActivity(activity);
      set((state) => ({ activities: [activity, ...state.activities] }));
    } catch (error) {
      console.error('Failed to log activity', error);
    }
  },

  updateSettings: async (newSettings) => {
    try {
      const { settings } = get();
      const updated = { ...settings, ...newSettings };
      await storage.saveSettings(updated);
      set({ settings: updated });
    } catch (error) {
      set({ error: 'Failed to update settings' });
    }
  },
}));
