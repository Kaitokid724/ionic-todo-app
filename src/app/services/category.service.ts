import { Injectable, signal, computed } from '@angular/core';
import { Category, CategoryColor } from '../models/category.model';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'categories';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private _categories = signal<Category[]>([]);

  readonly categories = this._categories.asReadonly();

  constructor(private storage: StorageService) {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const saved = this.storage.get<Category[]>(STORAGE_KEY);
    if (saved && saved.length > 0) {
      this._categories.set(saved);
    } else {
      // Seed default categories
      const defaults: Category[] = [
        {
          id: this.generateId(),
          name: 'Personal',
          color: 'indigo',
          icon: 'home-outline',
          createdAt: Date.now(),
        },
        {
          id: this.generateId(),
          name: 'Trabajo',
          color: 'violet',
          icon: 'briefcase-outline',
          createdAt: Date.now(),
        },
        {
          id: this.generateId(),
          name: 'Salud',
          color: 'emerald',
          icon: 'fitness-outline',
          createdAt: Date.now(),
        },
      ];
      this._categories.set(defaults);
      this.persist();
    }
  }

  private persist(): void {
    this.storage.set(STORAGE_KEY, this._categories());
  }

  private generateId(): string {
    return `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getById(id: string): Category | undefined {
    return this._categories().find((c) => c.id === id);
  }

  create(data: { name: string; color: CategoryColor; icon: string }): Category {
    const newCategory: Category = {
      id: this.generateId(),
      name: data.name.trim(),
      color: data.color,
      icon: data.icon,
      createdAt: Date.now(),
    };
    this._categories.update((cats) => [...cats, newCategory]);
    this.persist();
    return newCategory;
  }

  update(id: string, data: Partial<Pick<Category, 'name' | 'color' | 'icon'>>): void {
    this._categories.update((cats) =>
      cats.map((c) =>
        c.id === id
          ? { ...c, ...data, name: data.name ? data.name.trim() : c.name }
          : c
      )
    );
    this.persist();
  }

  delete(id: string): void {
    this._categories.update((cats) => cats.filter((c) => c.id !== id));
    this.persist();
  }
}
