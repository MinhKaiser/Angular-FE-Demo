import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  LoadingStateComponent,
  PageBackLinkComponent,
  StatusBannerComponent,
} from '@shared/components';
import { PostDetailViewComponent } from './components/post-detail-view.component';
import { PostDetailStore, type PostDetailStoreInstance } from './state/post-detail.store';

@Component({
  selector: 'app-post-detail',
  imports: [
    CommonModule,
    PostDetailViewComponent,
    PageBackLinkComponent,
    StatusBannerComponent,
    LoadingStateComponent,
  ],
  providers: [PostDetailStore],
  template: `
    <section class="app-page post-detail-page">
      <div class="app-shell app-shell--compact">
        <app-page-back-link to="/posts" label="Back to posts" />

        @if (store.errorMessage()) {
          <app-status-banner tone="error" icon="error_outline" [message]="store.errorMessage()">
            <button
              type="button"
              class="outline-button"
              (click)="store.reload()"
              [disabled]="store.isLoading()"
            >
              Try again
            </button>
          </app-status-banner>
        }

        @if (store.isLoading()) {
          <app-loading-state
            title="Loading post detail"
            message="Fetching the article body and comment thread for this story."
          />
        }

        @if (!store.isLoading() && store.post()) {
          <app-post-detail-view [post]="store.post()" [comments]="store.comments()" />
        }
      </div>
    </section>
  `,
  styles: [
    `
      .post-detail-page {
        --section-color: var(--app-success);
        --section-color-dark: var(--app-success-dark);
      }
    `,
  ],
})
export class PostDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly store: PostDetailStoreInstance = inject(PostDetailStore);

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((paramMap) => {
      this.store.loadPost(Number(paramMap.get('id')));
    });
  }
}
