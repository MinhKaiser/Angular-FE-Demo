import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PostDetailViewComponent } from './components/post-detail-view.component';
import { PostDetailStore, type PostDetailStoreInstance } from './state/post-detail.store';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, PostDetailViewComponent],
  providers: [PostDetailStore],
  template: `
    <section class="app-page post-detail-page">
      <div class="app-shell app-shell--compact">
        <a routerLink="/posts" class="back-link">
          Back to posts
        </a>

        <div *ngIf="store.errorMessage()" class="alert">
          {{ store.errorMessage() }}
        </div>

        <div *ngIf="store.isLoading()" class="spinner-wrap">
          <div class="spinner"></div>
        </div>

        <app-post-detail-view
          *ngIf="!store.isLoading() && store.post()"
          [post]="store.post()"
          [comments]="store.comments()"
        />
      </div>
    </section>
  `,
  styles: [`
    .post-detail-page {
      --section-color: var(--app-success);
      --section-color-dark: var(--app-success-dark);
    }
  `],
})
export class PostDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  protected readonly store: PostDetailStoreInstance = inject(PostDetailStore);

  ngOnInit(): void {
    this.store.loadPost(Number(this.route.snapshot.paramMap.get('id')));
  }
}
