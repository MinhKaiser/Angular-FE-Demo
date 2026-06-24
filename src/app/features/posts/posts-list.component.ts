import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Post } from '@shared/models';
import { PostCardComponent } from './components/post-card.component';
import { PostFilterComponent } from './components/post-filter.component';
import { PostsStore, type PostsStoreInstance } from './state/posts.store';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [CommonModule, PostCardComponent, PostFilterComponent],
  providers: [PostsStore],
  template: `
    <section class="app-page posts-page">
      <div class="app-shell app-shell--narrow">
        <div class="content-header">
          <div class="page-heading">
            <p class="page-heading__eyebrow">DummyJSON posts</p>
            <h1>Posts</h1>
            <p class="page-heading__meta">{{ store.total() }} posts available</p>
          </div>

          <app-post-filter
            [tags]="store.tags()"
            [selectedTag]="store.filters().tag"
            [isLoading]="store.isLoading()"
            (search)="store.search($event)"
            (tagChange)="store.filterByTag($event)"
          />
        </div>

        <div *ngIf="store.errorMessage()" class="alert">
          {{ store.errorMessage() }}
        </div>

        <div *ngIf="store.isLoading()" class="spinner-wrap">
          <div class="spinner"></div>
        </div>

        <div *ngIf="!store.isLoading() && store.posts().length > 0" class="post-list">
          <app-post-card
            *ngFor="let post of store.posts(); trackBy: trackByPostId"
            [post]="post"
          />
        </div>

        <div *ngIf="!store.isLoading() && store.posts().length === 0" class="empty-state">
          <p><strong>No posts found</strong></p>
          <p class="muted">Try another keyword or tag.</p>
        </div>
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
export class PostsListComponent implements OnInit {
  protected readonly store: PostsStoreInstance = inject(PostsStore);

  ngOnInit(): void {
    this.store.loadInitialData();
  }

  trackByPostId(_index: number, post: Post): number {
    return post.id;
  }
}
