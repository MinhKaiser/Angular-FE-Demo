import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IgxButtonDirective, IgxToggleActionDirective } from 'igniteui-angular/directives';
import { IgxDropDownModule } from 'igniteui-angular/drop-down';
import { IgxGridModule } from 'igniteui-angular/grids/grid';
import { IgxIconModule } from 'igniteui-angular/icon';
import { IgxProgressBarModule } from 'igniteui-angular/progressbar';
import { IgxSelectModule } from 'igniteui-angular/select';
import { IgxSimpleComboModule } from 'igniteui-angular/simple-combo';
import { IgxSliderModule } from 'igniteui-angular/slider';
import type { Product } from '@shared/models';
import { DashboardStatCardComponent } from './components/dashboard-stat-card.component';
import { DashboardStore, type DashboardStoreInstance } from './state/dashboard.store';

type WorkspaceMode = 'overview' | 'catalog' | 'ops';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    DashboardStatCardComponent,
    IgxButtonDirective,
    IgxToggleActionDirective,
    IgxSelectModule,
    IgxSimpleComboModule,
    IgxDropDownModule,
    IgxSliderModule,
    IgxGridModule,
    IgxIconModule,
    IgxProgressBarModule,
  ],
  providers: [DashboardStore],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  protected readonly store: DashboardStoreInstance = inject(DashboardStore);

  protected readonly workspaceModes = [
    { id: 'overview', label: 'Overview' },
    { id: 'catalog', label: 'Catalog focus' },
    { id: 'ops', label: 'Ops mode' },
  ] as const;

  protected readonly channelOptions: Array<{ id: string; label: string }> = [
    { id: 'products', label: 'Products stream' },
    { id: 'posts', label: 'Posts stream' },
    { id: 'todos', label: 'Todos stream' },
  ];

  protected readonly quickActions = [
    {
      icon: 'filter_alt',
      label: 'Refine inventory',
      description: 'Use category and stock filters to narrow the live product grid.',
    },
    {
      icon: 'view_kanban',
      label: 'Switch workspace',
      description: 'Flip between overview, catalog and ops context from the Ignite select.',
    },
    {
      icon: 'insights',
      label: 'Read the visuals',
      description: 'Circular and linear progress visuals summarize current dashboard counts.',
    },
  ] as const;

  protected readonly workspaceMode = signal<WorkspaceMode>('overview');
  protected readonly selectedCategory = signal<string>('all');
  protected readonly channel = signal<string>('products');
  protected readonly stockThreshold = signal<number>(25);

  protected readonly filteredProducts = computed(() =>
    this.store
      .featuredProducts()
      .filter(
        (product: Product) =>
          this.selectedCategory() === 'all' || product.category === this.selectedCategory(),
      )
      .filter((product: Product) => product.stock >= this.stockThreshold())
      .map((product: Product) => ({
        id: product.id,
        title: product.title,
        category: product.category,
        brand: product.brand ?? 'Generic',
        price: Number(product.price.toFixed(2)),
        rating: Number(product.rating.toFixed(1)),
        stock: product.stock,
      })),
  );

  protected readonly maxStatValue = computed(() => {
    const stats = this.store.stats();
    return Math.max(stats.products, stats.posts, stats.todos, 1);
  });

  protected readonly catalogCoverage = computed(() => {
    const visible = this.filteredProducts().length;
    const total = this.store.featuredProducts().length || 1;
    return Math.round((visible / total) * 100);
  });

  protected readonly stockReadiness = computed(() => {
    const items = this.store.featuredProducts();
    if (!items.length) {
      return 0;
    }

    const averageStock =
      items.reduce((sum: number, item: Product) => sum + item.stock, 0) / items.length;
    return Math.min(100, Math.round(averageStock));
  });

  protected activeModeLabel(): string {
    return (
      this.workspaceModes.find((mode) => mode.id === this.workspaceMode())?.label ?? 'Overview'
    );
  }

  ngOnInit(): void {
    this.store.loadStatistics();
  }
}
