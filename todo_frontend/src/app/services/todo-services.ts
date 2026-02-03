import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { TodoInterface, TodoPayload } from '../models/todo-interface';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoServices {
  
  private httpClient = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getTodos() {
    return this.httpClient.get<TodoInterface[]>(`${this.apiUrl}todos/`);
  }

  addTodo(todo: TodoPayload) {
    return this.httpClient.post<TodoInterface>(`${this.apiUrl}todos/`, todo);
  }

  updateTodo(id: number | string, todo: TodoPayload) {
    return this.httpClient.put<TodoInterface>(`${this.apiUrl}todos/${id}/`, todo);
  }

  deleteTodo(id: number | string) {
    return this.httpClient.delete(`${this.apiUrl}todos/${id}/`);
  }

  getTodoById(id: number | string) {
    return this.httpClient.get<TodoInterface>(`${this.apiUrl}todos/${id}/`);
  }
}
