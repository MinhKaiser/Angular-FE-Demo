import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Post } from '@shared/models';
import { TruncatePipe } from '@shared/pipes';
import { IgxAvatarModule } from 'igniteui-angular/avatar';
import { IgxCardModule } from 'igniteui-angular/card';
import { IgxChipsModule } from 'igniteui-angular/chips';
import { IgxButtonDirective } from 'igniteui-angular/directives';
import { IgxIconModule } from 'igniteui-angular/icon';

@Component({
  selector: 'app-post-card',
  imports: [
    CommonModule,
    RouterLink,
    TruncatePipe,
    IgxAvatarModule,
    IgxCardModule,
    IgxChipsModule,
    IgxButtonDirective,
    IgxIconModule,
  ],
  template: `
    <igx-card
      elevated="true"
      class="post-card"
      tabindex="0"
      role="link"
      [routerLink]="detailsLink()"
      (keydown.space)="onSpaceKeydown($event)"
    >
      <igx-card-header>
        <igx-avatar
          initials="PO"
          shape="circle"
          size="medium"
          [bgColor]="'#e8f8f1'"
          [color]="'#0f8a5f'"
        >
        </igx-avatar>

        <div igxCardHeaderTitle>{{ post().title }}</div>
        <div igxCardHeaderSubtitle>User {{ post().userId }}</div>
      </igx-card-header>

      <igx-card-content>
        <div class="post-card__tags">
          @for (tag of post().tags; track tag) {
            <igx-chip variant="success">
              {{ tag }}
            </igx-chip>
          }
        </div>

        <p class="post-card__body">
          {{ post().body | appTruncate: 220 }}
        </p>

        <div class="post-card__metrics">
          <span><igx-icon>visibility</igx-icon>{{ post().views }}</span>
          <span><igx-icon>thumb_up</igx-icon>{{ post().reactions.likes }}</span>
          <span><igx-icon>thumb_down</igx-icon>{{ post().reactions.dislikes }}</span>
        </div>
      </igx-card-content>

      <igx-card-actions>
        <button
          type="button"
          igxButton="contained"
          class="post-card__link"
          [routerLink]="detailsLink()"
          (click)="$event.stopPropagation()"
        >
          <igx-icon>article</igx-icon>
          Read more
        </button>
      </igx-card-actions>
    </igx-card>
  `,
  styles: [`
    .post-card {
      cursor: pointer;
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

    .post-card__body {
      margin: 1rem 0 0;
      color: var(--app-text-muted);
      font-size: 0.94rem;
      line-height: 1.65;
    }

    .post-card__metrics {
      margin-top: 1.25rem;
      color: var(--app-text-muted);
      font-size: 0.9rem;
    }

    .post-card__metrics span,
    .post-card__link {
      display: inline-flex;
      gap: 0.35rem;
      align-items: center;
    }

    @media (max-width: 640px) {
      .post-card__metrics {
        display: grid;
      }
    }
  `],
})
export class PostCardComponent {
  readonly post = input.required<Post>();
  readonly detailsLink = computed(() => ['/posts', this.post().id]);

  onSpaceKeydown(event: KeyboardEvent): void {
    event.preventDefault();
    (event.currentTarget as HTMLElement | null)?.click();
  }
}
