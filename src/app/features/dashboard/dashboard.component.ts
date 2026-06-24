import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardStatCardComponent } from './components/dashboard-stat-card.component';
import { DashboardStore, type DashboardStoreInstance } from './state/dashboard.store';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DashboardStatCardComponent],
  providers: [DashboardStore],
  template: `
    <section class="app-page dashboard-page">
      <div class="app-shell">
        <div class="page-heading">
          <p class="page-heading__eyebrow">Training workspace</p>
          <h1>Welcome back, {{ store.displayName() }}</h1>
          <p class="page-heading__meta">Products, posts, and personal todos are ready.</p>
        </div>

        <div *ngIf="store.errorMessage()" class="alert">
          {{ store.errorMessage() }}
        </div>

        <div class="stats-grid">
          <app-dashboard-stat-card label="Products" [value]="store.stats().products" code="PR" tone="blue" />
          <app-dashboard-stat-card label="Posts" [value]="store.stats().posts" code="PO" tone="emerald" />
          <app-dashboard-stat-card label="My todos" [value]="store.stats().todos" code="TD" tone="violet" />
          <app-dashboard-stat-card label="User ID" [value]="store.userId()" code="US" tone="amber" />
        </div>

        <div *ngIf="store.isLoading()" class="dashboard-loading">Loading dashboard data...</div>

        <div class="quick-links">
          <a routerLink="/products" class="quick-link card">
            <h2>Browse products</h2>
            <p>Catalog items, ratings, prices, stock, and product details.</p>
          </a>

          <a routerLink="/posts" class="quick-link card">
            <h2>Read posts</h2>
            <p>Articles, tags, engagement numbers, and reader comments.</p>
          </a>

          <a routerLink="/todos" class="quick-link card">
            <h2>Manage todos</h2>
            <p>Personal tasks tied to the signed-in DummyJSON user.</p>
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .stats-grid,
    .quick-links {
      display: grid;
      gap: 1.25rem;
    }

    .stats-grid {
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    }

    .dashboard-loading {
      margin-top: 1.5rem;
      color: var(--app-text-muted);
      font-size: 0.9rem;
    }

    .quick-links {
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      margin-top: 2.5rem;
    }

    .quick-link {
      padding: 1.5rem;
      transition:
        transform 0.16s ease,
        box-shadow 0.16s ease;
    }

    .quick-link:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 24px rgb(15 23 42 / 10%);
    }

    .quick-link h2 {
      margin: 0;
      font-size: 1.15rem;
    }

    .quick-link p {
      margin: 0.5rem 0 0;
      color: var(--app-text-muted);
      font-size: 0.94rem;
      line-height: 1.65;
    }
  `],
})
export class DashboardComponent implements OnInit {
  protected readonly store: DashboardStoreInstance = inject(DashboardStore);

  ngOnInit(): void {
    this.store.loadStatistics();
  }
}
