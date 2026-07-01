import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { Comment, Post } from '@shared/models';
import { IgxAvatarModule } from 'igniteui-angular/avatar';
import { IgxCardModule } from 'igniteui-angular/card';
import { IgxChipsModule } from 'igniteui-angular/chips';
import { IgxIconModule } from 'igniteui-angular/icon';

@Component({
  selector: 'app-post-detail-view',
  imports: [CommonModule, IgxAvatarModule, IgxCardModule, IgxChipsModule, IgxIconModule],
  template: `
    @if (post(); as item) {
      <igx-card elevated="true" class="post-detail">
        <div class="post-detail__tags">
          @for (tag of item.tags; track tag) {
            <igx-chip variant="success">
              {{ tag }}
            </igx-chip>
          }
        </div>

        <h1>{{ item.title }}</h1>
        <p class="post-detail__body">{{ item.body }}</p>

        <div class="post-detail__metrics">
          <span><igx-icon>visibility</igx-icon>{{ item.views }} views</span>
          <span><igx-icon>thumb_up</igx-icon>{{ item.reactions.likes }} likes</span>
          <span><igx-icon>thumb_down</igx-icon>{{ item.reactions.dislikes }} dislikes</span>
          <span><igx-icon>person</igx-icon>User {{ item.userId }}</span>
        </div>
      </igx-card>
    }

    <section class="comments">
      <h2>Comments</h2>

      <div class="comments__list">
        @for (comment of comments(); track comment.id) {
          <igx-card elevated="true" class="comment-card">
            <div class="comment-card__header">
              <div class="comment-card__author">
                <igx-avatar
                  [initials]="comment.user.fullName.slice(0, 2).toUpperCase()"
                  shape="circle"
                  size="small"
                >
                </igx-avatar>

                <p>{{ comment.user.fullName }}</p>
              </div>

              <p class="muted">{{ comment.likes }} likes</p>
            </div>

            <p class="comment-card__body">{{ comment.body }}</p>
          </igx-card>
        }

        @if (comments().length === 0) {
          <div class="empty-state">
            No comments found.
          </div>
        }
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

    .post-detail__metrics span {
      display: inline-flex;
      gap: 0.35rem;
      align-items: center;
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

    .comment-card__author {
      display: flex;
      gap: 0.75rem;
      align-items: center;
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

      .post-detail__metrics {
        display: grid;
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
}
