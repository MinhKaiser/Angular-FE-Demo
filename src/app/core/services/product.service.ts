import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Product, ProductsResponse, Category } from '@shared/models';
import { HttpClientService, PaginationOptions } from './http-client.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor(private httpClient: HttpClientService) {}

  getAllProducts(options?: PaginationOptions): Observable<ProductsResponse> {
    return this.httpClient.get<ProductsResponse>('/products', options);
  }

  getProductById(id: number, options?: PaginationOptions): Observable<Product> {
    return this.httpClient.get<Product>(`/products/${id}`, options);
  }

  searchProducts(query: string, options?: PaginationOptions): Observable<ProductsResponse> {
    const searchOptions = { ...options, select: query };
    return this.httpClient.get<ProductsResponse>(`/products/search?q=${query}`, options);
  }

  getCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>('/products/categories');
  }

  getProductsByCategory(categoryName: string, options?: PaginationOptions): Observable<ProductsResponse> {
    return this.httpClient.get<ProductsResponse>(`/products/category/${categoryName}`, options);
  }

  addProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.httpClient.post<Product>('/products/add', product);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.httpClient.put<Product>(`/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.httpClient.delete(`/products/${id}`);
  }
}
