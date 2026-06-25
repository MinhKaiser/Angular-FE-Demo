import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  EmptyStateComponent,
  LoadingStateComponent,
  PageSectionHeaderComponent,
  StatusBannerComponent,
} from '@shared/components';
import { Post } from '@shared/models';
import { PostCardComponent } from './components/post-card.component';
import { PostFilterComponent } from './components/post-filter.component';
import { PostsStore, type PostsStoreInstance } from './state/posts.store';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [
    CommonModule,
    PostCardComponent,
    PostFilterComponent,
    StatusBannerComponent,
    LoadingStateComponent,
    EmptyStateComponent,
    PageSectionHeaderComponent,
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

        <app-status-banner
          *ngIf="store.errorMessage()"
          tone="error"
          icon="error_outline"
          [message]="store.errorMessage()"
        />

        <app-loading-state
          *ngIf="store.isLoading()"
          title="Loading posts"
          message="Fresh articles and tags are being prepared for the reading feed."
        />

        <div *ngIf="!store.isLoading() && store.posts().length > 0" class="post-list">
          <app-post-card
            *ngFor="let post of store.posts(); trackBy: trackByPostId"
            [post]="post"
          />
        </div>

        <app-empty-state
          *ngIf="!store.isLoading() && store.posts().length === 0"
          title="No posts found"
          description="Try another keyword or tag to bring more stories into the feed."
          icon="article"
        />
      </div>
    </section>
  `,
  styles: [`
    .posts-page {
      --section-color: var(--app-success);
      --section-color-dark: var(--app-success-dark);
    }

    .post-list {
      display: grid;
      gap: 1rem;
    }
  `],
})
export class PostsListComponent {
  protected readonly store: PostsStoreInstance = inject(PostsStore);

  trackByPostId(_index: number, post: Post): number {
    return post.id;
  }
}
