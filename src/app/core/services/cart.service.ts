import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cart, CartsResponse } from '@shared/models';
import { HttpClientService, PaginationOptions } from './http-client.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private httpClient: HttpClientService) {}

  getAllCarts(options?: PaginationOptions): Observable<CartsResponse> {
    return this.httpClient.get<CartsResponse>('/carts', options);
  }

  getCartById(id: number): Observable<Cart> {
    return this.httpClient.get<Cart>(`/carts/${id}`);
  }

  getCartsByUserId(userId: number, options?: PaginationOptions): Observable<CartsResponse> {
    return this.httpClient.get<CartsResponse>(`/carts/user/${userId}`, options);
  }

  addCart(cart: Omit<Cart, 'id'>): Observable<Cart> {
    return this.httpClient.post<Cart>('/carts/add', cart);
  }

  updateCart(id: number, cart: Partial<Cart>): Observable<Cart> {
    return this.httpClient.put<Cart>(`/carts/${id}`, cart);
  }

  deleteCart(id: number): Observable<any> {
    return this.httpClient.delete(`/carts/${id}`);
  }
}
