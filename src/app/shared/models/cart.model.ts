import { DeletedResource, PaginatedResponse } from './api.model';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal?: number;
  discountedPrice?: number;
  thumbnail?: string;
}

export interface Cart {
  id: number;
  products: CartItem[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

export interface CartsResponse extends PaginatedResponse {
  carts: Cart[];
}

export interface CartProductInput {
  id: number;
  quantity: number;
}

export interface CreateCartRequest {
  userId: number;
  products: CartProductInput[];
}

export interface UpdateCartRequest {
  merge?: boolean;
  products: CartProductInput[];
}

export type DeletedCart = Cart & DeletedResource;
