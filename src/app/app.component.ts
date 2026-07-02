import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DevDiagnosticsComponent, HeaderComponent, FooterComponent } from '@shared/components';
import { environment } from '@env/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, DevDiagnosticsComponent],
  template: `
    <div class="app-layout">
      <app-header></app-header>
      <main class="app-main">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
      @defer (when diagnosticsEnabled) {
        <app-dev-diagnostics />
      }
    </div>
  `,
  styles: [
    `
      .app-layout {
        display: flex;
        min-height: 100vh;
        flex-direction: column;
      }

      .app-main {
        flex: 1;
        min-width: 0;
      }
    `,
  ],
})
export class AppComponent {
  protected readonly diagnosticsEnabled = !environment.production;
}
