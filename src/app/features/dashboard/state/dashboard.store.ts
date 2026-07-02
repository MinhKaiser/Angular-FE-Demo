import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, catchError, finalize, forkJoin, switchMap, tap } from 'rxjs';
import { AuthService, PostService, ProductService, TodoService } from '@core/services';
import type { Product } from '@shared/models';

export interface DashboardStats {
  products: number;
  posts: number;
  todos: number;
}

interface DashboardState {
  stats: DashboardStats;
  featuredProducts: Product[];
  categories: string[];
  isLoading: boolean;
  errorMessage: string;
}

const initialState: DashboardState = {
  stats: {
    products: 0,
    posts: 0,
    todos: 0,
  },
  featuredProducts: [],
  categories: [],
  isLoading: false,
  errorMessage: '',
};

export const DashboardStore = signalStore(
  withState(initialState),
  withComputed((_store, authService = inject(AuthService)) => ({
    displayName: authService.displayName,
    userId: computed(() => authService.user()?.id ?? 0),
  })),
  withMethods(
    (
      store,
      authService = inject(AuthService),
      productService = inject(ProductService),
      postService = inject(PostService),
      todoService = inject(TodoService),
    ) => {
      const loadStatisticsRequest = rxMethod<void>(
        switchMap(() => {
          const user = authService.user();
          if (!user) {
            patchState(store, { errorMessage: 'Please sign in to load the dashboard.' });
            return EMPTY;
          }

          patchState(store, { isLoading: true, errorMessage: '' });

          return forkJoin({
            products: productService.getProducts({ limit: 6, skip: 0 }),
            posts: postService.getPosts({ limit: 1, skip: 0 }),
            todos: todoService.getTodosByUser(user.id, { limit: 1, skip: 0 }),
            categories: productService.getCategoryList(),
          }).pipe(
            tap((result) => {
              patchState(store, {
                stats: {
                  products: result.products.total,
                  posts: result.posts.total,
                  todos: result.todos.total,
                },
                featuredProducts: result.products.products,
                categories: result.categories,
              });
            }),
            catchError(() => {
              patchState(store, { errorMessage: 'Could not load dashboard statistics.' });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isLoading: false })),
          );
        }),
      );

      return {
        loadStatistics(): void {
          loadStatisticsRequest();
        },
      };
    },
  ),
);

export type DashboardStoreInstance = InstanceType<typeof DashboardStore>;
