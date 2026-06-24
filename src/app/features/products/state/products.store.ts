import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
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

export const ProductsStore = signalStore(
  withState(initialState),
  withMethods((store, productService = inject(ProductService)) => {
    const patchFilters = (filters: Partial<ProductFilters>): void => {
      patchState(store, {
        filters: {
          ...store.filters(),
          ...filters,
        },
      });
    };

    const loadProducts = (): void => {
      const query = { limit: 12, skip: 0 };
      const filters = store.filters();
      const request = filters.searchTerm
        ? productService.searchProducts(filters.searchTerm, query)
        : filters.category
          ? productService.getProductsByCategory(filters.category, query)
          : productService.getProducts(query);

      patchState(store, { isLoading: true, errorMessage: '' });

      request.pipe(
        catchError(() => {
          patchState(store, { errorMessage: 'Could not load products from DummyJSON.' });
          return of<ProductsResponse>({ products: [], total: 0, skip: 0, limit: query.limit });
        }),
        finalize(() => patchState(store, { isLoading: false }))
      ).subscribe(response => {
        patchState(store, {
          products: response.products,
          total: response.total,
        });
      });
    };

    const loadCategories = (): void => {
      productService.getCategories().pipe(
        catchError(() => of([]))
      ).subscribe(categories => {
        patchState(store, {
          categories: categories.map(({ slug, name }) => ({ slug, name })),
        });
      });
    };

    return {
      loadInitialData(): void {
        loadCategories();
        loadProducts();
      },
      search(searchTerm: string): void {
        patchFilters({ searchTerm: searchTerm.trim() });
        loadProducts();
      },
      filterByCategory(category: string): void {
        patchFilters({ category });
        loadProducts();
      },
      reload(): void {
        loadProducts();
      },
    };
  })
);

export type ProductsStoreInstance = InstanceType<typeof ProductsStore>;
