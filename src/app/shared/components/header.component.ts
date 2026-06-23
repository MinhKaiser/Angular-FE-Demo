import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@core/services';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a routerLink="/" class="flex items-center gap-3">
          <span class="flex h-9 w-9 items-center justify-center rounded-md bg-slate-950 text-sm font-bold text-white">DJ</span>
          <span class="text-lg font-bold text-slate-950">Dummy Shop</span>
        </a>

        <div class="hidden items-center gap-6 md:flex">
          <a routerLink="/products" routerLinkActive="text-blue-700" class="text-sm font-medium text-slate-600 transition hover:text-blue-700">
            Products
          </a>
          <a routerLink="/posts" routerLinkActive="text-emerald-700" class="text-sm font-medium text-slate-600 transition hover:text-emerald-700">
            Posts
          </a>
          <a routerLink="/todos" routerLinkActive="text-violet-700" class="text-sm font-medium text-slate-600 transition hover:text-violet-700">
            Todos
          </a>
        </div>

        <div class="flex items-center gap-3">
          <ng-container *ngIf="isAuthenticated(); else signInLink">
            <span class="hidden max-w-40 truncate text-sm text-slate-600 sm:inline">{{ displayName() }}</span>
            <button
              type="button"
              (click)="onLogout()"
              class="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Logout
            </button>
          </ng-container>

          <ng-template #signInLink>
            <a routerLink="/auth/login" class="rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
              Sign in
            </a>
          </ng-template>
        </div>
      </nav>
    </header>
  `,
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly displayName = this.authService.displayName;

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
