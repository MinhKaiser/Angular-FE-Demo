import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@shared/models';
import { CurrencyFormatPipe } from '@shared/pipes';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyFormatPipe],
  template: `
    <article class="product-card card">
      <a [routerLink]="['/products', product().id]" class="product-card__image">
        <img
          [src]="product().thumbnail"
          [alt]="product().title"
          loading="lazy"
        />
      </a>

      <div class="product-card__body">
        <p class="product-card__category">{{ product().category }}</p>
        <h2>{{ product().title }}</h2>
        <p class="product-card__description">{{ product().description }}</p>

        <div class="product-card__meta">
          <span class="product-card__price">{{ product().price | appCurrency }}</span>
          <span class="product-card__rating">
            Rating {{ product().rating }}
          </span>
        </div>

        <a
          [routerLink]="['/products', product().id]"
          class="action-link product-card__link"
        >
          View details
        </a>
      </div>
    </article>
  `,
  styles: [`
    .product-card {
      overflow: hidden;
      transition:
        transform 0.16s ease,
        box-shadow 0.16s ease;
    }

    .product-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 24px rgb(15 23 42 / 10%);
    }

    .product-card__image {
      display: block;
      background: var(--app-surface-muted);
    }

    .product-card__image img {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
    }

    .product-card__body {
      padding: 1rem;
    }

    .product-card__category {
      margin: 0;
      color: var(--app-primary);
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0;
      text-transform: uppercase;
    }

    .product-card h2 {
      overflow: hidden;
      margin: 0.25rem 0 0;
      font-size: 1rem;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .product-card__description {
      min-height: 2.5rem;
      margin: 0.5rem 0 0;
      color: var(--app-text-muted);
      font-size: 0.9rem;
      line-height: 1.45;
    }

    .product-card__meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      margin-top: 1rem;
    }

    .product-card__price {
      font-size: 1.1rem;
      font-weight: 800;
    }

    .product-card__rating {
      border-radius: 999px;
      padding: 0.25rem 0.5rem;
      color: var(--app-warning);
      background: #fff7e8;
      font-size: 0.78rem;
      font-weight: 800;
    }

    .product-card__link {
      width: 100%;
      margin-top: 1rem;
    }
  `],
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
}
