import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ProductCategoryOption } from '../state/products.store';
import { IgxButtonDirective } from 'igniteui-angular/directives';

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IgxButtonDirective],
  template: `
    <div class="filter-bar">
      <input
        type="search"
        [formControl]="searchControl"
        (keyup.enter)="submitSearch()"
        class="field"
        placeholder="Search by title"
      />

      <select
        #categorySelect
        [value]="selectedCategory()"
        (change)="categoryChange.emit(categorySelect.value)"
        class="field"
      >
        <option value="">All categories</option>
        <option *ngFor="let category of categories()" [value]="category.slug">
          {{ category.name }}
        </option>
      </select>

      <button
        igxButton="contained"
        type="button"
        (click)="submitSearch()"
        class="primary-button"
        [disabled]="isLoading()"
      >
        Search
      </button>
    </div>
  `,
  styles: [`
    .filter-bar {
      display: grid;
      grid-template-columns: minmax(220px, 1fr) 180px auto;
      gap: 0.75rem;
    }

    @media (max-width: 760px) {
      .filter-bar {
        grid-template-columns: 1fr;
      }
    }
  `],
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
