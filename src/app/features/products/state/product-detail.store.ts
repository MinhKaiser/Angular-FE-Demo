import { computed, inject, Injectable, signal } from '@angular/core';
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

@Injectable()
export class ProductDetailStore {
  private readonly productService = inject(ProductService);
  private readonly state = signal<ProductDetailState>(initialState);

  readonly product = computed(() => this.state().product);
  readonly isLoading = computed(() => this.state().isLoading);
  readonly errorMessage = computed(() => this.state().errorMessage);

  loadProduct(productId: number): void {
    if (!Number.isInteger(productId) || productId <= 0) {
      this.patchState({
        isLoading: false,
        errorMessage: 'Invalid product id.',
      });
      return;
    }

    this.patchState({ isLoading: true, errorMessage: '' });

    this.productService.getProduct(productId).pipe(
      catchError(() => {
        this.patchState({ errorMessage: 'Could not load product details.' });
        return of(null);
      }),
      finalize(() => this.patchState({ isLoading: false }))
    ).subscribe(product => this.patchState({ product }));
  }

  private patchState(statePatch: Partial<ProductDetailState>): void {
    this.state.update(state => ({
      ...state,
      ...statePatch,
    }));
  }
}
