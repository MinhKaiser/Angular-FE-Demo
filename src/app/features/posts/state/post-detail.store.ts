import { computed, inject, Injectable, signal } from '@angular/core';
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

@Injectable()
export class PostDetailStore {
  private readonly postService = inject(PostService);
  private readonly state = signal<PostDetailState>(initialState);

  readonly post = computed(() => this.state().post);
  readonly comments = computed(() => this.state().comments);
  readonly isLoading = computed(() => this.state().isLoading);
  readonly errorMessage = computed(() => this.state().errorMessage);

  loadPost(postId: number): void {
    if (!Number.isInteger(postId) || postId <= 0) {
      this.patchState({
        isLoading: false,
        errorMessage: 'Invalid post id.',
      });
      return;
    }

    this.patchState({ isLoading: true, errorMessage: '' });

    forkJoin({
      post: this.postService.getPost(postId),
      comments: this.postService.getPostComments(postId),
    }).pipe(
      catchError(() => {
        this.patchState({ errorMessage: 'Could not load post details.' });
        return of(null);
      }),
      finalize(() => this.patchState({ isLoading: false }))
    ).subscribe(result => {
      if (!result) return;

      this.patchState({
        post: result.post,
        comments: result.comments.comments,
      });
    });
  }

  private patchState(statePatch: Partial<PostDetailState>): void {
    this.state.update(state => ({
      ...state,
      ...statePatch,
    }));
  }
}
