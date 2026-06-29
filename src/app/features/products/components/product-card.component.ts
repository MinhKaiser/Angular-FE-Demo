import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@shared/models';
import { CurrencyFormatPipe } from '@shared/pipes';
import { IgxBadgeModule } from 'igniteui-angular/badge';
import { IgxCardModule } from 'igniteui-angular/card';
import { IgxChipsModule } from 'igniteui-angular/chips';
import { IgxButtonDirective } from 'igniteui-angular/directives';
import { IgxIconModule } from 'igniteui-angular/icon';

@Component({
  selector: 'app-product-card',
  imports: [
    CommonModule,
    RouterLink,
    CurrencyFormatPipe,
    IgxBadgeModule,
    IgxCardModule,
    IgxChipsModule,
    IgxButtonDirective,
    IgxIconModule,
  ],
  template: `
    <igx-card
      elevated="true"
      class="product-card"
      tabindex="0"
      role="link"
      [routerLink]="detailsLink()"
      (keydown.space)="onSpaceKeydown($event)"
    >
      <igx-card-media class="product-card__media">
        <button
          type="button"
          class="product-card__image-link"
          [routerLink]="detailsLink()"
          (click)="$event.stopPropagation()"
        >
          <img
            [src]="product().thumbnail"
            [alt]="product().title"
            loading="lazy"
          />
        </button>
      </igx-card-media>

      <igx-card-header>
        <div igxCardHeaderTitle>{{ product().title }}</div>
        <div igxCardHeaderSubtitle>{{ product().category }}</div>
      </igx-card-header>

      <igx-card-content>
        <p class="product-card__description">{{ product().description }}</p>

        <div class="product-card__meta">
          <span class="product-card__price">{{ product().price | appCurrency }}</span>
          <igx-badge type="warning" [value]="product().rating.toFixed(1)"></igx-badge>
        </div>

        <div class="product-card__chips">
          <igx-chip variant="info">
            <igx-icon igxPrefix>inventory_2</igx-icon>
            {{ product().stock }} in stock
          </igx-chip>
        @if (product().brand) {
          <igx-chip variant="success">
            <igx-icon igxPrefix>branding_watermark</igx-icon>
            {{ product().brand }}
          </igx-chip>
          }
        </div>
      </igx-card-content>

      <igx-card-actions>
        <button
          type="button"
          igxButton="contained"
          class="product-card__link"
          [routerLink]="detailsLink()"
          (click)="$event.stopPropagation()"
        >
          <igx-icon>arrow_forward</igx-icon>
          View details
        </button>
      </igx-card-actions>
    </igx-card>
  `,
  styles: [`
    .product-card {
      height: 100%;
      cursor: pointer;
      transition:
        transform 0.16s ease,
        box-shadow 0.16s ease;
    }

    .product-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 24px rgb(15 23 42 / 10%);
    }

    .product-card__media,
    .product-card__image-link {
      display: block;
    }

    .product-card__image-link {
      width: 100%;
      padding: 0;
      border: 0;
      background: transparent;
      cursor: pointer;
    }

    .product-card__media img {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
    }

    .product-card__description {
      min-height: 2.5rem;
      margin: 0;
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

    .product-card__chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .product-card__link {
      display: inline-flex;
      gap: 0.45rem;
      align-items: center;
    }
  `],
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
  readonly detailsLink = computed(() => ['/products', this.product().id]);

  onSpaceKeydown(event: KeyboardEvent): void {
    event.preventDefault();
    (event.currentTarget as HTMLElement | null)?.click();
  }
}
