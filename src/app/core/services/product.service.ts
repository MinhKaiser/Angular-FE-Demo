import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Category,
  CreateProductRequest,
  DeletedProduct,
  PaginationQuery,
  Product,
  ProductsResponse,
  UpdateProductRequest,
} from '@shared/models';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly httpClient = inject(HttpClientService);

  getProducts(query?: PaginationQuery): Observable<ProductsResponse> {
    return this.httpClient.get<ProductsResponse>('/products', query);
  }

  getProduct(id: number): Observable<Product> {
    return this.httpClient.get<Product>(`/products/${id}`);
  }

  searchProducts(searchTerm: string, query?: PaginationQuery): Observable<ProductsResponse> {
    return this.httpClient.get<ProductsResponse>('/products/search', {
      ...query,
      q: searchTerm.trim(),
    });
  }

  getCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>('/products/categories');
  }

  getCategoryList(): Observable<string[]> {
    return this.httpClient.get<string[]>('/products/category-list');
  }

  getProductsByCategory(categorySlug: string, query?: PaginationQuery): Observable<ProductsResponse> {
    return this.httpClient.get<ProductsResponse>(`/products/category/${categorySlug}`, query);
  }

  addProduct(product: CreateProductRequest): Observable<Product> {
    return this.httpClient.post<Product, CreateProductRequest>('/products/add', product);
  }

  updateProduct(id: number, product: UpdateProductRequest): Observable<Product> {
    return this.httpClient.patch<Product, UpdateProductRequest>(`/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<DeletedProduct> {
    return this.httpClient.delete<DeletedProduct>(`/products/${id}`);
  }
}
