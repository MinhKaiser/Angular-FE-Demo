import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { Comment, Post } from '@shared/models';

@Component({
  selector: 'app-post-detail-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article *ngIf="post() as item" class="post-detail card">
      <div class="post-detail__tags">
        <span *ngFor="let tag of item.tags" class="chip">
          {{ tag }}
        </span>
      </div>

      <h1>{{ item.title }}</h1>
      <p class="post-detail__body">{{ item.body }}</p>

      <div class="post-detail__metrics">
        <span>{{ item.views }} views</span>
        <span>{{ item.reactions.likes }} likes</span>
        <span>{{ item.reactions.dislikes }} dislikes</span>
        <span>User {{ item.userId }}</span>
      </div>
    </article>

    <section class="comments">
      <h2>Comments</h2>
      <div class="comments__list">
        <article *ngFor="let comment of comments(); trackBy: trackByCommentId" class="comment-card card">
          <div class="comment-card__header">
            <p>{{ comment.user.fullName }}</p>
            <p class="muted">{{ comment.likes }} likes</p>
          </div>
          <p class="comment-card__body">{{ comment.body }}</p>
        </article>

        <div *ngIf="comments().length === 0" class="empty-state">
          No comments found.
        </div>
      </div>
    </section>
  `,
  styles: [`
    .post-detail {
      padding: 2rem;
    }

    .post-detail__tags,
    .post-detail__metrics {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .post-detail h1 {
      margin: 1rem 0 0;
      font-size: clamp(2rem, 4vw, 3rem);
      line-height: 1.08;
    }

    .post-detail__body {
      margin: 1.25rem 0 0;
      color: #334155;
      font-size: 1rem;
      line-height: 1.85;
    }

    .post-detail__metrics {
      margin-top: 2rem;
      padding-top: 1.25rem;
      border-top: 1px solid var(--app-border-soft);
      color: var(--app-text-muted);
      font-size: 0.9rem;
    }

    .comments {
      margin-top: 2rem;
    }

    .comments h2 {
      margin: 0;
      font-size: 1.25rem;
    }

    .comments__list {
      display: grid;
      gap: 0.75rem;
      margin-top: 1rem;
    }

    .comment-card {
      padding: 1.25rem;
    }

    .comment-card__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .comment-card__header p {
      margin: 0;
      font-weight: 800;
    }

    .comment-card__body {
      margin: 0.75rem 0 0;
      color: var(--app-text-muted);
      font-size: 0.94rem;
      line-height: 1.65;
    }

    @media (max-width: 560px) {
      .post-detail {
        padding: 1.25rem;
      }

      .comment-card__header {
        align-items: flex-start;
        flex-direction: column;
      }
    }
  `],
})
export class PostDetailViewComponent {
  readonly post = input.required<Post | null>();
  readonly comments = input.required<readonly Comment[]>();

  trackByCommentId(_index: number, comment: Comment): number {
    return comment.id;
  }
}
