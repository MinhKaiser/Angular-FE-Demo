import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductDetailViewComponent } from './components/product-detail-view.component';
import { ProductDetailStore, type ProductDetailStoreInstance } from './state/product-detail.store';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductDetailViewComponent],
  providers: [ProductDetailStore],
  template: `
    <section class="app-page product-detail-page">
      <div class="app-shell">
        <a routerLink="/products" class="back-link">
          Back to products
        </a>

        <div *ngIf="store.errorMessage()" class="alert">
          {{ store.errorMessage() }}
        </div>

        <div *ngIf="store.isLoading()" class="spinner-wrap">
          <div class="spinner"></div>
        </div>

        <app-product-detail-view
          *ngIf="!store.isLoading() && store.product()"
          [product]="store.product()"
        />
      </div>
    </section>
  `,
  styles: [`
    .product-detail-page {
      --section-color: var(--app-primary);
      --section-color-dark: var(--app-primary-dark);
    }
  `],
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  protected readonly store: ProductDetailStoreInstance = inject(ProductDetailStore);

  ngOnInit(): void {
    this.store.loadProduct(Number(this.route.snapshot.paramMap.get('id')));
  }
}
