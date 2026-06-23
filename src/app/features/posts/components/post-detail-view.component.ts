import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { Comment, Post } from '@shared/models';

@Component({
  selector: 'app-post-detail-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article *ngIf="post() as item" class="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
      <div class="mb-4 flex flex-wrap gap-2">
        <span *ngFor="let tag of item.tags" class="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
          {{ tag }}
        </span>
      </div>

      <h1 class="text-3xl font-bold text-slate-950">{{ item.title }}</h1>
      <p class="mt-5 text-base leading-8 text-slate-700">{{ item.body }}</p>

      <div class="mt-8 flex flex-wrap gap-4 border-t border-slate-100 pt-5 text-sm text-slate-500">
        <span>{{ item.views }} views</span>
        <span>{{ item.reactions.likes }} likes</span>
        <span>{{ item.reactions.dislikes }} dislikes</span>
        <span>User {{ item.userId }}</span>
      </div>
    </article>

    <section class="mt-8">
      <h2 class="text-xl font-semibold text-slate-950">Comments</h2>
      <div class="mt-4 space-y-3">
        <article *ngFor="let comment of comments(); trackBy: trackByCommentId" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <p class="font-semibold text-slate-950">{{ comment.user.fullName }}</p>
            <p class="text-xs text-slate-500">{{ comment.likes }} likes</p>
          </div>
          <p class="mt-3 text-sm leading-6 text-slate-600">{{ comment.body }}</p>
        </article>

        <div *ngIf="comments().length === 0" class="rounded-lg border border-dashed border-slate-300 bg-white py-10 text-center text-sm text-slate-500">
          No comments found.
        </div>
      </div>
    </section>
  `,
})
export class PostDetailViewComponent {
  readonly post = input.required<Post | null>();
  readonly comments = input.required<readonly Comment[]>();

  trackByCommentId(_index: number, comment: Comment): number {
    return comment.id;
  }
}
