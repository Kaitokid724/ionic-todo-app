import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  signal,
  computed,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonFab,
  IonFabButton,
  IonIcon,
  IonModal,
  IonButton,
  IonButtons,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonPopover,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonChip,
  IonBadge,
  IonSkeletonText,
  IonProgressBar,
  IonRippleEffect,
  AlertController,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline,
  closeOutline,
  checkmarkOutline,
  trashOutline,
  createOutline,
  filterOutline,
  searchOutline,
  listOutline,
  gridOutline,
  calendarOutline,
  flagOutline,
  chevronForwardOutline,
  checkmarkCircle,
  ellipseOutline,
  sparklesOutline,
  statsChartOutline,
  funnelOutline,
  closeCircleOutline,
  settingsOutline,
  reorderThreeOutline,
} from 'ionicons/icons';

import { TaskService, TaskFilter } from '../../services/task.service';
import { CategoryService } from '../../services/category.service';
import { FirebaseService } from '../../services/firebase.service';
import { Task, TaskPriority, PRIORITY_LABELS, PRIORITY_COLORS } from '../../models/task.model';
import { Category } from '../../models/category.model';
import { TaskItemComponent } from '../../components/task-item/task-item.component';
import { FilterBarComponent } from '../../components/filter-bar/filter-bar.component';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';
import { StatsCardComponent } from '../../components/stats-card/stats-card.component';
// StatsCardComponent uses inline template — no separate html/scss files needed

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonFab,
    IonFabButton,
    IonIcon,
    IonModal,
    IonButton,
    IonButtons,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonDatetime,
    IonPopover,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonChip,
    IonBadge,
    IonSkeletonText,
    IonProgressBar,
    IonRippleEffect,
    TaskItemComponent,
    FilterBarComponent,
    EmptyStateComponent,
    StatsCardComponent,
  ],
})
export class HomePage implements OnInit {
  @ViewChild('addTaskModal') addTaskModal!: IonModal;

  // Expose service signals to template
  readonly filteredTasks = this.taskService.filteredTasks;
  readonly stats = this.taskService.stats;
  readonly categories = this.categoryService.categories;
  readonly flags = this.firebaseService.flags;
  readonly filterCategory = this.taskService.filterCategory;
  readonly filterStatus = this.taskService.filterStatus;

  // Form state
  newTaskTitle = '';
  newTaskDescription = '';
  newTaskCategory: string | null = null;
  newTaskPriority: TaskPriority = 'medium';
  newTaskDueDate: string | null = null;
  showDatePicker = false;
  isSubmitting = false;

  readonly PRIORITY_LABELS = PRIORITY_LABELS;
  readonly PRIORITY_COLORS = PRIORITY_COLORS;

  // Greeting
  readonly greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  });

  constructor(
    readonly taskService: TaskService,
    readonly categoryService: CategoryService,
    readonly firebaseService: FirebaseService,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router,
  ) {
    addIcons({
      addOutline,
      closeOutline,
      checkmarkOutline,
      trashOutline,
      createOutline,
      filterOutline,
      searchOutline,
      listOutline,
      gridOutline,
      calendarOutline,
      flagOutline,
      chevronForwardOutline,
      checkmarkCircle,
      ellipseOutline,
      sparklesOutline,
      statsChartOutline,
      funnelOutline,
      closeCircleOutline,
      settingsOutline,
      reorderThreeOutline,
    });
  }

  ngOnInit(): void {}

  trackByTaskId(_: number, task: Task): string {
    return task.id;
  }

  trackByCategoryId(_: number, cat: Category): string {
    return cat.id;
  }

  onSearchChange(event: CustomEvent): void {
    this.taskService.setSearchQuery(event.detail.value ?? '');
  }

  onStatusFilterChange(event: CustomEvent): void {
    this.taskService.setFilterStatus(event.detail.value as TaskFilter);
  }

  onCategoryFilter(categoryId: string | null): void {
    this.taskService.setFilterCategory(categoryId);
  }

  onToggleTask(taskId: string): void {
    this.taskService.toggleComplete(taskId);
  }

  async onDeleteTask(taskId: string): Promise<void> {
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
            this.taskService.delete(taskId);
            this.showToast('Tarea eliminada', 'trash-outline');
          },
        },
      ],
    });
    await alert.present();
  }

  onOpenTask(taskId: string): void {
    this.router.navigate(['/task', taskId]);
  }

  openAddModal(): void {
    this.resetForm();
    this.addTaskModal.present();
  }

  dismissModal(): void {
    this.addTaskModal.dismiss();
  }

  resetForm(): void {
    this.newTaskTitle = '';
    this.newTaskDescription = '';
    this.newTaskCategory = null;
    this.newTaskPriority = 'medium';
    this.newTaskDueDate = null;
    this.showDatePicker = false;
    this.isSubmitting = false;
  }

  async submitTask(): Promise<void> {
    if (!this.newTaskTitle.trim()) return;
    this.isSubmitting = true;

    try {
      this.taskService.create({
        title: this.newTaskTitle,
        description: this.newTaskDescription || undefined,
        categoryId: this.newTaskCategory,
        priority: this.newTaskPriority,
        dueDate: this.newTaskDueDate ? new Date(this.newTaskDueDate).getTime() : null,
      });

      await this.addTaskModal.dismiss();
      this.showToast('¡Tarea creada!', 'checkmark-outline');
    } finally {
      this.isSubmitting = false;
    }
  }

  clearFilters(): void {
    this.taskService.clearFilters();
  }

  get hasActiveFilters(): boolean {
    return !!(this.filterCategory() || this.filterStatus() !== 'all');
  }

  get today(): string {
    return new Date().toISOString();
  }

  navigateToCategories(): void {
    this.router.navigate(['/categories']);
  }

  private async showToast(message: string, icon: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      icon,
      cssClass: 'custom-toast',
      color: 'primary',
    });
    await toast.present();
  }
}
