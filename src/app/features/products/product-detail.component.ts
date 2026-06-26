import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoadingStateComponent, PageBackLinkComponent, StatusBannerComponent } from '@shared/components';
import { ProductDetailViewComponent } from './components/product-detail-view.component';
import { ProductDetailStore, type ProductDetailStoreInstance } from './state/product-detail.store';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, ProductDetailViewComponent, PageBackLinkComponent, StatusBannerComponent, LoadingStateComponent],
  providers: [ProductDetailStore],
  template: `
    <section class="app-page product-detail-page">
      <div class="app-shell">
        <app-page-back-link to="/products" label="Back to products" />

        @if (store.errorMessage()) {
          <app-status-banner
            tone="error"
            icon="error_outline"
            [message]="store.errorMessage()"
          />
        }

        @if (store.isLoading()) {
          <app-loading-state
            title="Loading product detail"
            message="Gathering pricing, stock and rating data for this product."
          />
        }

        @if (!store.isLoading() && store.product()) {
          <app-product-detail-view
            [product]="store.product()!"
          />
        }
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
export class ProductDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  protected readonly store: ProductDetailStoreInstance = inject(ProductDetailStore);
  private readonly subscriptions = new Subscription();

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.paramMap.subscribe(paramMap => {
        this.store.loadProduct(Number(paramMap.get('id')));
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
