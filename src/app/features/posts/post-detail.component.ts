import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PostDetailViewComponent } from './components/post-detail-view.component';
import { PostDetailStore } from './state/post-detail.store';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, PostDetailViewComponent],
  providers: [PostDetailStore],
  template: `
    <section class="min-h-screen bg-slate-50">
      <div class="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <a routerLink="/posts" class="mb-6 inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800">
          Back to posts
        </a>

        <div *ngIf="store.errorMessage()" class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {{ store.errorMessage() }}
        </div>

        <div *ngIf="store.isLoading()" class="flex min-h-64 items-center justify-center">
          <div class="h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-700"></div>
        </div>

        <app-post-detail-view
          *ngIf="!store.isLoading() && store.post()"
          [post]="store.post()"
          [comments]="store.comments()"
        />
      </div>
    </section>
  `,
})
export class PostDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  protected readonly store = inject(PostDetailStore);

  ngOnInit(): void {
    this.store.loadPost(Number(this.route.snapshot.paramMap.get('id')));
  }
}
