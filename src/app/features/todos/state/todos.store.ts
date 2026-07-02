import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, catchError, exhaustMap, finalize, mergeMap, switchMap, tap } from 'rxjs';
import { AuthService, TodoService } from '@core/services';
import { Todo } from '@shared/models';

interface TodosState {
  todos: Todo[];
  isLoading: boolean;
  isSaving: boolean;
  errorMessage: string;
  updatingTodoIds: ReadonlySet<number>;
}

interface ToggleTodoCommand {
  todo: Todo;
  completed: boolean;
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
    completedCount: computed(() => todos().filter((todo) => todo.completed).length),
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

    const loadTodosRequest = rxMethod<void>(
      switchMap(() => {
        const user = authService.user();
        if (!user) {
          patchState(store, {
            todos: [],
            errorMessage: 'Please sign in to load todos.',
            isLoading: false,
          });
          return EMPTY;
        }

        patchState(store, { isLoading: true, errorMessage: '' });

        return todoService.getTodosByUser(user.id, { limit: 50, skip: 0 }).pipe(
          tap((response) => patchState(store, { todos: response.todos })),
          catchError(() => {
            patchState(store, {
              todos: [],
              errorMessage: 'Could not load todos from DummyJSON.',
            });
            return EMPTY;
          }),
          finalize(() => patchState(store, { isLoading: false })),
        );
      }),
    );

    const addTodoRequest = rxMethod<string>(
      exhaustMap((todoText) => {
        const user = authService.user();
        const normalizedTodo = todoText.trim();

        if (!user || !normalizedTodo) {
          return EMPTY;
        }

        patchState(store, { isSaving: true, errorMessage: '' });

        return todoService
          .addTodo({
            todo: normalizedTodo,
            completed: false,
            userId: user.id,
          })
          .pipe(
            tap((todo) => patchState(store, { todos: [todo, ...store.todos()] })),
            catchError(() => {
              patchState(store, { errorMessage: 'Could not create todo.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isSaving: false })),
          );
      }),
    );

    const toggleTodoRequest = rxMethod<ToggleTodoCommand>(
      mergeMap(({ todo, completed }) => {
        setUpdating(todo.id, true);
        patchState(store, { errorMessage: '' });

        return todoService.updateTodo(todo.id, { completed }).pipe(
          tap((updatedTodo) => {
            patchState(store, {
              todos: store.todos().map((item) => (item.id === todo.id ? updatedTodo : item)),
            });
          }),
          catchError(() => {
            patchState(store, { errorMessage: 'Could not update todo.' });
            return EMPTY;
          }),
          finalize(() => setUpdating(todo.id, false)),
        );
      }),
    );

    const deleteTodoRequest = rxMethod<Todo>(
      mergeMap((todo) => {
        setUpdating(todo.id, true);
        patchState(store, { errorMessage: '' });

        return todoService.deleteTodo(todo.id).pipe(
          tap(() => {
            patchState(store, {
              todos: store.todos().filter((item) => item.id !== todo.id),
            });
          }),
          catchError(() => {
            patchState(store, { errorMessage: 'Could not delete todo.' });
            return EMPTY;
          }),
          finalize(() => setUpdating(todo.id, false)),
        );
      }),
    );

    return {
      loadTodos(): void {
        loadTodosRequest();
      },
      addTodo(todoText: string): void {
        addTodoRequest(todoText);
      },
      toggleTodo(todo: Todo, completed: boolean): void {
        toggleTodoRequest({ todo, completed });
      },
      deleteTodo(todo: Todo): void {
        deleteTodoRequest(todo);
      },
      isUpdating(todoId: number): boolean {
        return store.updatingTodoIds().has(todoId);
      },
    };
  }),
);

export type TodosStoreInstance = InstanceType<typeof TodosStore>;
