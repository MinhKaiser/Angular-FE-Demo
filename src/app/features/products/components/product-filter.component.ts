import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ProductCategoryOption } from '../state/products.store';

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="grid gap-3 sm:grid-cols-[minmax(220px,1fr)_180px_auto]">
      <input
        type="search"
        [formControl]="searchControl"
        (keyup.enter)="submitSearch()"
        class="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        placeholder="Search by title"
      />

      <select
        #categorySelect
        [value]="selectedCategory()"
        (change)="categoryChange.emit(categorySelect.value)"
        class="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      >
        <option value="">All categories</option>
        <option *ngFor="let category of categories()" [value]="category.slug">
          {{ category.name }}
        </option>
      </select>

      <button
        type="button"
        (click)="submitSearch()"
        class="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:bg-slate-400"
        [disabled]="isLoading()"
      >
        Search
      </button>
    </div>
  `,
})
export class ProductFilterComponent {
  readonly categories = input.required<readonly ProductCategoryOption[]>();
  readonly selectedCategory = input('');
  readonly isLoading = input(false);
  readonly search = output<string>();
  readonly categoryChange = output<string>();

  readonly searchControl = new FormControl('', { nonNullable: true });

  submitSearch(): void {
    this.search.emit(this.searchControl.value);
  }
}
