import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { TodoFormInterface, TodoInterface } from '../../models/todo-interface';
import { CommonModule } from '@angular/common';
import { form, FormField, maxLength, minLength, required, submit } from '@angular/forms/signals';
import { TodoServices } from '../../services/todo-services';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-todo',
  imports: [CommonModule, FormField],
  templateUrl: './todo.html',
  styleUrl: './todo.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoComponent {
  todoServices = inject(TodoServices);

  isModalOpen = signal(false);
  isEditMode = signal(false);
  isSaving = signal(false);

  tasksList = signal<(TodoInterface & { loader: boolean })[]>([]);
  reloadTrigger = signal(0);

  private readonly initialForm: TodoFormInterface = {
    _id: undefined,
    title: '',
    description: '',
    completed: false,
    createdAt: new Date(),
  };

  loginform = signal<TodoFormInterface>({ ...this.initialForm });

  form = form(this.loginform, (fieldPath) => {
    required(fieldPath.title, { message: 'Title is required' });
    minLength(fieldPath.title, 3, { message: 'Title must be at least 3 characters' });

    required(fieldPath.description, { message: 'Description is required' });
    minLength(fieldPath.description, 5, {
      message: 'Description must be at least 5 characters',
    });
    maxLength(fieldPath.description, 200, {
      message: 'Description must be at most 200 characters',
    });
  });

  constructor() {
    effect((onCleanup) => {
      this.reloadTrigger();

      const sub = this.todoServices.getTodos().subscribe({
        next: (tasks: TodoInterface[]) =>
          this.tasksList.set(tasks.map((task) => ({ ...task, loader: false }))),
        error: (err) => console.error('Error fetching tasks', err),
      });

      onCleanup(() => sub.unsubscribe());
    });
  }

  reloadTodos() {
    this.reloadTrigger.update((v) => v + 1);
  }

  openAddModal() {
    this.loginform.set({ ...this.initialForm });
    this.isEditMode.set(false);
    this.isModalOpen.set(true);
  }

  openEditModal(task: TodoInterface & { loader: boolean }) {
    task.loader = true;
    this.loginform.set({ ...task });
    this.isEditMode.set(true);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);

    const task = this.loginform();
    if (task._id) {
      this.tasksList().forEach((t) => {
        if (t._id === task._id) t.loader = false;
      });
    }

    this.loginform.set({ ...this.initialForm });
    this.isEditMode.set(false);
  }

  async saveTask(event: Event) {
    event.preventDefault();

    submit(this.form, async () => {
      const data = this.loginform();
      this.isSaving.set(true);

      try {
        if (this.isEditMode()) {
          await firstValueFrom(this.todoServices.updateTodo(data._id!, { ...data }));
        } else {
          await firstValueFrom(this.todoServices.addTodo({ ...data }));
        }

        this.reloadTodos();
        this.closeModal();
      } catch (error) {
        console.error('Error saving task:', error);
      } finally {
        this.isSaving.set(false);
      }
    });
  }

  async deleteTask(id: number | string) {
    this.tasksList().forEach((t) => {
      if (t._id == id) t.loader = true;
    });

    try {
      await firstValueFrom(this.todoServices.deleteTodo(id));
      this.reloadTodos();
    } catch (error) {
      console.error('Error deleting task:', error);
      this.tasksList().forEach((t) => {
        if (t._id == id) t.loader = false;
      });
    }
  }

  async toggleComplete(task: TodoInterface & { loader: boolean }) {
    // Set loader immutably
    this.tasksList.update((tasks) =>
      tasks.map((t) => (t._id === task._id ? { ...t, loader: true } : t)),
    );

    try {
      await firstValueFrom(
        this.todoServices.updateTodo(task._id, {
          ...task,
          completed: !task.completed,
        }),
      );

      // Update completed and loader immutably
      this.tasksList.update((tasks) =>
        tasks.map((t) =>
          t._id === task._id ? { ...t, completed: !t.completed, loader: false } : t,
        ),
      );
    } catch (error) {
      console.error('Error updating completion:', error);

      // Turn off loader on error
      this.tasksList.update((tasks) =>
        tasks.map((t) => (t._id === task._id ? { ...t, loader: false } : t)),
      );
    }
  }

  getTimeAgo(date: Date | undefined): string {
    if (!date) return '';

    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (minutes < 60) return `Created ${minutes} minutes ago`;
    if (hours < 24) return `Created ${hours} hours ago`;
    return `Created ${Math.floor(hours / 24)} days ago`;
  }
}
