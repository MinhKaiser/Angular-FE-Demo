import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Product } from '@shared/models';
import { ProductCardComponent } from './components/product-card.component';
import { ProductFilterComponent } from './components/product-filter.component';
import { ProductsStore, type ProductsStoreInstance } from './state/products.store';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, ProductFilterComponent],
  providers: [ProductsStore],
  template: `
    <section class="app-page products-page">
      <div class="app-shell">
        <div class="content-header">
          <div class="page-heading">
            <p class="page-heading__eyebrow">DummyJSON products</p>
            <h1>Products</h1>
            <p class="page-heading__meta">{{ store.total() }} items from the API</p>
          </div>

          <app-product-filter
            [categories]="store.categories()"
            [selectedCategory]="store.filters().category"
            [isLoading]="store.isLoading()"
            (search)="store.search($event)"
            (categoryChange)="store.filterByCategory($event)"
          />
        </div>

        <div *ngIf="store.errorMessage()" class="alert">
          {{ store.errorMessage() }}
        </div>

        <div *ngIf="store.isLoading()" class="spinner-wrap">
          <div class="spinner"></div>
        </div>

        <div *ngIf="!store.isLoading() && store.products().length > 0" class="products-grid">
          <app-product-card
            *ngFor="let product of store.products(); trackBy: trackByProductId"
            [product]="product"
          />
        </div>

        <div *ngIf="!store.isLoading() && store.products().length === 0" class="empty-state">
          <p><strong>No products found</strong></p>
          <p class="muted">Try another keyword or category.</p>
        </div>
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
