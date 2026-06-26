import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IgxChipsModule } from 'igniteui-angular/chips';
import { IgxIconModule } from 'igniteui-angular/icon';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, IgxChipsModule, IgxIconModule],
  template: `
    <footer class="site-footer">
      <div class="site-footer__inner">
        <div class="site-footer__brand">
          <igx-icon>widgets</igx-icon>
          <p>Dummy Shop training app</p>
        </div>
        <div class="site-footer__links">
          <a routerLink="/products"><igx-chip variant="info">Products</igx-chip></a>
          <a routerLink="/posts"><igx-chip variant="success">Posts</igx-chip></a>
          <a routerLink="/todos"><igx-chip variant="primary">Todos</igx-chip></a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .site-footer {
      border-top: 1px solid var(--app-border-soft);
      background: var(--app-surface);
    }

    .site-footer__inner {
      display: flex;
      width: min(100% - 2rem, 1120px);
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-inline: auto;
      padding-block: 1.5rem;
      color: var(--app-text-muted);
      font-size: 0.9rem;
    }

    .site-footer__brand,
    .site-footer__links {
      display: flex;
      align-items: center;
    }

    .site-footer__brand {
      gap: 0.6rem;
    }

    .site-footer__inner p {
      margin: 0;
    }

    .site-footer__links {
      gap: 1rem;
    }

    .site-footer__links a {
      text-decoration: none;
    }

    @media (max-width: 600px) {
      .site-footer__inner {
        align-items: flex-start;
        flex-direction: column;
      }
    }
  `],
})
export class FooterComponent {}
