import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { LoadingStateComponent, PageBackLinkComponent, StatusBannerComponent } from '@shared/components';
import { ProductDetailViewComponent } from './components/product-detail-view.component';
import { ProductDetailStore, type ProductDetailStoreInstance } from './state/product-detail.store';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, ProductDetailViewComponent, PageBackLinkComponent, StatusBannerComponent, LoadingStateComponent],
  providers: [ProductDetailStore],
  template: `
    <section class="app-page product-detail-page">
      <div class="app-shell">
        <app-page-back-link to="/products" label="Back to products" />

        <app-status-banner
          *ngIf="store.errorMessage()"
          tone="error"
          icon="error_outline"
          [message]="store.errorMessage()"
        />

        <app-loading-state
          *ngIf="store.isLoading()"
          title="Loading product detail"
          message="Gathering pricing, stock and rating data for this product."
        />

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
export class ProductDetailComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly store: ProductDetailStoreInstance = inject(ProductDetailStore);
  private readonly routeParamMap = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });

  constructor() {
    effect(() => {
      this.store.loadProduct(Number(this.routeParamMap().get('id')));
    });
  }
}
