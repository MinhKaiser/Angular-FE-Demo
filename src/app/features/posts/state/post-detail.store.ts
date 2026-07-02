import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, catchError, finalize, forkJoin, switchMap, tap } from 'rxjs';
import { PostService } from '@core/services';
import { Comment, Post } from '@shared/models';

interface PostDetailState {
  post: Post | null;
  comments: Comment[];
  isLoading: boolean;
  errorMessage: string;
}

const initialState: PostDetailState = {
  post: null,
  comments: [],
  isLoading: false,
  errorMessage: '',
};

export const PostDetailStore = signalStore(
  withState(initialState),
  withMethods((store, postService = inject(PostService)) => {
    let currentPostId: number | null = null;

    const loadPostRequest = rxMethod<number>(
      switchMap((postId) => {
        patchState(store, {
          post: null,
          comments: [],
          isLoading: true,
          errorMessage: '',
        });

        return forkJoin({
          post: postService.getPost(postId),
          comments: postService.getPostComments(postId),
        }).pipe(
          tap((result) => {
            patchState(store, {
              post: result.post,
              comments: result.comments.comments,
            });
          }),
          catchError(() => {
            patchState(store, { errorMessage: 'Could not load post details.' });
            return EMPTY;
          }),
          finalize(() => patchState(store, { isLoading: false })),
        );
      }),
    );

    return {
      loadPost(postId: number): void {
        if (!Number.isInteger(postId) || postId <= 0) {
          currentPostId = null;
          patchState(store, {
            post: null,
            comments: [],
            isLoading: false,
            errorMessage: 'Invalid post id.',
          });
          return;
        }

        currentPostId = postId;
        loadPostRequest(postId);
      },
      reload(): void {
        if (currentPostId !== null) {
          loadPostRequest(currentPostId);
        }
      },
    };
  }),
);

export type PostDetailStoreInstance = InstanceType<typeof PostDetailStore>;
