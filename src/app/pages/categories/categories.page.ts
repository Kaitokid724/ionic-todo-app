import {
  Component,
  ChangeDetectionStrategy,
  signal,
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
  IonButtons,
  IonButton,
  IonIcon,
  IonModal,
  AlertController,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline,
  closeOutline,
  createOutline,
  trashOutline,
  checkmarkOutline,
  chevronBackOutline,
  listOutline,
} from 'ionicons/icons';

import { CategoryService } from '../../services/category.service';
import { TaskService } from '../../services/task.service';
import {
  Category,
  CategoryColor,
  CATEGORY_COLORS,
  CATEGORY_ICONS,
} from '../../models/category.model';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonModal,
  ],
})
export class CategoriesPage {
  @ViewChild('categoryModal') categoryModal!: IonModal;

  readonly categories = this.categoryService.categories;
  readonly tasks = this.taskService.tasks;

  readonly CATEGORY_COLORS = CATEGORY_COLORS;
  readonly CATEGORY_ICONS = CATEGORY_ICONS;

  // Form state
  editingCategory: Category | null = null;
  formName = '';
  formColor: CategoryColor = 'indigo';
  formIcon = 'briefcase-outline';
  isSubmitting = false;

  constructor(
    readonly categoryService: CategoryService,
    readonly taskService: TaskService,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router,
  ) {
    addIcons({
      addOutline,
      closeOutline,
      createOutline,
      trashOutline,
      checkmarkOutline,
      chevronBackOutline,
      listOutline,
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  getTaskCount(categoryId: string): number {
    return this.tasks().filter((t) => t.categoryId === categoryId).length;
  }

  openCreateModal(): void {
    this.editingCategory = null;
    this.formName = '';
    this.formColor = 'indigo';
    this.formIcon = 'briefcase-outline';
    this.categoryModal.present();
  }

  openEditModal(cat: Category): void {
    this.editingCategory = cat;
    this.formName = cat.name;
    this.formColor = cat.color;
    this.formIcon = cat.icon;
    this.categoryModal.present();
  }

  dismissModal(): void {
    this.categoryModal.dismiss();
  }

  async submitCategory(): Promise<void> {
    if (!this.formName.trim()) return;
    this.isSubmitting = true;

    try {
      if (this.editingCategory) {
        this.categoryService.update(this.editingCategory.id, {
          name: this.formName,
          color: this.formColor,
          icon: this.formIcon,
        });
        this.showToast('Categoría actualizada');
      } else {
        this.categoryService.create({
          name: this.formName,
          color: this.formColor,
          icon: this.formIcon,
        });
        this.showToast('Categoría creada');
      }
      await this.categoryModal.dismiss();
    } finally {
      this.isSubmitting = false;
    }
  }

  async confirmDelete(cat: Category): Promise<void> {
    const taskCount = this.getTaskCount(cat.id);
    const alert = await this.alertController.create({
      header: 'Eliminar categoría',
      message: taskCount > 0
        ? `Esta categoría tiene ${taskCount} tarea(s). ¿Deseas eliminarla? Las tareas quedarán sin categoría.`
        : '¿Estás seguro de que deseas eliminar esta categoría?',
      cssClass: 'custom-alert',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            // Unassign tasks from this category
            this.tasks()
              .filter((t) => t.categoryId === cat.id)
              .forEach((t) => this.taskService.update(t.id, { categoryId: null }));
            this.categoryService.delete(cat.id);
            this.showToast('Categoría eliminada');
          },
        },
      ],
    });
    await alert.present();
  }

  trackByCatId(_: number, cat: Category): string {
    return cat.id;
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      cssClass: 'custom-toast',
      color: 'primary',
    });
    await toast.present();
  }
}
