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
    <article class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <a [routerLink]="['/products', product().id]" class="block bg-slate-100">
        <img
          [src]="product().thumbnail"
          [alt]="product().title"
          class="aspect-square w-full object-cover"
          loading="lazy"
        />
      </a>

      <div class="p-4">
        <p class="text-xs font-semibold uppercase tracking-wide text-blue-700">{{ product().category }}</p>
        <h2 class="mt-1 truncate text-base font-semibold text-slate-950">{{ product().title }}</h2>
        <p class="mt-2 min-h-10 text-sm leading-5 text-slate-600">{{ product().description }}</p>

        <div class="mt-4 flex items-center justify-between gap-3">
          <span class="text-lg font-bold text-slate-950">{{ product().price | appCurrency }}</span>
          <span class="rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
            Rating {{ product().rating }}
          </span>
        </div>

        <a
          [routerLink]="['/products', product().id]"
          class="mt-4 inline-flex w-full items-center justify-center rounded-md border border-blue-700 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
        >
          View details
        </a>
      </div>
    </article>
  `,
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
}
