import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { IgxCardModule } from 'igniteui-angular/card';
import { IgxIconModule } from 'igniteui-angular/icon';

@Component({
  selector: 'app-status-banner',
  imports: [CommonModule, IgxCardModule, IgxIconModule],
  template: `
    <igx-card
      class="status-banner"
      [class]="'status-banner status-banner--' + tone()"
      [attr.role]="tone() === 'error' ? 'alert' : 'status'"
      [attr.aria-live]="tone() === 'error' ? 'assertive' : 'polite'"
    >
      <igx-card-content class="status-banner__content">
        <div class="status-banner__message">
          <igx-icon>{{ icon() }}</igx-icon>
          <span>{{ message() }}</span>
        </div>
        <ng-content />
      </igx-card-content>
    </igx-card>
  `,
  styles: [
    `
      .status-banner {
        margin-bottom: 1rem;
        border-width: 1px;
        border-style: solid;
        border-radius: 16px;
        box-shadow: none;
      }

      .status-banner__content {
        display: flex;
        gap: 0.75rem;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 1.1rem;
        font-weight: 600;
      }

      .status-banner__message {
        display: flex;
        gap: 0.75rem;
        align-items: center;
        min-width: 0;
      }

      .status-banner--error {
        color: #9f1239;
        background: #fff1f2;
        border-color: #fecdd3;
      }

      .status-banner--info {
        color: #1d4ed8;
        background: #eff6ff;
        border-color: #bfdbfe;
      }

      .status-banner--success {
        color: #047857;
        background: #ecfdf5;
        border-color: #a7f3d0;
      }

      @media (max-width: 560px) {
        .status-banner__content {
          align-items: stretch;
          flex-direction: column;
        }
      }
    `,
  ],
})
export class StatusBannerComponent {
  readonly message = input.required<string>();
  readonly tone = input<'error' | 'info' | 'success'>('info');
  readonly icon = input<string>('info');
}
