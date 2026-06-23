import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { AuthService, PostService, ProductService, TodoService } from '@core/services';

export interface DashboardStats {
  products: number;
  posts: number;
  todos: number;
}

interface DashboardState {
  stats: DashboardStats;
  isLoading: boolean;
  errorMessage: string;
}

const initialState: DashboardState = {
  stats: {
    products: 0,
    posts: 0,
    todos: 0,
  },
  isLoading: false,
  errorMessage: '',
};

@Injectable()
export class DashboardStore {
  private readonly authService = inject(AuthService);
  private readonly productService = inject(ProductService);
  private readonly postService = inject(PostService);
  private readonly todoService = inject(TodoService);
  private readonly state = signal<DashboardState>(initialState);

  readonly displayName = this.authService.displayName;
  readonly userId = computed(() => this.authService.user()?.id ?? 0);
  readonly stats = computed(() => this.state().stats);
  readonly isLoading = computed(() => this.state().isLoading);
  readonly errorMessage = computed(() => this.state().errorMessage);

  loadStatistics(): void {
    const user = this.authService.user();
    if (!user) return;

    this.patchState({ isLoading: true, errorMessage: '' });

    forkJoin({
      products: this.productService.getProducts({ limit: 1, skip: 0 }),
      posts: this.postService.getPosts({ limit: 1, skip: 0 }),
      todos: this.todoService.getTodosByUser(user.id, { limit: 1, skip: 0 }),
    }).pipe(
      catchError(() => {
        this.patchState({ errorMessage: 'Could not load dashboard statistics.' });
        return of(null);
      }),
      finalize(() => this.patchState({ isLoading: false }))
    ).subscribe(result => {
      if (!result) return;

      this.patchState({
        stats: {
          products: result.products.total,
          posts: result.posts.total,
          todos: result.todos.total,
        },
      });
    });
  }

  private patchState(statePatch: Partial<DashboardState>): void {
    this.state.update(state => ({
      ...state,
      ...statePatch,
    }));
  }
}
