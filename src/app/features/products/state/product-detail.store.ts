import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, catchError, finalize, switchMap, tap } from 'rxjs';
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
  withMethods((store, productService = inject(ProductService)) => {
    let currentProductId: number | null = null;

    const loadProductRequest = rxMethod<number>(
      switchMap((productId) => {
        patchState(store, { product: null, isLoading: true, errorMessage: '' });

        return productService.getProduct(productId).pipe(
          tap((product) => patchState(store, { product })),
          catchError(() => {
            patchState(store, { errorMessage: 'Could not load product details.' });
            return EMPTY;
          }),
          finalize(() => patchState(store, { isLoading: false })),
        );
      }),
    );

    return {
      loadProduct(productId: number): void {
        if (!Number.isInteger(productId) || productId <= 0) {
          currentProductId = null;
          patchState(store, {
            product: null,
            isLoading: false,
            errorMessage: 'Invalid product id.',
          });
          return;
        }

        currentProductId = productId;
        loadProductRequest(productId);
      },
      reload(): void {
        if (currentProductId !== null) {
          loadProductRequest(currentProductId);
        }
      },
    };
  }),
);

export type ProductDetailStoreInstance = InstanceType<typeof ProductDetailStore>;
