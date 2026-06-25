import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { LoadingStateComponent, PageBackLinkComponent, StatusBannerComponent } from '@shared/components';
import { PostDetailViewComponent } from './components/post-detail-view.component';
import { PostDetailStore, type PostDetailStoreInstance } from './state/post-detail.store';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, PostDetailViewComponent, PageBackLinkComponent, StatusBannerComponent, LoadingStateComponent],
  providers: [PostDetailStore],
  template: `
    <section class="app-page post-detail-page">
      <div class="app-shell app-shell--compact">
        <app-page-back-link to="/posts" label="Back to posts" />

        <app-status-banner
          *ngIf="store.errorMessage()"
          tone="error"
          icon="error_outline"
          [message]="store.errorMessage()"
        />

        <app-loading-state
          *ngIf="store.isLoading()"
          title="Loading post detail"
          message="Fetching the article body and comment thread for this story."
        />

        <app-post-detail-view
          *ngIf="!store.isLoading() && store.post()"
          [post]="store.post()"
          [comments]="store.comments()"
        />
      </div>
    </section>
  `,
  styles: [`
    .post-detail-page {
      --section-color: var(--app-success);
      --section-color-dark: var(--app-success-dark);
    }
  `],
})
export class PostDetailComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly store: PostDetailStoreInstance = inject(PostDetailStore);
  private readonly routeParamMap = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });

  constructor() {
    effect(() => {
      this.store.loadPost(Number(this.routeParamMap().get('id')));
    });
  }
}
