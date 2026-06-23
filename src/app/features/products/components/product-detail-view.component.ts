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
      <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_440px]">
        <div class="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <img [src]="item.images[0] || item.thumbnail" [alt]="item.title" class="aspect-square w-full object-cover" />
        </div>

        <div>
          <p class="text-sm font-semibold uppercase tracking-wide text-blue-700">{{ item.category }}</p>
          <h1 class="mt-2 text-3xl font-bold text-slate-950">{{ item.title }}</h1>
          <p class="mt-4 text-sm leading-6 text-slate-600">{{ item.description }}</p>

          <div class="mt-6 flex flex-wrap items-center gap-3">
            <span class="text-3xl font-bold text-slate-950">{{ item.price | appCurrency }}</span>
            <span class="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
              Rating {{ item.rating }}
            </span>
            <span class="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
              Stock {{ item.stock }}
            </span>
          </div>

          <dl class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="rounded-lg border border-slate-200 bg-white p-4">
              <dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Availability</dt>
              <dd class="mt-1 text-sm text-slate-900">{{ item.availabilityStatus }}</dd>
            </div>
            <div class="rounded-lg border border-slate-200 bg-white p-4">
              <dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Shipping</dt>
              <dd class="mt-1 text-sm text-slate-900">{{ item.shippingInformation }}</dd>
            </div>
            <div class="rounded-lg border border-slate-200 bg-white p-4">
              <dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Warranty</dt>
              <dd class="mt-1 text-sm text-slate-900">{{ item.warrantyInformation }}</dd>
            </div>
            <div class="rounded-lg border border-slate-200 bg-white p-4">
              <dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Return policy</dt>
              <dd class="mt-1 text-sm text-slate-900">{{ item.returnPolicy }}</dd>
            </div>
          </dl>
        </div>
      </div>

      <section class="mt-10">
        <h2 class="text-xl font-semibold text-slate-950">Reviews</h2>
        <div class="mt-4 grid gap-4 md:grid-cols-3">
          <article *ngFor="let review of item.reviews" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p class="text-sm font-semibold text-slate-950">{{ review.reviewerName }}</p>
            <p class="mt-1 text-xs text-slate-500">Rating {{ review.rating }}</p>
            <p class="mt-3 text-sm leading-6 text-slate-600">{{ review.comment }}</p>
          </article>
        </div>
      </section>
    </ng-container>
  `,
})
export class ProductDetailViewComponent {
  readonly product = input.required<Product | null>();
}
