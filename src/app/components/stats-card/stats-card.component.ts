import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TaskStats {
  total: number;
  completed: number;
  active: number;
  completionRate: number;
}

@Component({
  selector: 'app-stats-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="stats-card">
      <div class="stats-row">
        <div class="stat-item">
          <span class="stat-value">{{ stats.total }}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value active">{{ stats.active }}</span>
          <span class="stat-label">Pendientes</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value done">{{ stats.completed }}</span>
          <span class="stat-label">Completadas</span>
        </div>
      </div>

      <div class="progress-section">
        <div class="progress-header">
          <span class="progress-label">Progreso general</span>
          <span class="progress-pct">{{ stats.completionRate }}%</span>
        </div>
        <div class="progress-track">
          <div
            class="progress-fill"
            [style.width.%]="stats.completionRate"
          ></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .stats-card {
      background: var(--app-card);
      border: 1px solid var(--app-border);
      border-radius: 20px;
      padding: 18px 20px;
      margin: 4px 0 16px;
    }

    .stats-row {
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin-bottom: 16px;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }

    .stat-value {
      font-family: 'Syne', sans-serif;
      font-size: 26px;
      font-weight: 800;
      color: var(--app-text-primary);
      line-height: 1;

      &.active { color: var(--ion-color-warning); }
      &.done { color: var(--ion-color-success); }
    }

    .stat-label {
      font-size: 11px;
      font-weight: 500;
      color: var(--app-text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-divider {
      width: 1px;
      height: 36px;
      background: var(--app-border);
    }

    .progress-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .progress-label {
      font-size: 12px;
      color: var(--app-text-secondary);
      font-weight: 500;
    }

    .progress-pct {
      font-size: 13px;
      font-weight: 700;
      color: var(--ion-color-primary);
    }

    .progress-track {
      height: 6px;
      background: rgba(255,255,255,0.08);
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--ion-color-primary), var(--ion-color-secondary));
      border-radius: 3px;
      transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      min-width: 4px;
    }
  `],
})
export class StatsCardComponent {
  @Input() stats: TaskStats = { total: 0, completed: 0, active: 0, completionRate: 0 };
}
