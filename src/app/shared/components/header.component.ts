import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@core/services';
import { Component, OnInit, inject } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-white shadow-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <a routerLink="/" class="flex items-center gap-2">
              <div class="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
              <span class="text-xl font-bold text-gray-900">Store</span>
            </a>
          </div>

          <!-- Nav Links -->
          <div class="flex items-center gap-8">
            <a routerLink="/products" routerLinkActive="text-blue-600" class="text-gray-700 hover:text-blue-600 transition">
              Products
            </a>
            <a routerLink="/posts" routerLinkActive="text-blue-600" class="text-gray-700 hover:text-blue-600 transition">
              Posts
            </a>
            <a routerLink="/todos" routerLinkActive="text-blue-600" class="text-gray-700 hover:text-blue-600 transition">
              Todos
            </a>
          </div>

          <!-- Right Side -->
          <div class="flex items-center gap-4">
            <ng-container *ngIf="isAuthenticated()">
              <span class="text-sm text-gray-600">{{ username }}</span>
              <button (click)="onLogout()" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                Logout
              </button>
            </ng-container>
            <ng-container *ngIf="!isAuthenticated()">
              <a routerLink="/auth/login" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Sign In
              </a>
            </ng-container>
          </div>
        </div>
      </div>
    </nav>
  `,
})
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  isAuthenticated = this.authService.isAuthenticated;
  username = '';

  ngOnInit(): void {
    const user = this.authService.user();
    if (user) {
      this.username = `${user.firstName} ${user.lastName}`;
    }
  }

  onLogout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/auth/login']);
    });
  }
}
