import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, of } from 'rxjs';
import { PostService } from '@core/services';
import { Post, PostsResponse, PostTag } from '@shared/models';

interface PostFilters {
  searchTerm: string;
  tag: string;
}

interface PostsState {
  posts: Post[];
  tags: PostTag[];
  total: number;
  filters: PostFilters;
  isLoading: boolean;
  errorMessage: string;
}

const initialState: PostsState = {
  posts: [],
  tags: [],
  total: 0,
  filters: {
    searchTerm: '',
    tag: '',
  },
  isLoading: false,
  errorMessage: '',
};

@Injectable()
export class PostsStore {
  private readonly postService = inject(PostService);
  private readonly state = signal<PostsState>(initialState);

  readonly posts = computed(() => this.state().posts);
  readonly tags = computed(() => this.state().tags);
  readonly total = computed(() => this.state().total);
  readonly filters = computed(() => this.state().filters);
  readonly isLoading = computed(() => this.state().isLoading);
  readonly errorMessage = computed(() => this.state().errorMessage);

  loadInitialData(): void {
    this.loadTags();
    this.loadPosts();
  }

  search(searchTerm: string): void {
    this.patchFilters({ searchTerm: searchTerm.trim() });
    this.loadPosts();
  }

  filterByTag(tag: string): void {
    this.patchFilters({ tag });
    this.loadPosts();
  }

  reload(): void {
    this.loadPosts();
  }

  private loadPosts(): void {
    const query = { limit: 20, skip: 0 };
    const filters = this.state().filters;
    const request = filters.searchTerm
      ? this.postService.searchPosts(filters.searchTerm, query)
      : filters.tag
        ? this.postService.getPostsByTag(filters.tag, query)
        : this.postService.getPosts(query);

    this.patchState({ isLoading: true, errorMessage: '' });

    request.pipe(
      catchError(() => {
        this.patchState({ errorMessage: 'Could not load posts from DummyJSON.' });
        return of<PostsResponse>({ posts: [], total: 0, skip: 0, limit: query.limit });
      }),
      finalize(() => this.patchState({ isLoading: false }))
    ).subscribe(response => {
      this.patchState({
        posts: response.posts,
        total: response.total,
      });
    });
  }

  private loadTags(): void {
    this.postService.getPostTags().pipe(
      catchError(() => of([]))
    ).subscribe(tags => this.patchState({ tags }));
  }

  private patchFilters(filters: Partial<PostFilters>): void {
    this.state.update(state => ({
      ...state,
      filters: {
        ...state.filters,
        ...filters,
      },
    }));
  }

  private patchState(statePatch: Partial<PostsState>): void {
    this.state.update(state => ({
      ...state,
      ...statePatch,
    }));
  }
}
