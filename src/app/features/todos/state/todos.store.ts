import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
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

export const TodosStore = signalStore(
  withState(initialState),
  withComputed(({ todos }) => ({
    completedCount: computed(() => todos().filter(todo => todo.completed).length),
  })),
  withMethods((store, todoService = inject(TodoService), authService = inject(AuthService)) => {
    const setUpdating = (todoId: number, isUpdating: boolean): void => {
      const nextUpdatingIds = new Set(store.updatingTodoIds());
      if (isUpdating) {
        nextUpdatingIds.add(todoId);
      } else {
        nextUpdatingIds.delete(todoId);
      }

      patchState(store, { updatingTodoIds: nextUpdatingIds });
    };

    return {
      loadTodos(): void {
        const user = authService.user();
        if (!user) {
          patchState(store, {
            errorMessage: 'Please sign in to load todos.',
            isLoading: false,
          });
          return;
        }

        patchState(store, { isLoading: true, errorMessage: '' });

        todoService.getTodosByUser(user.id, { limit: 50, skip: 0 }).pipe(
          catchError(() => {
            patchState(store, { errorMessage: 'Could not load todos from DummyJSON.' });
            return of<TodosResponse>({ todos: [], total: 0, skip: 0, limit: 50 });
          }),
          finalize(() => patchState(store, { isLoading: false }))
        ).subscribe(response => patchState(store, { todos: response.todos }));
      },
      addTodo(todoText: string): void {
        const user = authService.user();
        const normalizedTodo = todoText.trim();

        if (!user || !normalizedTodo) {
          return;
        }

        patchState(store, { isSaving: true, errorMessage: '' });

        todoService.addTodo({
          todo: normalizedTodo,
          completed: false,
          userId: user.id,
        }).pipe(
          catchError(() => {
            patchState(store, { errorMessage: 'Could not create todo.' });
            return of(null);
          }),
          finalize(() => patchState(store, { isSaving: false }))
        ).subscribe(todo => {
          if (!todo) return;

          patchState(store, { todos: [todo, ...store.todos()] });
        });
      },
      toggleTodo(todo: Todo, completed: boolean): void {
        setUpdating(todo.id, true);
        patchState(store, { errorMessage: '' });

        todoService.updateTodo(todo.id, { completed }).pipe(
          catchError(() => {
            patchState(store, { errorMessage: 'Could not update todo.' });
            return of({ ...todo, completed: todo.completed });
          }),
          finalize(() => setUpdating(todo.id, false))
        ).subscribe(updatedTodo => {
          patchState(store, {
            todos: store.todos().map(item => item.id === todo.id ? updatedTodo : item),
          });
        });
      },
      deleteTodo(todo: Todo): void {
        setUpdating(todo.id, true);
        patchState(store, { errorMessage: '' });

        todoService.deleteTodo(todo.id).pipe(
          catchError(() => {
            patchState(store, { errorMessage: 'Could not delete todo.' });
            return of(null);
          }),
          finalize(() => setUpdating(todo.id, false))
        ).subscribe(response => {
          if (!response) return;

          patchState(store, {
            todos: store.todos().filter(item => item.id !== todo.id),
          });
        });
      },
      isUpdating(todoId: number): boolean {
        return store.updatingTodoIds().has(todoId);
      },
    };
  })
);

export type TodosStoreInstance = InstanceType<typeof TodosStore>;
