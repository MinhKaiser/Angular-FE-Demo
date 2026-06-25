import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DevDiagnosticsComponent, HeaderComponent, FooterComponent } from '@shared/components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, DevDiagnosticsComponent],
  template: `
    <div class="app-layout">
      <app-header></app-header>
      <main class="app-main">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
      <app-dev-diagnostics></app-dev-diagnostics>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      min-height: 100vh;
      flex-direction: column;
    }

    .app-main {
      flex: 1;
    }
  `],
})
export class AppComponent {
  title = 'angular-store';
}
