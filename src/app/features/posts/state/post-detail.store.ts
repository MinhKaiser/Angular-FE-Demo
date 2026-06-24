import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { catchError, finalize, forkJoin, of } from 'rxjs';
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
  withMethods((store, postService = inject(PostService)) => ({
    loadPost(postId: number): void {
      if (!Number.isInteger(postId) || postId <= 0) {
        patchState(store, {
          isLoading: false,
          errorMessage: 'Invalid post id.',
        });
        return;
      }

      patchState(store, { isLoading: true, errorMessage: '' });

      forkJoin({
        post: postService.getPost(postId),
        comments: postService.getPostComments(postId),
      }).pipe(
        catchError(() => {
          patchState(store, { errorMessage: 'Could not load post details.' });
          return of(null);
        }),
        finalize(() => patchState(store, { isLoading: false }))
      ).subscribe(result => {
        if (!result) return;

        patchState(store, {
          post: result.post,
          comments: result.comments.comments,
        });
      });
    },
  }))
);

export type PostDetailStoreInstance = InstanceType<typeof PostDetailStore>;
