import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { Product } from '@shared/models';
import { CurrencyFormatPipe } from '@shared/pipes';

@Component({
  selector: 'app-product-detail-view',
  standalone: true,
  imports: [CommonModule, CurrencyFormatPipe],
  template: `
    <ng-container *ngIf="product() as item">
      <div class="product-detail">
        <div class="product-detail__media card">
          <img [src]="item.images[0] || item.thumbnail" [alt]="item.title" />
        </div>

        <div class="product-detail__summary">
          <p class="product-detail__category">{{ item.category }}</p>
          <h1>{{ item.title }}</h1>
          <p class="product-detail__description">{{ item.description }}</p>

          <div class="product-detail__meta">
            <span class="product-detail__price">{{ item.price | appCurrency }}</span>
            <span class="chip product-detail__rating">
              Rating {{ item.rating }}
            </span>
            <span class="chip">
              Stock {{ item.stock }}
            </span>
          </div>

          <dl class="product-detail__facts">
            <div class="card fact">
              <dt>Availability</dt>
              <dd>{{ item.availabilityStatus }}</dd>
            </div>
            <div class="card fact">
              <dt>Shipping</dt>
              <dd>{{ item.shippingInformation }}</dd>
            </div>
            <div class="card fact">
              <dt>Warranty</dt>
              <dd>{{ item.warrantyInformation }}</dd>
            </div>
            <div class="card fact">
              <dt>Return policy</dt>
              <dd>{{ item.returnPolicy }}</dd>
            </div>
          </dl>
        </div>
      </div>

      <section class="reviews">
        <h2>Reviews</h2>
        <div class="reviews__grid">
          <article *ngFor="let review of item.reviews" class="card review-card">
            <p class="review-card__name">{{ review.reviewerName }}</p>
            <p class="muted">Rating {{ review.rating }}</p>
            <p>{{ review.comment }}</p>
          </article>
        </div>
      </section>
    </ng-container>
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

    .product-detail__rating {
      color: var(--app-warning);
      background: #fff7e8;
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

    .review-card__name {
      margin: 0;
      font-weight: 800;
    }

    .review-card p:last-child {
      color: var(--app-text-muted);
      font-size: 0.9rem;
      line-height: 1.6;
    }

    @media (max-width: 900px) {
      .product-detail {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 560px) {
      .product-detail__facts {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class ProductDetailViewComponent {
  readonly product = input.required<Product | null>();
}
