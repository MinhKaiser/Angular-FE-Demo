import { Component, input } from '@angular/core';
import { IgxCardModule } from 'igniteui-angular/card';
import { IgxProgressBarModule } from 'igniteui-angular/progressbar';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  imports: [IgxCardModule, IgxProgressBarModule],
  template: `
    <igx-card class="loading-state">
      <igx-card-content class="loading-state__content">
        <strong>{{ title() }}</strong>
        <p>{{ message() }}</p>
        <igx-linear-bar [indeterminate]="true" type="info"></igx-linear-bar>
      </igx-card-content>
    </igx-card>
  `,
  styles: [`
    .loading-state {
      margin: 1rem 0;
      border-radius: 18px;
      box-shadow: none;
      border: 1px solid #dbeafe;
      background: linear-gradient(135deg, #fff 0%, #f8fbff 100%);
    }

    .loading-state__content {
      display: grid;
      gap: 0.75rem;
      padding: 1.1rem 1.2rem;
    }

    .loading-state__content strong,
    .loading-state__content p {
      margin: 0;
    }

    .loading-state__content p {
      color: var(--app-text-muted);
      line-height: 1.6;
    }
  `],
})
export class LoadingStateComponent {
  readonly title = input<string>('Loading data');
  readonly message = input<string>('Please wait while the latest data is being prepared.');
}
