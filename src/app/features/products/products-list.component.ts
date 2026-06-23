import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '@core/services';
import { Product } from '@shared/models';
import { CurrencyFormatPipe } from '@shared/pipes';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyFormatPipe],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Products</h1>
        
        <div *ngIf="isLoading" class="flex justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <div *ngIf="!isLoading && products.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div *ngFor="let product of products" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div class="aspect-square bg-gray-200 overflow-hidden">
              <img [src]="product.thumbnail" [alt]="product.title" class="w-full h-full object-cover hover:scale-105 transition" />
            </div>
            <div class="p-4">
              <p class="text-xs font-medium text-blue-600 mb-1">{{ product.category | uppercase }}</p>
              <h3 class="font-semibold text-gray-900 mb-2 truncate">{{ product.title }}</h3>
              <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ product.description }}</p>
              <div class="flex justify-between items-center">
                <span class="text-lg font-bold text-gray-900">{{ product.price | appCurrency }}</span>
                <span class="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">⭐ {{ product.rating }}</span>
              </div>
              <button [routerLink]="['/products', product.id]" class="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                View Details
              </button>
            </div>
          </div>
        </div>

        <div *ngIf="!isLoading && products.length === 0" class="text-center py-12">
          <p class="text-gray-600">No products found</p>
        </div>
      </div>
    </div>
  `,
})
export class ProductsListComponent implements OnInit {
  private productService = inject(ProductService);
  
  products: Product[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.productService.getAllProducts({ limit: 12, skip: 0 }).subscribe({
      next: (response) => {
        this.products = response.products;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load products:', err);
        this.isLoading = false;
      },
    });
  }
}
