import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  EmptyStateComponent,
  LoadingStateComponent,
  PageSectionHeaderComponent,
  StatusBannerComponent,
} from '@shared/components';
import { Product } from '@shared/models';
import { ProductCardComponent } from './components/product-card.component';
import { ProductFilterComponent } from './components/product-filter.component';
import { ProductsStore, type ProductsStoreInstance } from './state/products.store';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    CommonModule,
    ProductCardComponent,
    ProductFilterComponent,
    StatusBannerComponent,
    LoadingStateComponent,
    EmptyStateComponent,
    PageSectionHeaderComponent,
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

        <app-status-banner
          *ngIf="store.errorMessage()"
          tone="error"
          icon="error_outline"
          [message]="store.errorMessage()"
        />

        <app-loading-state
          *ngIf="store.isLoading()"
          title="Loading products"
          message="Ignite UI catalog cards are being filled with the latest API results."
        />

        <div *ngIf="!store.isLoading() && store.products().length > 0" class="products-grid">
          <app-product-card
            *ngFor="let product of store.products(); trackBy: trackByProductId"
            [product]="product"
          />
        </div>

        <app-empty-state
          *ngIf="!store.isLoading() && store.products().length === 0"
          title="No products found"
          description="Try another keyword or category to widen the catalog results."
          icon="inventory_2"
        />
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
export class ProductsListComponent {
  protected readonly store: ProductsStoreInstance = inject(ProductsStore);

  trackByProductId(_index: number, product: Product): number {
    return product.id;
  }
}
