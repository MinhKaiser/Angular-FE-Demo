import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { catchError, finalize, of } from 'rxjs';
import { ProductService } from '@core/services';
import { Product } from '@shared/models';

interface ProductDetailState {
  product: Product | null;
  isLoading: boolean;
  errorMessage: string;
}

const initialState: ProductDetailState = {
  product: null,
  isLoading: false,
  errorMessage: '',
};

export const ProductDetailStore = signalStore(
  withState(initialState),
  withMethods((store, productService = inject(ProductService)) => ({
    loadProduct(productId: number): void {
      if (!Number.isInteger(productId) || productId <= 0) {
        patchState(store, {
          isLoading: false,
          errorMessage: 'Invalid product id.',
        });
        return;
      }

      patchState(store, { isLoading: true, errorMessage: '' });

      productService.getProduct(productId).pipe(
        catchError(() => {
          patchState(store, { errorMessage: 'Could not load product details.' });
          return of(null);
        }),
        finalize(() => patchState(store, { isLoading: false }))
      ).subscribe(product => patchState(store, { product }));
    },
  }))
);

export type ProductDetailStoreInstance = InstanceType<typeof ProductDetailStore>;
