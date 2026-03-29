import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { listOutline } from 'ionicons/icons';

import { Category } from '../../models/category.model';
import { TaskFilter } from '../../services/task.service';

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IonIcon],
})
export class FilterBarComponent {
  @Input() categories: Category[] = [];
  @Input() activeCategory: string | null = null;
  @Input() activeStatus: TaskFilter = 'all';

  @Output() categoryChange = new EventEmitter<string | null>();
  @Output() statusChange = new EventEmitter<CustomEvent>();

  readonly statusFilters: { value: TaskFilter; label: string }[] = [
    { value: 'all', label: 'Todas' },
    { value: 'active', label: 'Activas' },
    { value: 'completed', label: 'Hechas' },
  ];

  constructor() {
    addIcons({ listOutline });
  }

  onStatusClick(status: TaskFilter): void {
    this.statusChange.emit(new CustomEvent('change', { detail: { value: status } }));
  }
}
