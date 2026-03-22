import { pipeline, env } from '@xenova/transformers';
import { Goal, SubTask } from '../types';

// Disable local models to fetch from Hugging Face hub, but cache them in IndexedDB
env.allowLocalModels = false;
env.useBrowserCache = true;

let classifier: any = null;
let featureExtractor: any = null;

export const initAI = async () => {
  try {
    if (!classifier) {
      // Small model for text classification (e.g., sentiment or basic intent)
      classifier = await pipeline('text-classification', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
    }
    if (!featureExtractor) {
      // Small model for embeddings (similarity)
      featureExtractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
    return true;
  } catch (error) {
    console.error('Failed to initialize AI models:', error);
    return false;
  }
};

export const suggestNextTask = async (goal: Goal): Promise<SubTask | null> => {
  if (!goal.subTasks || goal.subTasks.length === 0) return null;
  
  const incompleteTasks = goal.subTasks.filter(st => !st.completed);
  if (incompleteTasks.length === 0) return null;

  // Simple heuristic: suggest the one with the closest due date, or the first one
  const sortedTasks = incompleteTasks.sort((a, b) => {
    if (a.dueDate && b.dueDate) return a.dueDate - b.dueDate;
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  });

  return sortedTasks[0];
};

export const generateMotivation = async (goal: Goal): Promise<string> => {
  if (!classifier) await initAI();
  
  const progress = goal.progress;
  if (progress === 0) return "Every journey begins with a single step. Let's get started!";
  if (progress === 100) return "Incredible work! You've achieved your goal.";
  if (progress > 80) return "You're almost there! Keep pushing, the finish line is in sight.";
  if (progress > 50) return "Over halfway done! You're making great progress.";
  
  return "Consistent effort is key. Keep up the good work!";
};

export const autoCategorize = async (title: string, description: string): Promise<string> => {
  if (!featureExtractor) await initAI();
  
  const categories = ['Work', 'Health', 'Personal', 'Finance', 'Learning'];
  const text = `${title} ${description}`.toLowerCase();
  
  if (text.includes('workout') || text.includes('health') || text.includes('diet') || text.includes('exercise')) return 'Health';
  if (text.includes('money') || text.includes('save') || text.includes('finance') || text.includes('budget')) return 'Finance';
  if (text.includes('learn') || text.includes('study') || text.includes('course') || text.includes('read')) return 'Learning';
  if (text.includes('project') || text.includes('work') || text.includes('job') || text.includes('client')) return 'Work';
  
  return 'Personal';
};

export const getProductivityInsights = (goals: Goal[]): string[] => {
  const insights: string[] = [];
  
  const completedGoals = goals.filter(g => g.status === 'completed');
  const activeGoals = goals.filter(g => g.status === 'active');
  
  if (completedGoals.length > 0) {
    insights.push(`You've successfully completed ${completedGoals.length} goals. Great job!`);
  }
  
  if (activeGoals.length > 5) {
    insights.push("You have many active goals. Consider focusing on 2-3 at a time to improve completion rates.");
  }
  
  const highPriorityActive = activeGoals.filter(g => g.priority === 'high');
  if (highPriorityActive.length > 0) {
    insights.push(`Focus on your ${highPriorityActive.length} high priority goals first.`);
  }
  
  return insights;
};
