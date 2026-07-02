import { Component, OnInit, inject } from '@angular/core';
import {
  EmptyStateComponent,
  LoadingStateComponent,
  PageActionsDirective,
  PageSectionHeaderComponent,
  StatusBannerComponent,
} from '@shared/components';
import { PostCardComponent } from './components/post-card.component';
import { PostFilterComponent } from './components/post-filter.component';
import { PostsStore, type PostsStoreInstance } from './state/posts.store';

@Component({
  selector: 'app-posts-list',
  imports: [
    PostCardComponent,
    PostFilterComponent,
    StatusBannerComponent,
    LoadingStateComponent,
    EmptyStateComponent,
    PageSectionHeaderComponent,
    PageActionsDirective,
  ],
  providers: [PostsStore],
  template: `
    <section class="app-page posts-page">
      <div class="app-shell app-shell--narrow">
        <app-page-section-header
          eyebrow="DummyJSON posts"
          title="Posts"
          [meta]="store.total() + ' posts available with tag filtering and reading cards.'"
          icon="article"
          [chipLabel]="store.total() + ' posts'"
          chipVariant="success"
        >
          <app-post-filter
            page-actions
            [tags]="store.tags()"
            [selectedTag]="store.filters().tag"
            [searchTerm]="store.filters().searchTerm"
            [isLoading]="store.isLoading()"
            (search)="store.search($event)"
            (tagChange)="store.filterByTag($event)"
          />
        </app-page-section-header>

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
            title="Loading posts"
            message="Fresh articles and tags are being prepared for the reading feed."
          />
        }

        @if (!store.isLoading() && store.posts().length > 0) {
          <div class="post-list">
            @for (post of store.posts(); track post.id) {
              <app-post-card [post]="post" />
            }
          </div>
        }

        @if (!store.isLoading() && !store.errorMessage() && store.posts().length === 0) {
          <app-empty-state
            title="No posts found"
            description="Try another keyword or tag to bring more stories into the feed."
            icon="article"
          />
        }
      </div>
    </section>
  `,
  styles: [
    `
      .posts-page {
        --section-color: var(--app-success);
        --section-color-dark: var(--app-success-dark);
      }

      .post-list {
        display: grid;
        gap: 1rem;
      }
    `,
  ],
})
export class PostsListComponent implements OnInit {
  protected readonly store: PostsStoreInstance = inject(PostsStore);

  ngOnInit(): void {
    this.store.loadInitialData();
  }
}
