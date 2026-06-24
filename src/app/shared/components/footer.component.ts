import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="site-footer">
      <div class="site-footer__inner">
        <p>Dummy Shop training app</p>
        <div class="site-footer__links">
          <a routerLink="/products">Products</a>
          <a routerLink="/posts">Posts</a>
          <a routerLink="/todos">Todos</a>
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

    .site-footer__inner p {
      margin: 0;
    }

    .site-footer__links {
      display: flex;
      gap: 1rem;
    }

    .site-footer__links a:hover {
      color: var(--app-text);
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
