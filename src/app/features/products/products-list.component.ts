import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  EmptyStateComponent,
  LoadingStateComponent,
  PageActionsDirective,
  PageSectionHeaderComponent,
  StatusBannerComponent,
} from '@shared/components';
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
          <app-status-banner tone="error" icon="error_outline" [message]="store.errorMessage()">
            <button
              type="button"
              class="outline-button"
              (click)="store.reload()"
              [disabled]="store.isLoading()"
            >
              Try again
            </button>
          </app-status-banner>
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
              <app-product-card [product]="product" />
            }
          </div>

          @if (store.totalPages() > 1) {
            <nav class="products-pagination" aria-label="Products pagination">
              <p class="products-pagination__summary">
                {{ store.paginationLabel() }}
              </p>

              <div class="products-pagination__controls">
                <button
                  type="button"
                  class="products-pagination__button"
                  (click)="store.previousPage()"
                  [disabled]="!store.canGoToPreviousPage() || store.isLoading()"
                >
                  Previous
                </button>

                @for (item of store.paginationItems(); track trackPaginationItem(item)) {
                  @if (item.kind === 'page') {
                    <button
                      type="button"
                      class="products-pagination__button"
                      [class.products-pagination__button--active]="
                        item.value === store.currentPage()
                      "
                      [attr.aria-current]="item.value === store.currentPage() ? 'page' : null"
                      (click)="store.goToPage(item.value)"
                      [disabled]="store.isLoading()"
                    >
                      {{ item.value }}
                    </button>
                  } @else {
                    <span class="products-pagination__ellipsis" aria-hidden="true"> ... </span>
                  }
                }

                <button
                  type="button"
                  class="products-pagination__button"
                  (click)="store.nextPage()"
                  [disabled]="!store.canGoToNextPage() || store.isLoading()"
                >
                  Next
                </button>
              </div>
            </nav>
          }
        }

        @if (!store.isLoading() && !store.errorMessage() && store.products().length === 0) {
          <app-empty-state
            title="No products found"
            description="Try another keyword or category to widen the catalog results."
            icon="inventory_2"
          />
        }
      </div>
    </section>
  `,
  styles: [
    `
      .products-page {
        --section-color: var(--app-primary);
        --section-color-dark: var(--app-primary-dark);
      }

      .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
        gap: 1.25rem;
      }

      .products-pagination {
        display: flex;
        gap: 1rem;
        align-items: center;
        justify-content: space-between;
        margin-top: 1.5rem;
        padding: 1rem 1.1rem;
        border: 1px solid #dce6f1;
        border-radius: 20px;
        background: linear-gradient(180deg, #fff 0%, #f8fbff 100%);
      }

      .products-pagination__summary {
        margin: 0;
        color: var(--app-text-muted);
        font-size: 0.95rem;
      }

      .products-pagination__controls {
        display: flex;
        gap: 0.55rem;
        flex-wrap: wrap;
        justify-content: flex-end;
        align-items: center;
      }

      .products-pagination__button {
        min-width: 2.75rem;
        padding: 0.65rem 0.9rem;
        border: 1px solid #c7d7ea;
        border-radius: 999px;
        background: #fff;
        color: var(--app-text);
        font: inherit;
        font-weight: 600;
        cursor: pointer;
        transition:
          background-color 120ms ease,
          border-color 120ms ease,
          color 120ms ease;
      }

      .products-pagination__button:hover:not(:disabled) {
        border-color: var(--app-primary);
        color: var(--app-primary-dark);
        background: #eef5ff;
      }

      .products-pagination__button--active {
        border-color: var(--app-primary);
        background: var(--app-primary);
        color: #fff;
      }

      .products-pagination__button:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }

      .products-pagination__ellipsis {
        display: inline-flex;
        min-width: 2rem;
        align-items: center;
        justify-content: center;
        color: var(--app-text-muted);
        font-weight: 700;
        letter-spacing: 0.08em;
      }

      @media (max-width: 760px) {
        .products-pagination {
          flex-direction: column;
          align-items: stretch;
        }

        .products-pagination__controls {
          justify-content: flex-start;
        }
      }

      @media (max-width: 560px) {
        .products-grid {
          gap: 1rem;
        }

        .products-pagination {
          padding: 0.9rem;
          border-radius: 16px;
        }

        .products-pagination__summary {
          font-size: 0.88rem;
        }

        .products-pagination__controls {
          flex-wrap: nowrap;
          overflow-x: auto;
          padding-bottom: 0.15rem;
        }

        .products-pagination__button,
        .products-pagination__ellipsis {
          flex: 0 0 auto;
        }
      }
    `,
  ],
})
export class ProductsListComponent implements OnInit {
  protected readonly store: ProductsStoreInstance = inject(ProductsStore);

  ngOnInit(): void {
    this.store.loadInitialData();
  }

  protected trackPaginationItem(
    item: { kind: 'page'; value: number } | { kind: 'ellipsis'; key: string },
  ): string {
    return item.kind === 'page' ? `page-${item.value}` : item.key;
  }
}
