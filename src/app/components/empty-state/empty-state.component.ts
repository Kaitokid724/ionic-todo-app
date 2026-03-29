import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, funnelOutline } from 'ionicons/icons';

@Component({
  selector: 'app-empty-state',
  template: `
    <div class="empty-state animate-scale-in">
      <div class="empty-emoji">{{ hasFilters ? '🔍' : '✅' }}</div>
      <h3>{{ hasFilters ? 'Sin resultados' : 'Sin tareas' }}</h3>
      <p>{{ hasFilters
        ? 'No hay tareas que coincidan con los filtros aplicados.'
        : 'Agrega tu primera tarea para comenzar.' }}</p>

      @if (hasFilters) {
        <button class="empty-btn secondary" (click)="clearFilters.emit()">
          <ion-icon name="funnel-outline"></ion-icon>
          Limpiar filtros
        </button>
      } @else {
        <button class="empty-btn primary" (click)="addTask.emit()">
          <ion-icon name="add-outline"></ion-icon>
          Agregar tarea
        </button>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 50px 20px;
      gap: 10px;
    }

    .empty-emoji { font-size: 52px; margin-bottom: 6px; }

    h3 {
      margin: 0;
      font-family: 'Syne', sans-serif;
      font-size: 20px;
      font-weight: 700;
      color: var(--app-text-primary);
    }

    p {
      margin: 0;
      font-size: 14px;
      color: var(--app-text-secondary);
      max-width: 230px;
      line-height: 1.5;
    }

    .empty-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      border-radius: 14px;
      padding: 12px 20px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      font-family: 'DM Sans', sans-serif;
      border: none;
      margin-top: 8px;

      ion-icon { font-size: 18px; }

      &.primary {
        background: var(--ion-color-primary);
        color: white;
        box-shadow: 0 4px 16px var(--app-accent-glow);
      }

      &.secondary {
        background: var(--app-card);
        border: 1px solid var(--app-border);
        color: var(--app-text-secondary);
      }
    }
  `],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IonIcon],
})
export class EmptyStateComponent {
  @Input() hasFilters = false;
  @Output() addTask = new EventEmitter<void>();
  @Output() clearFilters = new EventEmitter<void>();

  constructor() {
    addIcons({ addOutline, funnelOutline });
  }
}
