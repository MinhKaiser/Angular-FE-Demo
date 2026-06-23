import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Post } from '@shared/models';
import { PostCardComponent } from './components/post-card.component';
import { PostFilterComponent } from './components/post-filter.component';
import { PostsStore } from './state/posts.store';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [CommonModule, PostCardComponent, PostFilterComponent],
  providers: [PostsStore],
  template: `
    <section class="min-h-screen bg-slate-50">
      <div class="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div class="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-sm font-medium uppercase tracking-wide text-emerald-700">DummyJSON posts</p>
            <h1 class="mt-1 text-3xl font-bold text-slate-950">Posts</h1>
            <p class="mt-2 text-sm text-slate-600">{{ store.total() }} posts available</p>
          </div>

          <app-post-filter
            [tags]="store.tags()"
            [selectedTag]="store.filters().tag"
            [isLoading]="store.isLoading()"
            (search)="store.search($event)"
            (tagChange)="store.filterByTag($event)"
          />
        </div>

        <div *ngIf="store.errorMessage()" class="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {{ store.errorMessage() }}
        </div>

        <div *ngIf="store.isLoading()" class="flex min-h-64 items-center justify-center">
          <div class="h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-700"></div>
        </div>

        <div *ngIf="!store.isLoading() && store.posts().length > 0" class="space-y-4">
          <app-post-card
            *ngFor="let post of store.posts(); trackBy: trackByPostId"
            [post]="post"
          />
        </div>

        <div *ngIf="!store.isLoading() && store.posts().length === 0" class="rounded-lg border border-dashed border-slate-300 bg-white py-16 text-center">
          <p class="font-medium text-slate-900">No posts found</p>
          <p class="mt-1 text-sm text-slate-500">Try another keyword or tag.</p>
        </div>
      </div>
    </section>
  `,
})
export class PostsListComponent implements OnInit {
  protected readonly store = inject(PostsStore);

  ngOnInit(): void {
    this.store.loadInitialData();
  }

  trackByPostId(_index: number, post: Post): number {
    return post.id;
  }
}
