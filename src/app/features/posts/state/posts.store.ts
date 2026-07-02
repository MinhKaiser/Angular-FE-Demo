import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, catchError, exhaustMap, finalize, switchMap, tap } from 'rxjs';
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

    const loadPosts = rxMethod<void>(
      switchMap(() => {
        const query = { limit: 20, skip: 0 };
        const filters = store.filters();
        const request = filters.searchTerm
          ? postService.searchPosts(filters.searchTerm, query)
          : filters.tag
            ? postService.getPostsByTag(filters.tag, query)
            : postService.getPosts(query);

        patchState(store, { isLoading: true, errorMessage: '' });

        return request.pipe(
          tap((response: PostsResponse) => {
            patchState(store, {
              posts: response.posts,
              total: response.total,
            });
          }),
          catchError(() => {
            patchState(store, {
              posts: [],
              total: 0,
              errorMessage: 'Could not load posts from DummyJSON.',
            });
            return EMPTY;
          }),
          finalize(() => patchState(store, { isLoading: false })),
        );
      }),
    );

    const loadTags = rxMethod<void>(
      exhaustMap(() =>
        postService.getPostTags().pipe(
          tap((tags) => patchState(store, { tags })),
          catchError(() => EMPTY),
        ),
      ),
    );

    return {
      loadInitialData(): void {
        loadTags();
        loadPosts();
      },
      search(searchTerm: string): void {
        patchFilters({ searchTerm: searchTerm.trim(), tag: '' });
        loadPosts();
      },
      filterByTag(tag: string): void {
        patchFilters({ tag, searchTerm: '' });
        loadPosts();
      },
      reload(): void {
        loadPosts();
      },
    };
  }),
);

export type PostsStoreInstance = InstanceType<typeof PostsStore>;
