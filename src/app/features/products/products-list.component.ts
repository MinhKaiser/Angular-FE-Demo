import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  EmptyStateComponent,
  LoadingStateComponent,
  PageActionsDirective,
  PageSectionHeaderComponent,
  StatusBannerComponent,
} from '@shared/components';
import { Product } from '@shared/models';
import { ProductCardComponent } from './components/product-card.component';
import { ProductFilterComponent } from './components/product-filter.component';
import { ProductsStore, type ProductsStoreInstance } from './state/products.store';

@Component({
  selector: 'app-products-list',
  imports: [
    CommonModule,
    ProductCardComponent,
    ProductFilterComponent,
    StatusBannerComponent,
    LoadingStateComponent,
    EmptyStateComponent,
    PageSectionHeaderComponent,
    PageActionsDirective,
  ],
  providers: [ProductsStore],
  template: `
    <section class="app-page products-page">
      <div class="app-shell">
        <app-page-section-header
          eyebrow="DummyJSON products"
          title="Products"
          [meta]="store.total() + ' items from the API, ready for search and category filtering.'"
          icon="inventory_2"
          [chipLabel]="store.total() + ' items'"
          chipVariant="info"
        >
          <app-product-filter
            page-actions
            [categories]="store.categories()"
            [selectedCategory]="store.filters().category"
            [searchTerm]="store.filters().searchTerm"
            [isLoading]="store.isLoading()"
            (search)="store.search($event)"
            (categoryChange)="store.filterByCategory($event)"
          />
        </app-page-section-header>

        @if (store.errorMessage()) {
          <app-status-banner
            tone="error"
            icon="error_outline"
            [message]="store.errorMessage()"
          />
        }

        @if (store.isLoading()) {
          <app-loading-state
            title="Loading products"
            message="Ignite UI catalog cards are being filled with the latest API results."
          />
        }

        @if (!store.isLoading() && store.products().length > 0) {
          <div class="products-grid">
            @for (product of store.products(); track product.id) {
              <app-product-card
                [product]="product"
              />
            }
          </div>
        }

        @if (!store.isLoading() && store.products().length === 0) {
          <app-empty-state
            title="No products found"
            description="Try another keyword or category to widen the catalog results."
            icon="inventory_2"
          />
        }
      </div>
    </section>
  `,
  styles: [`
    .products-page {
      --section-color: var(--app-primary);
      --section-color-dark: var(--app-primary-dark);
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.25rem;
    }
  `],
})
export class ProductsListComponent implements OnInit {
  protected readonly store: ProductsStoreInstance = inject(ProductsStore);

  ngOnInit(): void {
    this.store.loadInitialData();
  }

  trackByProductId(_index: number, product: Product): number {
    return product.id;
  }
}
