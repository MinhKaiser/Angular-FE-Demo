import { Component, computed, input } from '@angular/core';
import { IgxBadgeModule } from 'igniteui-angular/badge';
import { IgxCardModule } from 'igniteui-angular/card';
import { IgxIconModule } from 'igniteui-angular/icon';

@Component({
  selector: 'app-dashboard-stat-card',
  imports: [IgxCardModule, IgxBadgeModule, IgxIconModule],
  template: `
    <igx-card class="stat-card">
      <igx-card-content class="stat-card__inner">

        <div>
          <p class="stat-card__label">{{ label() }}</p>
          <p class="stat-card__value">{{ value() }}</p>
        </div>

        <div class="stat-card__badge-shell" [class]="toneClass()">
          <igx-icon>{{ icon() }}</igx-icon>
          <span igxBadge>{{ code() }}</span>
        </div>

      </igx-card-content>
    </igx-card>
  `,
  styles: [`
    .stat-card {
      border-radius: 20px;
      box-shadow: none;
      border: 1px solid #dbe7f2;
      background: rgb(255 255 255 / 94%);
    }

    .stat-card__inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 1.35rem 1.5rem;
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

    .stat-card__badge-shell {
      position: relative;
      display: grid;
      width: 3.1rem;
      height: 3.1rem;
      place-items: center;
      border-radius: 18px;
    }

    .stat-card__badge-shell igx-icon {
      font-size: 1.35rem;
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
  readonly icon = input<string>('insights');

  readonly toneClass = computed(() => `tone-${this.tone()}`);

}