import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo, TodosResponse } from '@shared/models';
import { HttpClientService, PaginationOptions } from './http-client.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  constructor(private httpClient: HttpClientService) {}

  getAllTodos(options?: PaginationOptions): Observable<TodosResponse> {
    return this.httpClient.get<TodosResponse>('/todos', options);
  }

  getTodoById(id: number): Observable<Todo> {
    return this.httpClient.get<Todo>(`/todos/${id}`);
  }

  getTodosByUserId(userId: number, options?: PaginationOptions): Observable<TodosResponse> {
    return this.httpClient.get<TodosResponse>(`/todos/user/${userId}`, options);
  }

  getRandomTodos(length: number = 1): Observable<Todo | Todo[]> {
    return this.httpClient.get<Todo | Todo[]>(`/todos/random/${length}`);
  }

  addTodo(todo: Omit<Todo, 'id'>): Observable<Todo> {
    return this.httpClient.post<Todo>('/todos/add', todo);
  }

  updateTodo(id: number, todo: Partial<Todo>): Observable<Todo> {
    return this.httpClient.put<Todo>(`/todos/${id}`, todo);
  }

  deleteTodo(id: number): Observable<any> {
    return this.httpClient.delete(`/todos/${id}`);
  }
}
