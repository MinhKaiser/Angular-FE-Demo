import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { catchError, finalize, forkJoin, of } from 'rxjs';
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
  withComputed((_store: unknown, authService = inject(AuthService)) => ({
    displayName: authService.displayName,
    userId: computed(() => authService.user()?.id ?? 0),
  })),
  withMethods((
    store: any,
    authService = inject(AuthService),
    productService = inject(ProductService),
    postService = inject(PostService),
    todoService = inject(TodoService)
  ) => ({
    loadStatistics(): void {
      const user = authService.user();
      if (!user) return;

      patchState(store, { isLoading: true, errorMessage: '' });

      forkJoin({
        products: productService.getProducts({ limit: 6, skip: 0 }),
        posts: postService.getPosts({ limit: 1, skip: 0 }),
        todos: todoService.getTodosByUser(user.id, { limit: 1, skip: 0 }),
        categories: productService.getCategoryList(),
      }).pipe(
        catchError(() => {
          patchState(store, { errorMessage: 'Could not load dashboard statistics.' });
          return of(null);
        }),
        finalize(() => patchState(store, { isLoading: false }))
      ).subscribe(result => {
        if (!result) return;

        patchState(store, {
          stats: {
            products: result.products.total,
            posts: result.posts.total,
            todos: result.todos.total,
          },
          featuredProducts: result.products.products,
          categories: result.categories,
        });
      });
    },
  })),
  withHooks({
    onInit(store) {
      store.loadStatistics();
    },
  })
);

export type DashboardStoreInstance = InstanceType<typeof DashboardStore>;
