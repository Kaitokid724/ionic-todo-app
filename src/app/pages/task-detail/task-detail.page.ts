import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  AlertController,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  trashOutline,
  checkmarkCircle,
  ellipseOutline,
  calendarOutline,
  flagOutline,
  createOutline,
  checkmarkOutline,
  closeOutline,
  saveOutline,
} from 'ionicons/icons';

import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../services/category.service';
import { FirebaseService } from '../../services/firebase.service';
import { Task, TaskPriority, PRIORITY_LABELS, PRIORITY_COLORS } from '../../models/task.model';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.page.html',
  styleUrls: ['./task-detail.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
  ],
})
export class TaskDetailPage implements OnInit {
  private taskId = '';
  readonly task = signal<Task | null>(null);
  readonly isEditing = signal(false);

  // Edit form state
  editTitle = '';
  editDescription = '';
  editCategoryId: string | null = null;
  editPriority: TaskPriority = 'medium';
  editDueDate: string | null = null;

  readonly PRIORITY_LABELS = PRIORITY_LABELS;
  readonly PRIORITY_COLORS = PRIORITY_COLORS;
  readonly categories = this.categoryService.categories;
  readonly flags = this.firebaseService.flags;

  readonly category = computed(() => {
    const t = this.task();
    if (!t || !t.categoryId) return null;
    return this.categoryService.getById(t.categoryId) ?? null;
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    readonly taskService: TaskService,
    readonly categoryService: CategoryService,
    readonly firebaseService: FirebaseService,
    private alertController: AlertController,
    private toastController: ToastController,
  ) {
    addIcons({
      chevronBackOutline,
      trashOutline,
      checkmarkCircle,
      ellipseOutline,
      calendarOutline,
      flagOutline,
      createOutline,
      checkmarkOutline,
      closeOutline,
      saveOutline,
    });
  }

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id') ?? '';
    const found = this.taskService.getById(this.taskId);
    if (!found) {
      this.router.navigate(['/home']);
      return;
    }
    this.task.set(found);
  }

  goBack(): void {
    if (this.isEditing()) {
      this.cancelEdit();
    } else {
      this.router.navigate(['/home']);
    }
  }

  startEdit(): void {
    const t = this.task();
    if (!t) return;
    this.editTitle = t.title;
    this.editDescription = t.description ?? '';
    this.editCategoryId = t.categoryId;
    this.editPriority = t.priority;
    this.editDueDate = t.dueDate ? new Date(t.dueDate).toISOString() : null;
    this.isEditing.set(true);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
  }

  saveEdit(): void {
    if (!this.editTitle.trim()) return;
    this.taskService.update(this.taskId, {
      title: this.editTitle,
      description: this.editDescription || undefined,
      categoryId: this.editCategoryId,
      priority: this.editPriority,
      dueDate: this.editDueDate ? new Date(this.editDueDate).getTime() : null,
    });
    // Refresh task signal
    const updated = this.taskService.getById(this.taskId);
    if (updated) this.task.set(updated);
    this.isEditing.set(false);
    this.showToast('Tarea actualizada');
  }

  toggleComplete(): void {
    this.taskService.toggleComplete(this.taskId);
    const updated = this.taskService.getById(this.taskId);
    if (updated) this.task.set(updated);
  }

  async confirmDelete(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Eliminar tarea',
      message: '¿Estás seguro de que deseas eliminar esta tarea?',
      cssClass: 'custom-alert',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.taskService.delete(this.taskId);
            this.router.navigate(['/home']);
          },
        },
      ],
    });
    await alert.present();
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'primary',
    });
    await toast.present();
  }
}
