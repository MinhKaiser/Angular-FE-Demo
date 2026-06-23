import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardStatCardComponent } from './components/dashboard-stat-card.component';
import { DashboardStore } from './state/dashboard.store';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DashboardStatCardComponent],
  providers: [DashboardStore],
  template: `
    <section class="min-h-screen bg-slate-50">
      <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div class="mb-10">
          <p class="text-sm font-medium uppercase tracking-wide text-slate-500">Training workspace</p>
          <h1 class="mt-1 text-3xl font-bold text-slate-950">Welcome back, {{ store.displayName() }}</h1>
          <p class="mt-2 text-sm text-slate-600">Products, posts, and personal todos are ready.</p>
        </div>

        <div *ngIf="store.errorMessage()" class="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {{ store.errorMessage() }}
        </div>

        <div class="grid grid-cols-1 gap-5 md:grid-cols-4">
          <app-dashboard-stat-card label="Products" [value]="store.stats().products" code="PR" tone="blue" />
          <app-dashboard-stat-card label="Posts" [value]="store.stats().posts" code="PO" tone="emerald" />
          <app-dashboard-stat-card label="My todos" [value]="store.stats().todos" code="TD" tone="violet" />
          <app-dashboard-stat-card label="User ID" [value]="store.userId()" code="US" tone="amber" />
        </div>

        <div *ngIf="store.isLoading()" class="mt-6 text-sm text-slate-500">Loading dashboard data...</div>

        <div class="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          <a routerLink="/products" class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <h2 class="text-lg font-semibold text-slate-950">Browse products</h2>
            <p class="mt-2 text-sm leading-6 text-slate-600">Catalog items, ratings, prices, stock, and product details.</p>
          </a>

          <a routerLink="/posts" class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <h2 class="text-lg font-semibold text-slate-950">Read posts</h2>
            <p class="mt-2 text-sm leading-6 text-slate-600">Articles, tags, engagement numbers, and reader comments.</p>
          </a>

          <a routerLink="/todos" class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <h2 class="text-lg font-semibold text-slate-950">Manage todos</h2>
            <p class="mt-2 text-sm leading-6 text-slate-600">Personal tasks tied to the signed-in DummyJSON user.</p>
          </a>
        </div>
      </div>
    </section>
  `,
})
export class DashboardComponent implements OnInit {
  protected readonly store = inject(DashboardStore);

  ngOnInit(): void {
    this.store.loadStatistics();
  }
}
