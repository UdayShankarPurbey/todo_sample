import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
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
export class Todo {
  todoServices = inject(TodoServices);
  isModalOpen = signal(false);
  isEditMode = signal(false);
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
    minLength(fieldPath.description, 5, { message: 'Description must be at least 5 characters' });
    maxLength(fieldPath.description, 200, {
      message: 'Description must be at most 200 characters',
    });
  });

  constructor() {
    effect((onCleanup) => {
      this.reloadTrigger();
      console.log('object', this.reloadTrigger());

      const sub = this.todoServices.getTodos().subscribe({
        next: (tasks: any) =>
          this.tasksList.set(tasks.map((task: any) => ({ ...task, loader: false }))),
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
    this.isModalOpen.set(true);
  }

  openEditModal(task: TodoInterface) {
    this.loginform.set({ ...task });
    this.tasksList().forEach((t) => {
      if (t._id === task._id) {
        t.loader = true;
      }
    });
    this.isModalOpen.set(true);
    this.isEditMode.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    const task = this.loginform();
    if (task._id) {
      this.tasksList().forEach((t) => {
        if (t._id === task._id) {
          t.loader = false;
        }
      });
    }
    this.loginform.set({ ...this.initialForm });
    this.isEditMode.set(false);
  }

  saveTask(event: Event) {
    event.preventDefault();
    submit(this.form, async () => {
      const credentials = this.loginform();
      try {
        if (this.isEditMode()) {
          if (!credentials._id) {
            throw new Error('Task ID is missing for update operation.');
          }
          await firstValueFrom(this.todoServices.updateTodo(credentials._id, { ...credentials }));
        } else {
          await firstValueFrom(this.todoServices.addTodo({ ...credentials }));
        }

        this.reloadTodos();
      } catch (error) {
        console.error('Error saving task:', error);
      }
    });
    this.closeModal();
  }

  async deleteTask(id: number | string) {
    this.tasksList().forEach((t) => {
      if (t._id == id) {
        t.loader = true;
      }
    });
    try {
      await firstValueFrom(this.todoServices.deleteTodo(id));
      this.reloadTodos();
    } catch (error) {
      console.error('Error deleting task:', error);
      this.tasksList().forEach((t) => {
        if (t._id == id) {
          t.loader = false;
        }
      });
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
