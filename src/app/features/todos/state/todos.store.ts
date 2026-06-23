import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, of } from 'rxjs';
import { AuthService, TodoService } from '@core/services';
import { Todo, TodosResponse } from '@shared/models';

interface TodosState {
  todos: Todo[];
  isLoading: boolean;
  isSaving: boolean;
  errorMessage: string;
  updatingTodoIds: ReadonlySet<number>;
}

const initialState: TodosState = {
  todos: [],
  isLoading: false,
  isSaving: false,
  errorMessage: '',
  updatingTodoIds: new Set(),
};

@Injectable()
export class TodosStore {
  private readonly todoService = inject(TodoService);
  private readonly authService = inject(AuthService);
  private readonly state = signal<TodosState>(initialState);

  readonly todos = computed(() => this.state().todos);
  readonly isLoading = computed(() => this.state().isLoading);
  readonly isSaving = computed(() => this.state().isSaving);
  readonly errorMessage = computed(() => this.state().errorMessage);
  readonly completedCount = computed(() => this.todos().filter(todo => todo.completed).length);

  loadTodos(): void {
    const user = this.authService.user();
    if (!user) {
      this.patchState({
        errorMessage: 'Please sign in to load todos.',
        isLoading: false,
      });
      return;
    }

    this.patchState({ isLoading: true, errorMessage: '' });

    this.todoService.getTodosByUser(user.id, { limit: 50, skip: 0 }).pipe(
      catchError(() => {
        this.patchState({ errorMessage: 'Could not load todos from DummyJSON.' });
        return of<TodosResponse>({ todos: [], total: 0, skip: 0, limit: 50 });
      }),
      finalize(() => this.patchState({ isLoading: false }))
    ).subscribe(response => this.patchState({ todos: response.todos }));
  }

  addTodo(todoText: string): void {
    const user = this.authService.user();
    const normalizedTodo = todoText.trim();

    if (!user || !normalizedTodo) {
      return;
    }

    this.patchState({ isSaving: true, errorMessage: '' });

    this.todoService.addTodo({
      todo: normalizedTodo,
      completed: false,
      userId: user.id,
    }).pipe(
      catchError(() => {
        this.patchState({ errorMessage: 'Could not create todo.' });
        return of(null);
      }),
      finalize(() => this.patchState({ isSaving: false }))
    ).subscribe(todo => {
      if (!todo) return;

      this.patchState({ todos: [todo, ...this.state().todos] });
    });
  }

  toggleTodo(todo: Todo, completed: boolean): void {
    this.setUpdating(todo.id, true);
    this.patchState({ errorMessage: '' });

    this.todoService.updateTodo(todo.id, { completed }).pipe(
      catchError(() => {
        this.patchState({ errorMessage: 'Could not update todo.' });
        return of({ ...todo, completed: todo.completed });
      }),
      finalize(() => this.setUpdating(todo.id, false))
    ).subscribe(updatedTodo => {
      this.patchState({
        todos: this.state().todos.map(item => item.id === todo.id ? updatedTodo : item),
      });
    });
  }

  deleteTodo(todo: Todo): void {
    this.setUpdating(todo.id, true);
    this.patchState({ errorMessage: '' });

    this.todoService.deleteTodo(todo.id).pipe(
      catchError(() => {
        this.patchState({ errorMessage: 'Could not delete todo.' });
        return of(null);
      }),
      finalize(() => this.setUpdating(todo.id, false))
    ).subscribe(response => {
      if (!response) return;

      this.patchState({
        todos: this.state().todos.filter(item => item.id !== todo.id),
      });
    });
  }

  isUpdating(todoId: number): boolean {
    return this.state().updatingTodoIds.has(todoId);
  }

  private setUpdating(todoId: number, isUpdating: boolean): void {
    const nextUpdatingIds = new Set(this.state().updatingTodoIds);
    if (isUpdating) {
      nextUpdatingIds.add(todoId);
    } else {
      nextUpdatingIds.delete(todoId);
    }

    this.patchState({ updatingTodoIds: nextUpdatingIds });
  }

  private patchState(statePatch: Partial<TodosState>): void {
    this.state.update(state => ({
      ...state,
      ...statePatch,
    }));
  }
}
