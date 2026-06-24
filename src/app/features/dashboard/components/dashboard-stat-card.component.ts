import { Component, input } from '@angular/core';

@Component({
  selector: 'app-dashboard-stat-card',
  standalone: true,
  template: `
    <article class="stat-card card">
      <div class="stat-card__inner">
        <div>
          <p class="stat-card__label">{{ label() }}</p>
          <p class="stat-card__value">{{ value() }}</p>
        </div>
        <div class="stat-card__badge" [class]="toneClass()">
          {{ code() }}
        </div>
      </div>
    </article>
  `,
  styles: [`
    .stat-card {
      padding: 1.5rem;
    }

    .stat-card__inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .stat-card__label,
    .stat-card__value {
      margin: 0;
    }

    .stat-card__label {
      color: var(--app-text-muted);
      font-size: 0.9rem;
      font-weight: 700;
    }

    .stat-card__value {
      margin-top: 0.5rem;
      font-size: 2rem;
      font-weight: 800;
    }

    .stat-card__badge {
      display: grid;
      width: 2.75rem;
      height: 2.75rem;
      place-items: center;
      border-radius: var(--app-radius);
      font-size: 0.88rem;
      font-weight: 800;
    }

    .tone-blue {
      color: var(--app-primary);
      background: #eaf3ff;
    }

    .tone-emerald {
      color: var(--app-success);
      background: #e8f8f1;
    }

    .tone-violet {
      color: var(--app-accent);
      background: #f2edff;
    }

    .tone-amber {
      color: var(--app-warning);
      background: #fff7e8;
    }
  `],
})
export class DashboardStatCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<number>();
  readonly code = input.required<string>();
  readonly tone = input<'blue' | 'emerald' | 'violet' | 'amber'>('blue');

  toneClass(): string {
    return `tone-${this.tone()}`;
  }
}
