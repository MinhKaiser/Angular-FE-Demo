import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PostTag } from '@shared/models';
import { IgxButtonDirective } from 'igniteui-angular/directives';

@Component({
  selector: 'app-post-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IgxButtonDirective],
  template: `
    <div class="filter-bar">
      <input
        type="search"
        [formControl]="searchControl"
        (keyup.enter)="submitSearch()"
        class="field"
        placeholder="Search posts"
      />

      <select
        #tagSelect
        [value]="selectedTag()"
        (change)="tagChange.emit(tagSelect.value)"
        class="field"
      >
        <option value="">All tags</option>
        <option *ngFor="let tag of tags()" [value]="tag.slug">{{ tag.name }}</option>
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
