import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { catchError, finalize, of } from 'rxjs';
import { ProductService } from '@core/services';
import { Product, ProductsResponse } from '@shared/models';

export interface ProductCategoryOption {
  slug: string;
  name: string;
}

export interface PaginationPageItem {
  kind: 'page';
  value: number;
}

export interface PaginationEllipsisItem {
  kind: 'ellipsis';
  key: string;
}

export type PaginationItem = PaginationPageItem | PaginationEllipsisItem;

interface ProductFilters {
  searchTerm: string;
  category: string;
}

interface ProductsState {
  products: Product[];
  categories: ProductCategoryOption[];
  total: number;
  skip: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  filters: ProductFilters;
  isLoading: boolean;
  errorMessage: string;
}

const initialState: ProductsState = {
  products: [],
  categories: [],
  total: 0,
  skip: 0,
  pageSize: 12,
  currentPage: 1,
  totalPages: 0,
  filters: {
    searchTerm: '',
    category: '',
  },
  isLoading: false,
  errorMessage: '',
};

const buildPaginationItems = (
  currentPage: number,
  totalPages: number,
  siblingCount = 1
): PaginationItem[] => {
  if (totalPages <= 0) {
    return [];
  }

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => ({
      kind: 'page',
      value: index + 1,
    }));
  }

  const pages = new Set<number>([1, totalPages]);
  const start = Math.max(2, currentPage - siblingCount);
  const end = Math.min(totalPages - 1, currentPage + siblingCount);

  for (let page = start; page <= end; page += 1) {
    pages.add(page);
  }

  if (currentPage <= 3) {
    pages.add(2);
    pages.add(3);
  }

  if (currentPage >= totalPages - 2) {
    pages.add(totalPages - 1);
    pages.add(totalPages - 2);
  }

  const sortedPages = Array.from(pages)
    .filter(page => page >= 1 && page <= totalPages)
    .sort((left, right) => left - right);

  const items: PaginationItem[] = [];

  for (let index = 0; index < sortedPages.length; index += 1) {
    const page = sortedPages[index];
    const previousPage = sortedPages[index - 1];

    if (previousPage && page - previousPage > 1) {
      items.push({
        kind: 'ellipsis',
        key: `ellipsis-${previousPage}-${page}`,
      });
    }

    items.push({
      kind: 'page',
      value: page,
    });
  }

  return items;
};

export const ProductsStore = signalStore(
  withState(initialState),
  withComputed(({ currentPage, products, skip, total, totalPages }) => ({
    canGoToPreviousPage: computed(() => currentPage() > 1),
    canGoToNextPage: computed(() => currentPage() < totalPages()),
    visibleRangeStart: computed(() => total() === 0 ? 0 : skip() + 1),
    visibleRangeEnd: computed(() => Math.min(skip() + products().length, total())),
    paginationItems: computed(() => buildPaginationItems(currentPage(), totalPages())),
    paginationLabel: computed(() =>
      `Showing ${total() === 0 ? 0 : skip() + 1}-${Math.min(skip() + products().length, total())} of ${total()} products`
    ),
  })),
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
      const query = {
        limit: store.pageSize(),
        skip: store.skip(),
      };
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
        const pageSize = response.limit || store.pageSize();
        const totalPages = response.total > 0 ? Math.ceil(response.total / pageSize) : 0;

        patchState(store, {
          products: response.products,
          total: response.total,
          skip: response.skip,
          pageSize,
          currentPage: totalPages === 0 ? 1 : Math.floor(response.skip / pageSize) + 1,
          totalPages,
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
        patchState(store, { skip: 0, currentPage: 1 });
        patchFilters({ searchTerm: searchTerm.trim() });
        loadProducts();
      },
      filterByCategory(category: string): void {
        patchState(store, { skip: 0, currentPage: 1 });
        patchFilters({ category });
        loadProducts();
      },
      goToPage(page: number): void {
        const totalPages = store.totalPages();

        if (totalPages > 0 && (page < 1 || page > totalPages || page === store.currentPage())) {
          return;
        }

        patchState(store, {
          currentPage: page,
          skip: (page - 1) * store.pageSize(),
        });
        loadProducts();
      },
      nextPage(): void {
        const nextPage = store.currentPage() + 1;
        if (nextPage <= store.totalPages()) {
          patchState(store, {
            currentPage: nextPage,
            skip: store.skip() + store.pageSize(),
          });
          loadProducts();
        }
      },
      previousPage(): void {
        const previousPage = store.currentPage() - 1;
        if (previousPage >= 1) {
          patchState(store, {
            currentPage: previousPage,
            skip: Math.max(0, store.skip() - store.pageSize()),
          });
          loadProducts();
        }
      },
      reload(): void {
        loadProducts();
      },
    };
  })
);

export type ProductsStoreInstance = InstanceType<typeof ProductsStore>;
