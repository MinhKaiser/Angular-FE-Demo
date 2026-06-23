import { DeletedResource, PaginatedResponse } from './api.model';

export interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

export interface TodosResponse extends PaginatedResponse {
  todos: Todo[];
}

export interface CreateTodoRequest {
  todo: string;
  completed: boolean;
  userId: number;
}

export type UpdateTodoRequest = Partial<Pick<Todo, 'todo' | 'completed'>>;

export type DeletedTodo = Todo & DeletedResource;
