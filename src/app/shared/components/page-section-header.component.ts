import { CommonModule } from '@angular/common';
import { Component, contentChild, input } from '@angular/core';
import { IgxCardModule } from 'igniteui-angular/card';
import { IgxChipsModule } from 'igniteui-angular/chips';
import { IgxIconModule } from 'igniteui-angular/icon';
import { PageActionsDirective } from './page-actions.directive';

@Component({
  selector: 'app-page-section-header',
  imports: [CommonModule, IgxCardModule, IgxChipsModule, IgxIconModule],
  template: `
    <igx-card class="page-section-header">
      <igx-card-content class="page-section-header__content">
        <div class="page-section-header__copy">
          <div class="page-section-header__icon">
            <igx-icon>{{ icon() }}</igx-icon>
          </div>

          <div class="page-section-header__text">
            <p class="page-section-header__eyebrow">{{ eyebrow() }}</p>

            <div class="page-section-header__title-row">
              <h1>{{ title() }}</h1>

              @if (chipLabel()) {
                <igx-chip [variant]="chipVariant()">
                  {{ chipLabel() }}
                </igx-chip>
              }
            </div>

            <p class="page-section-header__meta">{{ meta() }}</p>
          </div>
        </div>

        @if (projectedActions()) {
          <div class="page-section-header__actions">
            <ng-content select="[page-actions]"></ng-content>
          </div>
        }
      </igx-card-content>
    </igx-card>
  `,
  styles: [
    `
      .page-section-header {
        margin-bottom: 1.5rem;
        border-radius: 24px;
        box-shadow: none;
        border: 1px solid #dce6f1;
        background:
          radial-gradient(circle at top right, rgb(59 130 246 / 0.1), transparent 16rem),
          linear-gradient(135deg, #fff 0%, #f8fbff 100%);
      }

      .page-section-header__content {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 32rem);
        gap: 1.25rem;
        align-items: center;
        padding: 1.4rem;
      }

      .page-section-header__copy {
        display: flex;
        gap: 1rem;
        align-items: flex-start;
        min-width: 0;
      }

      .page-section-header__icon {
        display: grid;
        width: 3.15rem;
        height: 3.15rem;
        flex: 0 0 auto;
        place-items: center;
        border-radius: 18px;
        color: var(--app-primary);
        background: #eaf3ff;
      }

      .page-section-header__text {
        min-width: 0;
      }

      .page-section-header__eyebrow,
      .page-section-header__meta,
      .page-section-header__text h1 {
        margin: 0;
      }

      .page-section-header__eyebrow {
        color: var(--app-text-muted);
        font-size: 0.78rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      .page-section-header__title-row {
        display: flex;
        gap: 0.75rem;
        align-items: center;
        margin-top: 0.35rem;
        flex-wrap: wrap;
      }

      .page-section-header__text h1 {
        font-size: clamp(1.8rem, 2vw, 2.35rem);
        line-height: 1.15;
        overflow-wrap: anywhere;
      }

      .page-section-header__meta {
        margin-top: 0.5rem;
        color: var(--app-text-muted);
        line-height: 1.7;
        max-width: 42rem;
      }

      .page-section-header__actions {
        width: 100%;
        min-width: 0;
        justify-self: end;
      }

      @media (max-width: 980px) {
        .page-section-header__content {
          grid-template-columns: 1fr;
          align-items: start;
        }

        .page-section-header__actions {
          justify-self: stretch;
        }
      }

      @media (max-width: 640px) {
        .page-section-header__content {
          gap: 1rem;
          padding: 1rem;
        }

        .page-section-header__copy {
          gap: 0.85rem;
        }

        .page-section-header__icon {
          width: 2.75rem;
          height: 2.75rem;
          border-radius: 14px;
        }

        .page-section-header__text h1 {
          font-size: clamp(1.6rem, 8vw, 2rem);
        }
      }
    `,
  ],
})
export class PageSectionHeaderComponent {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly meta = input.required<string>();
  readonly icon = input<string>('dashboard');
  readonly chipLabel = input<string>('');
  readonly chipVariant = input<'primary' | 'info' | 'success' | 'warning'>('primary');
  protected readonly projectedActions = contentChild(PageActionsDirective);
}
