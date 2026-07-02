import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IgxButtonDirective } from 'igniteui-angular/directives';
import { IgxIconModule } from 'igniteui-angular/icon';

@Component({
  selector: 'app-page-back-link',
  imports: [RouterLink, IgxButtonDirective, IgxIconModule],
  template: `
    <a [routerLink]="to()" igxButton="flat" class="page-back-link">
      <igx-icon>arrow_back</igx-icon>
      {{ label() }}
    </a>
  `,
  styles: [
    `
      .page-back-link {
        display: inline-flex;
        gap: 0.45rem;
        align-items: center;
        margin-bottom: 1.5rem;
        color: var(--section-color, var(--app-primary));
        font-size: 0.9rem;
        font-weight: 700;
        text-decoration: none;
      }

      @media (max-width: 560px) {
        .page-back-link {
          min-height: 2.5rem;
          white-space: normal;
        }
      }
    `,
  ],
})
export class PageBackLinkComponent {
  readonly to = input.required<string>();
  readonly label = input('Back');
}
