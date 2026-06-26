import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild, input, output, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IgxButtonDirective } from 'igniteui-angular/directives';
import { IgxIconModule } from 'igniteui-angular/icon';
import { IgxInputGroupModule } from 'igniteui-angular/input-group';
import { IgxSelectModule } from 'igniteui-angular/select';
import { ProductCategoryOption } from '@features/products/state/products.store';
@Component({
  selector: 'app-product-filter',
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
        <igx-icon igxPrefix>search</igx-icon>
        <label igxLabel>Search by title</label>

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
        [ngModel]="selectedCategory()"
        (ngModelChange)="categoryChange.emit($event ?? '')"
      >
        <label igxLabel>Category</label>

        <igx-select-item value="">
          All categories
        </igx-select-item>

        @for (category of categories(); track category.slug) {
          <igx-select-item [value]="category.slug">
            {{ category.name }}
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
        <igx-icon>travel_explore</igx-icon>
        Search {{ searchLength() ? '(' + searchLength() + ')' : '' }}
      </button>
    </div>
  `,
  styles: [`
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
        grid-template-columns: 1fr;
      }

      .filter-action {
        width: 100%;
      }
    }

    @media (max-width: 760px) {
      .filter-bar {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class ProductFilterComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  readonly categories = input.required<readonly ProductCategoryOption[]>();
  readonly selectedCategory = input('');
  readonly searchTerm = input('');
  readonly isLoading = input(false);
  readonly search = output<string>();
  readonly categoryChange = output<string>();
  readonly searchLength = signal(0);

  readonly searchControl = new FormControl('', { nonNullable: true });
  private readonly subscriptions = new Subscription();

  @ViewChild('searchInput') private searchInput?: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    this.searchLength.set(this.searchControl.value.trim().length);
    this.subscriptions.add(
      this.searchControl.valueChanges.subscribe(value => {
        this.searchLength.set(value.trim().length);
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('searchTerm' in changes) {
      const nextValue = this.searchTerm() ?? '';
      if (this.searchControl.value !== nextValue) {
        this.searchControl.setValue(nextValue, { emitEvent: false });
        this.searchLength.set(nextValue.trim().length);
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.searchControl.value) {
      queueMicrotask(() => this.searchInput?.nativeElement.setSelectionRange(
        this.searchControl.value.length,
        this.searchControl.value.length
      ));
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  submitSearch(): void {
    this.search.emit(this.searchControl.value);
  }
}
