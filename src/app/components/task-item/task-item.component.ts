import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonRippleEffect } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  checkmarkCircle,
  ellipseOutline,
  trashOutline,
  chevronForwardOutline,
  calendarOutline,
  flagOutline,
} from 'ionicons/icons';

import { Task, PRIORITY_COLORS } from '../../models/task.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IonIcon, IonRippleEffect],
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Input() category?: Category;

  @Output() toggle = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
  @Output() open = new EventEmitter<string>();

  readonly PRIORITY_COLORS = PRIORITY_COLORS;

  constructor() {
    addIcons({
      checkmarkCircle,
      ellipseOutline,
      trashOutline,
      chevronForwardOutline,
      calendarOutline,
      flagOutline,
    });
  }

  onToggle(event: Event): void {
    event.stopPropagation();
    this.toggle.emit(this.task.id);
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.delete.emit(this.task.id);
  }

  onOpen(): void {
    this.open.emit(this.task.id);
  }

  get isOverdue(): boolean {
    if (!this.task.dueDate || this.task.completed) return false;
    return this.task.dueDate < Date.now();
  }
}
