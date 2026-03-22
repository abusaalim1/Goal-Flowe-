import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Goal, Activity, Settings } from '../types';

interface GoalFlowDB extends DBSchema {
  goals: {
    key: string;
    value: Goal;
    indexes: { 'by-status': string; 'by-category': string };
  };
  activities: {
    key: string;
    value: Activity;
    indexes: { 'by-goalId': string; 'by-timestamp': number };
  };
  settings: {
    key: string;
    value: Settings;
  };
}

const DB_NAME = 'goalflow-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<GoalFlowDB>>;

export const initDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<GoalFlowDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('goals')) {
          const goalStore = db.createObjectStore('goals', { keyPath: 'id' });
          goalStore.createIndex('by-status', 'status');
          goalStore.createIndex('by-category', 'category');
        }
        if (!db.objectStoreNames.contains('activities')) {
          const activityStore = db.createObjectStore('activities', { keyPath: 'id' });
          activityStore.createIndex('by-goalId', 'goalId');
          activityStore.createIndex('by-timestamp', 'timestamp');
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
};

// Goals API
export const getGoals = async (): Promise<Goal[]> => {
  const db = await initDB();
  return db.getAll('goals');
};

export const getGoal = async (id: string): Promise<Goal | undefined> => {
  const db = await initDB();
  return db.get('goals', id);
};

export const saveGoal = async (goal: Goal): Promise<void> => {
  const db = await initDB();
  await db.put('goals', goal);
};

export const deleteGoal = async (id: string): Promise<void> => {
  const db = await initDB();
  await db.delete('goals', id);
};

// Activities API
export const getActivities = async (): Promise<Activity[]> => {
  const db = await initDB();
  return db.getAllFromIndex('activities', 'by-timestamp');
};

export const getActivitiesByGoal = async (goalId: string): Promise<Activity[]> => {
  const db = await initDB();
  return db.getAllFromIndex('activities', 'by-goalId', goalId);
};

export const saveActivity = async (activity: Activity): Promise<void> => {
  const db = await initDB();
  await db.put('activities', activity);
};

// Settings API
export const getSettings = async (): Promise<Settings | undefined> => {
  const db = await initDB();
  return db.get('settings', 'user-settings');
};

export const saveSettings = async (settings: Settings): Promise<void> => {
  const db = await initDB();
  // @ts-ignore
  await db.put('settings', { ...settings, id: 'user-settings' });
};
