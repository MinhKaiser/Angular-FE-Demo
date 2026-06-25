import { inject } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
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

export const PostsStore = signalStore(
  withState(initialState),
  withMethods((store, postService = inject(PostService)) => {
    const patchFilters = (filters: Partial<PostFilters>): void => {
      patchState(store, {
        filters: {
          ...store.filters(),
          ...filters,
        },
      });
    };

    const loadPosts = (): void => {
      const query = { limit: 20, skip: 0 };
      const filters = store.filters();
      const request = filters.searchTerm
        ? postService.searchPosts(filters.searchTerm, query)
        : filters.tag
          ? postService.getPostsByTag(filters.tag, query)
          : postService.getPosts(query);

      patchState(store, { isLoading: true, errorMessage: '' });

      request.pipe(
        catchError(() => {
          patchState(store, { errorMessage: 'Could not load posts from DummyJSON.' });
          return of<PostsResponse>({ posts: [], total: 0, skip: 0, limit: query.limit });
        }),
        finalize(() => patchState(store, { isLoading: false }))
      ).subscribe(response => {
        patchState(store, {
          posts: response.posts,
          total: response.total,
        });
      });
    };

    const loadTags = (): void => {
      postService.getPostTags().pipe(
        catchError(() => of([]))
      ).subscribe(tags => patchState(store, { tags }));
    };

    return {
      loadInitialData(): void {
        loadTags();
        loadPosts();
      },
      search(searchTerm: string): void {
        patchFilters({ searchTerm: searchTerm.trim() });
        loadPosts();
      },
      filterByTag(tag: string): void {
        patchFilters({ tag });
        loadPosts();
      },
      reload(): void {
        loadPosts();
      },
    };
  }),
  withHooks({
    onInit(store) {
      store.loadInitialData();
    },
  })
);

export type PostsStoreInstance = InstanceType<typeof PostsStore>;
