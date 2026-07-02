import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@core/services';
import { IgxChipsModule } from 'igniteui-angular/chips';
import { IgxButtonDirective } from 'igniteui-angular/directives';
import { IgxIconModule } from 'igniteui-angular/icon';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    IgxChipsModule,
    IgxButtonDirective,
    IgxIconModule,
  ],
  template: `
    <header class="site-header">
      <nav class="site-header__nav">
        <a routerLink="/" class="brand">
          <span class="brand__mark">DJ</span>
          <span class="brand__name">Dummy Shop</span>
        </a>

        <div class="site-header__links">
          <a routerLink="/products" routerLinkActive="is-active" class="site-header__link">
            <igx-icon>inventory_2</igx-icon>
            Products
          </a>

          <a routerLink="/posts" routerLinkActive="is-active" class="site-header__link">
            <igx-icon>article</igx-icon>
            Posts
          </a>

          <a routerLink="/todos" routerLinkActive="is-active" class="site-header__link">
            <igx-icon>check_circle</igx-icon>
            Todos
          </a>
        </div>

        <div class="site-header__actions">
          @if (isAuthenticated()) {
            <igx-chip variant="primary" class="site-header__user">
              <igx-icon igxPrefix>person</igx-icon>
              {{ displayName() }}
            </igx-chip>

            <button igxButton="outlined" type="button" (click)="onLogout()" class="outline-button">
              <igx-icon>logout</igx-icon>
              Logout
            </button>
          } @else {
            <a
              routerLink="/auth/login"
              igxButton="contained"
              class="primary-button site-header__sign-in"
            >
              <igx-icon>login</igx-icon>
              Sign in
            </a>
          }
        </div>
      </nav>
    </header>
  `,
  styles: [
    `
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
        width: min(100% - (var(--app-shell-gutter) * 2), 1120px);
        align-items: center;
        justify-content: space-between;
        gap: 1.5rem;
        margin-inline: auto;
        padding-block: 0.85rem;
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
        min-width: 0;
        flex-wrap: wrap;
      }

      .site-header__link {
        display: inline-flex;
        gap: 0.4rem;
        align-items: center;
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
        flex-wrap: wrap;
        justify-content: flex-end;
      }

      .site-header__user {
        max-width: 10rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .outline-button,
      .site-header__sign-in {
        display: inline-flex;
        gap: 0.4rem;
        align-items: center;
      }

      @media (max-width: 900px) {
        .site-header__nav {
          flex-wrap: wrap;
          justify-content: flex-start;
        }

        .site-header__actions {
          width: 100%;
          justify-content: flex-start;
        }
      }

      @media (max-width: 760px) {
        .site-header__nav {
          gap: 1rem;
          padding-block: 0.75rem;
        }

        .site-header__links {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0.75rem;
          order: 3;
        }

        .site-header__link,
        .outline-button,
        .site-header__sign-in {
          justify-content: center;
        }

        .site-header__link {
          min-height: 2.75rem;
          padding: 0.65rem 0.75rem;
          border: 1px solid var(--app-border-soft);
          border-radius: 999px;
          background: rgb(255 255 255 / 88%);
        }

        .site-header__actions {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .site-header__user {
          display: none;
        }
      }

      @media (max-width: 520px) {
        .brand {
          min-width: 0;
        }

        .brand__name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .site-header__links,
        .site-header__actions {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
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
