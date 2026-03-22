export type GoalStatus = 'active' | 'completed' | 'paused';
export type GoalPriority = 'high' | 'medium' | 'low';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  status: GoalStatus;
  priority: GoalPriority;
  createdDate: number;
  dueDate: number;
  completedDate?: number;
  progress: number;
  subTasks: SubTask[];
  notes: string;
  timeSpent: number;
  tags: string[];
  color: string;
}

export type ActivityType = 'created' | 'updated' | 'completed' | 'noted';

export interface Activity {
  id: string;
  goalId: string;
  type: ActivityType;
  description: string;
  timestamp: number;
}

export interface UserProfile {
  name: string;
  avatar?: string;
}

export interface Settings {
  theme: 'light' | 'dark';
  aiEnabled: boolean;
  autoBackup: boolean;
  notificationsEnabled: boolean;
  profile?: UserProfile;
}
