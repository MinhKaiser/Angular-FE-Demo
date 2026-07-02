import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnChanges,
  SimpleChanges,
  ViewChild,
  computed,
  input,
  output,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostTag } from '@shared/models';
import { IgxButtonDirective } from 'igniteui-angular/directives';
import { IgxIconModule } from 'igniteui-angular/icon';
import { IgxInputGroupModule } from 'igniteui-angular/input-group';
import { IgxSelectModule } from 'igniteui-angular/select';

@Component({
  selector: 'app-post-filter',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IgxButtonDirective,
    IgxIconModule,
    IgxInputGroupModule,
    IgxSelectModule,
  ],
  template: `
    <div class="filter-bar">
      <igx-input-group type="box" class="filter-field">
        <igx-icon igxPrefix>manage_search</igx-icon>
        <label igxLabel>Search posts</label>

        <input
          #searchInput
          igxInput
          type="search"
          [formControl]="searchControl"
          (keyup.enter)="submitSearch()"
          autocomplete="off"
        />
      </igx-input-group>

      <igx-select
        type="box"
        class="filter-field"
        [ngModel]="selectedTag()"
        (ngModelChange)="tagChange.emit($event ?? '')"
      >
        <label igxLabel>Tag</label>

        <igx-select-item value=""> All tags </igx-select-item>

        @for (tag of tags(); track tag.slug) {
          <igx-select-item [value]="tag.slug">
            {{ tag.name }}
          </igx-select-item>
        }
      </igx-select>

      <button
        igxButton="contained"
        type="button"
        (click)="submitSearch()"
        class="primary-button filter-action"
        [disabled]="isLoading()"
      >
        <igx-icon>search</igx-icon>
        Search {{ searchLength() ? '(' + searchLength() + ')' : '' }}
      </button>
    </div>
  `,
  styles: [
    `
      .filter-bar {
        display: grid;
        grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.8fr) auto;
        gap: 0.75rem;
        align-items: end;
      }

      .filter-field {
        min-width: 0;
      }

      .filter-action {
        display: inline-flex;
        gap: 0.5rem;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
      }

      @media (max-width: 1040px) {
        .filter-bar {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .filter-action {
          grid-column: 1 / -1;
          width: 100%;
        }
      }

      @media (max-width: 760px) {
        .filter-bar {
          grid-template-columns: 1fr;
        }

        .filter-action {
          grid-column: auto;
        }
      }
    `,
  ],
})
export class PostFilterComponent implements OnChanges, AfterViewInit {
  readonly tags = input.required<readonly PostTag[]>();
  readonly selectedTag = input('');
  readonly searchTerm = input('');
  readonly isLoading = input(false);
  readonly search = output<string>();
  readonly tagChange = output<string>();
  readonly searchControl = new FormControl('', { nonNullable: true });
  private readonly searchValue = toSignal(this.searchControl.valueChanges, {
    initialValue: this.searchControl.value,
  });
  readonly searchLength = computed(() => this.searchValue().trim().length);

  @ViewChild('searchInput') private searchInput?: ElementRef<HTMLInputElement>;

  ngOnChanges(changes: SimpleChanges): void {
    if ('searchTerm' in changes) {
      const nextValue = this.searchTerm() ?? '';
      if (this.searchControl.value !== nextValue) {
        this.searchControl.setValue(nextValue);
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.searchControl.value) {
      queueMicrotask(() =>
        this.searchInput?.nativeElement.setSelectionRange(
          this.searchControl.value.length,
          this.searchControl.value.length,
        ),
      );
    }
  }

  submitSearch(): void {
    this.search.emit(this.searchControl.value.trim());
  }
}
