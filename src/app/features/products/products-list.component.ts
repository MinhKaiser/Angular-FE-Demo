import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Product } from '@shared/models';
import { ProductCardComponent } from './components/product-card.component';
import { ProductFilterComponent } from './components/product-filter.component';
import { ProductsStore } from './state/products.store';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, ProductFilterComponent],
  providers: [ProductsStore],
  template: `
    <section class="min-h-screen bg-slate-50">
      <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div class="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-sm font-medium uppercase tracking-wide text-blue-700">DummyJSON products</p>
            <h1 class="mt-1 text-3xl font-bold text-slate-950">Products</h1>
            <p class="mt-2 text-sm text-slate-600">{{ store.total() }} items from the API</p>
          </div>

          <app-product-filter
            [categories]="store.categories()"
            [selectedCategory]="store.filters().category"
            [isLoading]="store.isLoading()"
            (search)="store.search($event)"
            (categoryChange)="store.filterByCategory($event)"
          />
        </div>

        <div *ngIf="store.errorMessage()" class="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {{ store.errorMessage() }}
        </div>

        <div *ngIf="store.isLoading()" class="flex min-h-64 items-center justify-center">
          <div class="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-700"></div>
        </div>

        <div *ngIf="!store.isLoading() && store.products().length > 0" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <app-product-card
            *ngFor="let product of store.products(); trackBy: trackByProductId"
            [product]="product"
          />
        </div>

        <div *ngIf="!store.isLoading() && store.products().length === 0" class="rounded-lg border border-dashed border-slate-300 bg-white py-16 text-center">
          <p class="font-medium text-slate-900">No products found</p>
          <p class="mt-1 text-sm text-slate-500">Try another keyword or category.</p>
        </div>
      </div>
    </section>
  `,
})
export class ProductsListComponent implements OnInit {
  protected readonly store = inject(ProductsStore);

  ngOnInit(): void {
    this.store.loadInitialData();
  }

  trackByProductId(_index: number, product: Product): number {
    return product.id;
  }
}
