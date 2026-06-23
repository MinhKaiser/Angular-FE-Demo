import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, of } from 'rxjs';
import { ProductService } from '@core/services';
import { Product, ProductsResponse } from '@shared/models';

export interface ProductCategoryOption {
  slug: string;
  name: string;
}

interface ProductFilters {
  searchTerm: string;
  category: string;
}

interface ProductsState {
  products: Product[];
  categories: ProductCategoryOption[];
  total: number;
  filters: ProductFilters;
  isLoading: boolean;
  errorMessage: string;
}

const initialState: ProductsState = {
  products: [],
  categories: [],
  total: 0,
  filters: {
    searchTerm: '',
    category: '',
  },
  isLoading: false,
  errorMessage: '',
};

@Injectable()
export class ProductsStore {
  private readonly productService = inject(ProductService);
  private readonly state = signal<ProductsState>(initialState);

  readonly products = computed(() => this.state().products);
  readonly categories = computed(() => this.state().categories);
  readonly total = computed(() => this.state().total);
  readonly filters = computed(() => this.state().filters);
  readonly isLoading = computed(() => this.state().isLoading);
  readonly errorMessage = computed(() => this.state().errorMessage);

  loadInitialData(): void {
    this.loadCategories();
    this.loadProducts();
  }

  search(searchTerm: string): void {
    this.patchFilters({ searchTerm: searchTerm.trim() });
    this.loadProducts();
  }

  filterByCategory(category: string): void {
    this.patchFilters({ category });
    this.loadProducts();
  }

  reload(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    const query = { limit: 12, skip: 0 };
    const filters = this.state().filters;
    const request = filters.searchTerm
      ? this.productService.searchProducts(filters.searchTerm, query)
      : filters.category
        ? this.productService.getProductsByCategory(filters.category, query)
        : this.productService.getProducts(query);

    this.patchState({ isLoading: true, errorMessage: '' });

    request.pipe(
      catchError(() => {
        this.patchState({ errorMessage: 'Could not load products from DummyJSON.' });
        return of<ProductsResponse>({ products: [], total: 0, skip: 0, limit: query.limit });
      }),
      finalize(() => this.patchState({ isLoading: false }))
    ).subscribe(response => {
      this.patchState({
        products: response.products,
        total: response.total,
      });
    });
  }

  private loadCategories(): void {
    this.productService.getCategories().pipe(
      catchError(() => of([]))
    ).subscribe(categories => {
      this.patchState({
        categories: categories.map(({ slug, name }) => ({ slug, name })),
      });
    });
  }

  private patchFilters(filters: Partial<ProductFilters>): void {
    this.state.update(state => ({
      ...state,
      filters: {
        ...state.filters,
        ...filters,
      },
    }));
  }

  private patchState(statePatch: Partial<ProductsState>): void {
    this.state.update(state => ({
      ...state,
      ...statePatch,
    }));
  }
}
