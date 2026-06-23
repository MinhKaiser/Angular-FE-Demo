import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, ProductService, TodoService, PostService } from '@core/services';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Welcome Section -->
        <div class="mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">Welcome back, {{ firstName }}! 👋</h1>
          <p class="text-gray-600">Here's what's happening in your store today</p>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm font-medium">Total Products</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ productCount }}</p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">📦</div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm font-medium">Posts</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ postCount }}</p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">📝</div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm font-medium">Todos</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ todoCount }}</p>
              </div>
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">✅</div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-gray-600 text-sm font-medium">User ID</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ userId }}</p>
              </div>
              <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-2xl">👤</div>
            </div>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a routerLink="/products" class="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition">
            <div class="text-4xl mb-4">🛍️</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Browse Products</h3>
            <p class="text-gray-600">Explore our collection</p>
          </a>

          <a routerLink="/posts" class="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition">
            <div class="text-4xl mb-4">📰</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Read Posts</h3>
            <p class="text-gray-600">Latest articles and news</p>
          </a>

          <a routerLink="/todos" class="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition">
            <div class="text-4xl mb-4">📋</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">My Todos</h3>
            <p class="text-gray-600">Manage your tasks</p>
          </a>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private productService = inject(ProductService);
  private todoService = inject(TodoService);
  private postService = inject(PostService);

  firstName = '';
  userId = 0;
  productCount = 0;
  todoCount = 0;
  postCount = 0;

  ngOnInit(): void {
    const user = this.authService.user();
    if (user) {
      this.firstName = user.firstName;
      this.userId = user.id;
      this.loadStatistics();
    }
  }

  private loadStatistics(): void {
    this.productService.getAllProducts({ limit: 1, skip: 0 }).subscribe({
      next: (response) => {
        this.productCount = response.total;
      },
    });

    this.postService.getAllPosts({ limit: 1, skip: 0 }).subscribe({
      next: (response) => {
        this.postCount = response.total;
      },
    });

    const userId = this.authService.user()?.id;
    if (userId) {
      this.todoService.getTodosByUserId(userId, { limit: 1, skip: 0 }).subscribe({
        next: (response) => {
          this.todoCount = response.total;
        },
      });
    }
  }
}
