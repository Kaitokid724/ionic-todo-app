export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  categoryId: string | null;
  priority: TaskPriority;
  dueDate?: number | null;
  createdAt: number;
  updatedAt: number;
  completedAt?: number | null;
}

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
};

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: '#2ed573',
  medium: '#ffa502',
  high: '#ff4757',
};
