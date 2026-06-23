import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Cart,
  CartsResponse,
  CreateCartRequest,
  DeletedCart,
  PaginationQuery,
  UpdateCartRequest,
} from '@shared/models';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private httpClient: HttpClientService) {}

  getCarts(query?: PaginationQuery): Observable<CartsResponse> {
    return this.httpClient.get<CartsResponse>('/carts', query);
  }

  getCart(id: number): Observable<Cart> {
    return this.httpClient.get<Cart>(`/carts/${id}`);
  }

  getCartsByUser(userId: number, query?: PaginationQuery): Observable<CartsResponse> {
    return this.httpClient.get<CartsResponse>(`/carts/user/${userId}`, query);
  }

  addCart(cart: CreateCartRequest): Observable<Cart> {
    return this.httpClient.post<Cart, CreateCartRequest>('/carts/add', cart);
  }

  updateCart(id: number, cart: UpdateCartRequest): Observable<Cart> {
    return this.httpClient.patch<Cart, UpdateCartRequest>(`/carts/${id}`, cart);
  }

  deleteCart(id: number): Observable<DeletedCart> {
    return this.httpClient.delete<DeletedCart>(`/carts/${id}`);
  }
}
