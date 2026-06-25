import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { IgxCardModule } from 'igniteui-angular/card';
import { IgxIconModule } from 'igniteui-angular/icon';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, IgxCardModule, IgxIconModule],
  template: `
    <igx-card class="empty-state-card">
      <igx-card-content class="empty-state-card__content">
        <div class="empty-state-card__icon">
          <igx-icon>{{ icon() }}</igx-icon>
        </div>
        <div>
          <h3>{{ title() }}</h3>
          <p>{{ description() }}</p>
        </div>
      </igx-card-content>
    </igx-card>
  `,
  styles: [`
    .empty-state-card {
      border-radius: 20px;
      box-shadow: none;
      border: 1px dashed #cbd5e1;
      background: linear-gradient(180deg, #fff 0%, #f8fafc 100%);
    }

    .empty-state-card__content {
      display: grid;
      gap: 1rem;
      justify-items: center;
      padding: 1.75rem 1.25rem;
      text-align: center;
    }

    .empty-state-card__icon {
      display: grid;
      width: 3rem;
      height: 3rem;
      place-items: center;
      border-radius: 999px;
      color: var(--app-primary);
      background: #eff6ff;
    }

    .empty-state-card h3,
    .empty-state-card p {
      margin: 0;
    }

    .empty-state-card h3 {
      font-size: 1.05rem;
    }

    .empty-state-card p {
      margin-top: 0.45rem;
      color: var(--app-text-muted);
      line-height: 1.6;
    }
  `],
})
export class EmptyStateComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly icon = input<string>('search_off');
}
