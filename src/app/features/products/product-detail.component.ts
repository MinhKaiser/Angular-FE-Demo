import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductDetailViewComponent } from './components/product-detail-view.component';
import { ProductDetailStore } from './state/product-detail.store';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductDetailViewComponent],
  providers: [ProductDetailStore],
  template: `
    <section class="min-h-screen bg-slate-50">
      <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <a routerLink="/products" class="mb-6 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-800">
          Back to products
        </a>

        <div *ngIf="store.errorMessage()" class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {{ store.errorMessage() }}
        </div>

        <div *ngIf="store.isLoading()" class="flex min-h-64 items-center justify-center">
          <div class="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-700"></div>
        </div>

        <app-product-detail-view
          *ngIf="!store.isLoading() && store.product()"
          [product]="store.product()"
        />
      </div>
    </section>
  `,
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  protected readonly store = inject(ProductDetailStore);

  ngOnInit(): void {
    this.store.loadProduct(Number(this.route.snapshot.paramMap.get('id')));
  }
}
