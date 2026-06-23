import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PostTag } from '@shared/models';

@Component({
  selector: 'app-post-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="grid gap-3 sm:grid-cols-[minmax(220px,1fr)_180px_auto]">
      <input
        type="search"
        [formControl]="searchControl"
        (keyup.enter)="submitSearch()"
        class="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        placeholder="Search posts"
      />

      <select
        #tagSelect
        [value]="selectedTag()"
        (change)="tagChange.emit(tagSelect.value)"
        class="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
      >
        <option value="">All tags</option>
        <option *ngFor="let tag of tags()" [value]="tag.slug">{{ tag.name }}</option>
      </select>

      <button
        type="button"
        (click)="submitSearch()"
        class="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:bg-slate-400"
        [disabled]="isLoading()"
      >
        Search
      </button>
    </div>
  `,
})
export class PostFilterComponent {
  readonly tags = input.required<readonly PostTag[]>();
  readonly selectedTag = input('');
  readonly isLoading = input(false);
  readonly search = output<string>();
  readonly tagChange = output<string>();

  readonly searchControl = new FormControl('', { nonNullable: true });

  submitSearch(): void {
    this.search.emit(this.searchControl.value);
  }
}
