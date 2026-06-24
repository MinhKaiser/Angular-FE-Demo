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
    <article class="post-card card">
      <div class="post-card__tags">
        <span *ngFor="let tag of post().tags" class="chip">
          {{ tag }}
        </span>
      </div>

      <h2>{{ post().title }}</h2>
      <p class="post-card__body">{{ post().body | appTruncate: 220 }}</p>

      <div class="post-card__footer">
        <div class="post-card__metrics">
          <span>{{ post().views }} views</span>
          <span>{{ post().reactions.likes }} likes</span>
          <span>{{ post().reactions.dislikes }} dislikes</span>
        </div>

        <a
          [routerLink]="['/posts', post().id]"
          class="action-link"
        >
          Read more
        </a>
      </div>
    </article>
  `,
  styles: [`
    .post-card {
      padding: 1.5rem;
      transition: box-shadow 0.16s ease;
    }

    .post-card:hover {
      box-shadow: 0 10px 24px rgb(15 23 42 / 10%);
    }

    .post-card__tags,
    .post-card__metrics {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .post-card h2 {
      margin: 0.75rem 0 0;
      font-size: 1.25rem;
    }

    .post-card__body {
      margin: 0.5rem 0 0;
      color: var(--app-text-muted);
      font-size: 0.94rem;
      line-height: 1.65;
    }

    .post-card__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-top: 1.25rem;
      padding-top: 1rem;
      border-top: 1px solid var(--app-border-soft);
    }

    .post-card__metrics {
      color: var(--app-text-muted);
      font-size: 0.9rem;
    }

    @media (max-width: 640px) {
      .post-card__footer {
        align-items: flex-start;
        flex-direction: column;
      }
    }
  `],
})
export class PostCardComponent {
  readonly post = input.required<Post>();
}
