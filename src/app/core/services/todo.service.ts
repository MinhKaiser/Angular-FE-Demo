import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateTodoRequest,
  DeletedTodo,
  PaginationQuery,
  Todo,
  TodosResponse,
  UpdateTodoRequest,
} from '@shared/models';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly httpClient = inject(HttpClientService);

  getTodos(query?: PaginationQuery): Observable<TodosResponse> {
    return this.httpClient.get<TodosResponse>('/todos', query);
  }

  getTodo(id: number): Observable<Todo> {
    return this.httpClient.get<Todo>(`/todos/${id}`);
  }

  getTodosByUser(userId: number, query?: PaginationQuery): Observable<TodosResponse> {
    return this.httpClient.get<TodosResponse>(`/todos/user/${userId}`, query);
  }

  getRandomTodos(length: number = 1): Observable<Todo | Todo[]> {
    if (length <= 1) {
      return this.httpClient.get<Todo>('/todos/random');
    }

    return this.httpClient.get<Todo[]>(`/todos/random/${Math.min(length, 10)}`);
  }

  addTodo(todo: CreateTodoRequest): Observable<Todo> {
    return this.httpClient.post<Todo, CreateTodoRequest>('/todos/add', todo);
  }

  updateTodo(id: number, todo: UpdateTodoRequest): Observable<Todo> {
    return this.httpClient.patch<Todo, UpdateTodoRequest>(`/todos/${id}`, todo);
  }

  deleteTodo(id: number): Observable<DeletedTodo> {
    return this.httpClient.delete<DeletedTodo>(`/todos/${id}`);
  }
}
