import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Post } from '@shared/models';
import { TruncatePipe } from '@shared/pipes';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, RouterLink, TruncatePipe],
  template: `
    <article class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div class="mb-3 flex flex-wrap gap-2">
        <span *ngFor="let tag of post().tags" class="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
          {{ tag }}
        </span>
      </div>

      <h2 class="text-xl font-semibold text-slate-950">{{ post().title }}</h2>
      <p class="mt-2 text-sm leading-6 text-slate-600">{{ post().body | appTruncate: 220 }}</p>

      <div class="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex gap-4 text-sm text-slate-500">
          <span>{{ post().views }} views</span>
          <span>{{ post().reactions.likes }} likes</span>
          <span>{{ post().reactions.dislikes }} dislikes</span>
        </div>

        <a
          [routerLink]="['/posts', post().id]"
          class="inline-flex items-center justify-center rounded-md border border-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
        >
          Read more
        </a>
      </div>
    </article>
  `,
})
export class PostCardComponent {
  readonly post = input.required<Post>();
}
