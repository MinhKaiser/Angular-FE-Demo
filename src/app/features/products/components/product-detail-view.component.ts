import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { Product } from '@shared/models';
import { CurrencyFormatPipe } from '@shared/pipes';
import { IgxAvatarModule } from 'igniteui-angular/avatar';
import { IgxCardModule } from 'igniteui-angular/card';
import { IgxChipsModule } from 'igniteui-angular/chips';
import { IgxIconModule } from 'igniteui-angular/icon';
import { IgxProgressBarModule } from 'igniteui-angular/progressbar';

@Component({
  selector: 'app-product-detail-view',
  imports: [
    CommonModule,
    CurrencyFormatPipe,
    IgxAvatarModule,
    IgxCardModule,
    IgxChipsModule,
    IgxIconModule,
    IgxProgressBarModule,
  ],
  template: `
  @if (product(); as item) {
    <div class="product-detail">
      <igx-card elevated="true" class="product-detail__media">
        <img [src]="item.images[0] || item.thumbnail" [alt]="item.title" />
      </igx-card>

      <div class="product-detail__summary">
        <p class="product-detail__category">{{ item.category }}</p>
        <h1>{{ item.title }}</h1>
        <p class="product-detail__description">{{ item.description }}</p>

        <div class="product-detail__meta">
          <span class="product-detail__price">{{ item.price | appCurrency }}</span>

          <igx-chip class="product-detail__rating" variant="warning">
            <igx-icon igxPrefix>star</igx-icon>
            Rating {{ item.rating }}
          </igx-chip>

          <igx-chip variant="info">
            <igx-icon igxPrefix>inventory_2</igx-icon>
            Stock {{ item.stock }}
          </igx-chip>
        </div>

        <div class="product-detail__stock-bar">
          <div class="product-detail__stock-header">
            <span>Stock health</span>
            <strong>{{ item.stock }} / 150</strong>
          </div>

          <igx-linear-bar
            [max]="150"
            [value]="item.stock"
            type="info">
          </igx-linear-bar>
        </div>

        <dl class="product-detail__facts">
          <igx-card elevated="true" class="fact">
            <dt>Availability</dt>
            <dd>{{ item.availabilityStatus }}</dd>
          </igx-card>

          <igx-card elevated="true" class="fact">
            <dt>Shipping</dt>
            <dd>{{ item.shippingInformation }}</dd>
          </igx-card>

          <igx-card elevated="true" class="fact">
            <dt>Warranty</dt>
            <dd>{{ item.warrantyInformation }}</dd>
          </igx-card>

          <igx-card elevated="true" class="fact">
            <dt>Return policy</dt>
            <dd>{{ item.returnPolicy }}</dd>
          </igx-card>
        </dl>
      </div>
    </div>

    <section class="reviews">
      <h2>Reviews</h2>

      <div class="reviews__grid">
        @for (review of item.reviews; track review.reviewerEmail) {
          <igx-card elevated="true" class="review-card">
            <div class="review-card__header">
              <igx-avatar
                [initials]="review.reviewerName.slice(0, 2).toUpperCase()"
                shape="circle"
                size="small">
              </igx-avatar>

              <div>
                <p class="review-card__name">{{ review.reviewerName }}</p>
                <p class="muted">Rating {{ review.rating }}</p>
              </div>
            </div>

            <p>{{ review.comment }}</p>
          </igx-card>
        }
      </div>
    </section>
  }
`,
  styles: [`
    .product-detail {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 440px;
      gap: 2rem;
    }

    .product-detail__media {
      overflow: hidden;
    }

    .product-detail__media img {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
    }

    .product-detail__category {
      margin: 0;
      color: var(--app-primary);
      font-size: 0.86rem;
      font-weight: 800;
      text-transform: uppercase;
    }

    .product-detail h1 {
      margin: 0.5rem 0 0;
      font-size: clamp(2rem, 4vw, 3rem);
      line-height: 1.05;
    }

    .product-detail__description {
      margin: 1rem 0 0;
      color: var(--app-text-muted);
      line-height: 1.65;
    }

    .product-detail__meta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }

    .product-detail__price {
      font-size: 2rem;
      font-weight: 800;
    }

    .product-detail__stock-bar {
      margin-top: 1.5rem;
    }

    .product-detail__stock-header {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }

    .product-detail__facts {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
      margin: 2rem 0 0;
    }

    .fact {
      padding: 1rem;
    }

    .fact dt {
      color: var(--app-text-muted);
      font-size: 0.78rem;
      font-weight: 800;
      text-transform: uppercase;
    }

    .fact dd {
      margin: 0.35rem 0 0;
      font-size: 0.9rem;
    }

    .reviews {
      margin-top: 2.5rem;
    }

    .reviews h2 {
      margin: 0;
      font-size: 1.25rem;
    }

    .reviews__grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .review-card {
      padding: 1.25rem;
    }

    .review-card__header {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      margin-bottom: 0.85rem;
    }

    .review-card__name {
      margin: 0;
      font-weight: 800;
    }

    .review-card p:last-child {
      margin: 0;
      color: var(--app-text-muted);
      font-size: 0.9rem;
      line-height: 1.6;
    }

    @media (max-width: 900px) {
      .product-detail {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .product-detail__summary {
        min-width: 0;
      }
    }

    @media (max-width: 560px) {
      .product-detail__meta,
      .product-detail__stock-header {
        align-items: flex-start;
        flex-direction: column;
      }

      .product-detail__facts {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class ProductDetailViewComponent {
  readonly product = input.required<Product | null>();
}
