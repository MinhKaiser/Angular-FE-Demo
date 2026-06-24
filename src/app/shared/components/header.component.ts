import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@core/services';
import { IgxButtonDirective } from 'igniteui-angular/directives';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, IgxButtonDirective],
  template: `
    <header class="site-header">
      <nav class="site-header__nav">
        <a routerLink="/" class="brand">
          <span class="brand__mark">DJ</span>
          <span class="brand__name">Dummy Shop</span>
        </a>

        <div class="site-header__links">
          <a routerLink="/products" routerLinkActive="is-active" class="site-header__link">
            Products
          </a>
          <a routerLink="/posts" routerLinkActive="is-active" class="site-header__link">
            Posts
          </a>
          <a routerLink="/todos" routerLinkActive="is-active" class="site-header__link">
            Todos
          </a>
        </div>

        <div class="site-header__actions">
          <ng-container *ngIf="isAuthenticated(); else signInLink">
            <span class="site-header__user">{{ displayName() }}</span>
            <button
              igxButton="outlined"
              type="button"
              (click)="onLogout()"
              class="outline-button"
            >
              Logout
            </button>
          </ng-container>

          <ng-template #signInLink>
            <a routerLink="/auth/login" class="primary-button">
              Sign in
            </a>
          </ng-template>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    .site-header {
      position: sticky;
      top: 0;
      z-index: 20;
      border-bottom: 1px solid var(--app-border-soft);
      background: rgb(255 255 255 / 94%);
      backdrop-filter: blur(10px);
    }

    .site-header__nav {
      display: flex;
      width: min(100% - 2rem, 1120px);
      height: 4rem;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      margin-inline: auto;
    }

    .brand,
    .site-header__links,
    .site-header__actions {
      display: flex;
      align-items: center;
    }

    .brand {
      gap: 0.75rem;
    }

    .brand__mark {
      display: grid;
      width: 2.25rem;
      height: 2.25rem;
      place-items: center;
      border-radius: var(--app-radius);
      color: #fff;
      background: var(--app-text);
      font-size: 0.82rem;
      font-weight: 800;
    }

    .brand__name {
      color: var(--app-text);
      font-size: 1.1rem;
      font-weight: 800;
    }

    .site-header__links {
      gap: 1.5rem;
    }

    .site-header__link {
      color: var(--app-text-muted);
      font-size: 0.9rem;
      font-weight: 700;
    }

    .site-header__link:hover,
    .site-header__link.is-active {
      color: var(--app-primary);
    }

    .site-header__actions {
      gap: 0.75rem;
    }

    .site-header__user {
      max-width: 10rem;
      overflow: hidden;
      color: var(--app-text-muted);
      font-size: 0.9rem;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    @media (max-width: 760px) {
      .site-header__links,
      .site-header__user {
        display: none;
      }
    }
  `],
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
