import { Injectable, signal, computed } from '@angular/core';
import { Task, TaskPriority } from '../models/task.model';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'tasks';

export type TaskFilter = 'all' | 'active' | 'completed';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private _tasks = signal<Task[]>([]);
  private _filterCategory = signal<string | null>(null);
  private _filterStatus = signal<TaskFilter>('all');
  private _searchQuery = signal<string>('');

  readonly tasks = this._tasks.asReadonly();

  readonly filteredTasks = computed(() => {
    let result = this._tasks();
    const catFilter = this._filterCategory();
    const statusFilter = this._filterStatus();
    const query = this._searchQuery().toLowerCase().trim();

    if (catFilter) {
      result = result.filter((t) => t.categoryId === catFilter);
    }

    if (statusFilter === 'active') {
      result = result.filter((t) => !t.completed);
    } else if (statusFilter === 'completed') {
      result = result.filter((t) => t.completed);
    }

    if (query) {
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          (t.description && t.description.toLowerCase().includes(query))
      );
    }

    // Sort: incomplete first, then by priority (high > medium > low), then by createdAt
    return result.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const priorityOrder: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 };
      const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (pDiff !== 0) return pDiff;
      return b.createdAt - a.createdAt;
    });
  });

  readonly stats = computed(() => {
    const all = this._tasks();
    return {
      total: all.length,
      completed: all.filter((t) => t.completed).length,
      active: all.filter((t) => !t.completed).length,
      completionRate: all.length > 0 ? Math.round((all.filter((t) => t.completed).length / all.length) * 100) : 0,
    };
  });

  readonly filterCategory = this._filterCategory.asReadonly();
  readonly filterStatus = this._filterStatus.asReadonly();
  readonly searchQuery = this._searchQuery.asReadonly();

  constructor(private storage: StorageService) {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const saved = this.storage.get<Task[]>(STORAGE_KEY);
    if (saved) {
      this._tasks.set(saved);
    } else {
      // Seed demo tasks
      const seeds: Task[] = [
        {
          id: this.generateId(),
          title: 'Revisar correos del día',
          description: 'Responder correos pendientes de clientes',
          completed: false,
          categoryId: null,
          priority: 'high',
          dueDate: Date.now() + 86400000,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: this.generateId(),
          title: 'Comprar mercado',
          description: 'Frutas, verduras y proteínas',
          completed: true,
          categoryId: null,
          priority: 'medium',
          dueDate: null,
          createdAt: Date.now() - 3600000,
          updatedAt: Date.now() - 1800000,
          completedAt: Date.now() - 1800000,
        },
      ];
      this._tasks.set(seeds);
      this.persist();
    }
  }

  private persist(): void {
    this.storage.set(STORAGE_KEY, this._tasks());
  }

  private generateId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getById(id: string): Task | undefined {
    return this._tasks().find((t) => t.id === id);
  }

  create(data: {
    title: string;
    description?: string;
    categoryId: string | null;
    priority: TaskPriority;
    dueDate?: number | null;
  }): Task {
    const now = Date.now();
    const newTask: Task = {
      id: this.generateId(),
      title: data.title.trim(),
      description: data.description?.trim() || undefined,
      completed: false,
      categoryId: data.categoryId,
      priority: data.priority,
      dueDate: data.dueDate ?? null,
      createdAt: now,
      updatedAt: now,
    };
    this._tasks.update((tasks) => [newTask, ...tasks]);
    this.persist();
    return newTask;
  }

  update(id: string, data: Partial<Omit<Task, 'id' | 'createdAt'>>): void {
    this._tasks.update((tasks) =>
      tasks.map((t) =>
        t.id === id ? { ...t, ...data, updatedAt: Date.now() } : t
      )
    );
    this.persist();
  }

  toggleComplete(id: string): void {
    const task = this.getById(id);
    if (!task) return;
    const now = Date.now();
    this._tasks.update((tasks) =>
      tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? now : null,
              updatedAt: now,
            }
          : t
      )
    );
    this.persist();
  }

  delete(id: string): void {
    this._tasks.update((tasks) => tasks.filter((t) => t.id !== id));
    this.persist();
  }

  deleteByCategory(categoryId: string): void {
    this._tasks.update((tasks) => tasks.filter((t) => t.categoryId !== categoryId));
    this.persist();
  }

  setFilterCategory(categoryId: string | null): void {
    this._filterCategory.set(categoryId);
  }

  setFilterStatus(status: TaskFilter): void {
    this._filterStatus.set(status);
  }

  setSearchQuery(query: string): void {
    this._searchQuery.set(query);
  }

  clearFilters(): void {
    this._filterCategory.set(null);
    this._filterStatus.set('all');
    this._searchQuery.set('');
  }
}
