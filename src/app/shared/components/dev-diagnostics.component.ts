import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DevDiagnosticsService,
  type DiagnosticEntry,
  type DiagnosticFilter,
  type DiagnosticLevelFilter,
} from '@core/services';
import { IgxButtonDirective } from 'igniteui-angular/directives';
import { IgxIconModule } from 'igniteui-angular/icon';

@Component({
  selector: 'app-dev-diagnostics',
  imports: [CommonModule, FormsModule, IgxButtonDirective, IgxIconModule],
  template: `
    @if (diagnostics.enabled()) {
      <section class="dev-diagnostics">
        
        @if (diagnostics.isHidden()) {
          <button
            type="button"
            igxButton="contained"
            class="dev-diagnostics__launcher"
            (click)="diagnostics.show()"
          >
            <igx-icon>bug_report</igx-icon>
            Open diagnostics
            <span class="dev-diagnostics__count">{{ diagnostics.errorCount() }}</span>
          </button>
        } @else {

          <button
            type="button"
            igxButton="contained"
            class="dev-diagnostics__toggle"
            (click)="diagnostics.toggle()"
          >
            <igx-icon>{{ diagnostics.isExpanded() ? 'bug_report' : 'terminal' }}</igx-icon>
            Dev diagnostics
            <span class="dev-diagnostics__count">{{ diagnostics.errorCount() }}</span>
          </button>

          @if (diagnostics.isExpanded()) {
            <div class="dev-diagnostics__panel card">
              
              <div class="dev-diagnostics__header">
                <div>
                  <strong>Live FE diagnostics</strong>
                  <p>
                    {{ diagnostics.activeSummary().filtered }} /
                    {{ diagnostics.activeSummary().total }} entries shown
                  </p>
                </div>

                <div class="dev-diagnostics__actions">
                  <button type="button" igxButton="flat" (click)="copyAll()">Copy all</button>
                  <button type="button" igxButton="flat" (click)="diagnostics.clear()">Clear</button>
                  <button type="button" igxButton="flat" (click)="diagnostics.hide()">Hide</button>
                </div>
              </div>

              <div class="dev-diagnostics__toolbar">
                <input
                  class="field dev-diagnostics__search"
                  type="search"
                  placeholder="Search message, route, details"
                  [ngModel]="diagnostics.searchTerm()"
                  (ngModelChange)="diagnostics.setSearchTerm($event)"
                />

                <div class="dev-diagnostics__filters">
                  @for (filter of sourceFilters; track filter) {
                    <button
                      type="button"
                      igxButton="flat"
                      class="dev-diagnostics__filter"
                      [class.is-active]="diagnostics.sourceFilter() === filter"
                      (click)="diagnostics.setSourceFilter(filter)"
                    >
                      {{ filter }}
                    </button>
                  }
                </div>

                <div class="dev-diagnostics__filters">
                  @for (filter of levelFilters; track filter) {
                    <button
                      type="button"
                      igxButton="flat"
                      class="dev-diagnostics__filter"
                      [class.is-active]="diagnostics.levelFilter() === filter"
                      (click)="diagnostics.setLevelFilter(filter)"
                    >
                      {{ filter }}
                    </button>
                  }
                </div>

                <div class="dev-diagnostics__toggles">
                  <label class="dev-diagnostics__checkbox">
                    <input
                      type="checkbox"
                      [checked]="diagnostics.persistLogs()"
                      (change)="diagnostics.togglePersistLogs()"
                    />
                    Keep logs after reload
                  </label>

                  <label class="dev-diagnostics__checkbox">
                    <input
                      type="checkbox"
                      [checked]="diagnostics.autoClearOnNavigation()"
                      (change)="diagnostics.toggleAutoClearOnNavigation()"
                    />
                    Auto-clear on navigation
                  </label>
                </div>
              </div>

              @if (diagnostics.filteredEntries().length === 0) {
                <div class="dev-diagnostics__empty">
                  No diagnostics match the current filters.
                </div>
              }

              @for (entry of diagnostics.filteredEntries(); track entry.id) {
                <article class="dev-diagnostics__entry">

                  <div class="dev-diagnostics__entry-top">
                    <div class="dev-diagnostics__badges">
                      <span class="dev-diagnostics__badge">{{ entry.source }}</span>
                      <span class="dev-diagnostics__badge">{{ entry.level }}</span>
                      <span class="dev-diagnostics__badge">{{ entry.timestamp }}</span>
                      <span class="dev-diagnostics__badge">{{ entry.route }}</span>

                      @if (entry.count > 1) {
                        <span class="dev-diagnostics__badge">x{{ entry.count }}</span>
                      }
                    </div>

                    <div class="dev-diagnostics__entry-actions">
                      <button type="button" igxButton="flat" (click)="copyEntry(entry)">Copy</button>
                      <button type="button" igxButton="flat" (click)="diagnostics.remove(entry.id)">
                        Dismiss
                      </button>
                    </div>
                  </div>

                  <p class="dev-diagnostics__message">{{ entry.message }}</p>

                  @if (entry.details) {
                    <details class="dev-diagnostics__details-wrap">
                      <summary>Details</summary>
                      <pre class="dev-diagnostics__details">{{ entry.details }}</pre>
                    </details>
                  }

                </article>
              }

            </div>
          }
        }

      </section>
    }
  `,
  styles: [`
    .dev-diagnostics {
      position: fixed;
      right: 1rem;
      bottom: 1rem;
      z-index: 60;
      display: grid;
      justify-items: end;
      gap: 0.75rem;
      width: min(100% - (var(--app-shell-gutter) * 2), 48rem);
    }

    .dev-diagnostics__launcher,
    .dev-diagnostics__toggle {
      display: inline-flex;
      gap: 0.5rem;
      align-items: center;
      border-radius: 999px;
      box-shadow: 0 10px 30px rgb(15 23 42 / 18%);
    }

    .dev-diagnostics__launcher {
      background: linear-gradient(135deg, #111827 0%, #be123c 100%);
    }

    .dev-diagnostics__count {
      display: inline-grid;
      min-width: 1.5rem;
      height: 1.5rem;
      place-items: center;
      border-radius: 999px;
      background: rgb(255 255 255 / 18%);
      font-size: 0.78rem;
    }

    .dev-diagnostics__panel {
      width: 100%;
      max-height: min(78vh, 46rem);
      overflow: auto;
      padding: 1rem;
      border-color: #fecaca;
      background: #fffafb;
      box-shadow: 0 24px 50px rgb(15 23 42 / 20%);
    }

    .dev-diagnostics__header,
    .dev-diagnostics__entry-top {
      display: flex;
      align-items: start;
      justify-content: space-between;
      gap: 1rem;
    }

    .dev-diagnostics__header strong,
    .dev-diagnostics__header p,
    .dev-diagnostics__message {
      margin: 0;
    }

    .dev-diagnostics__header p {
      margin-top: 0.3rem;
      color: var(--app-text-muted);
      font-size: 0.88rem;
    }

    .dev-diagnostics__actions,
    .dev-diagnostics__entry-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem;
    }

    .dev-diagnostics__toolbar {
      display: grid;
      gap: 0.8rem;
      margin: 1rem 0;
    }

    .dev-diagnostics__search {
      min-height: 2.75rem;
    }

    .dev-diagnostics__filters,
    .dev-diagnostics__toggles,
    .dev-diagnostics__badges {
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem;
    }

    .dev-diagnostics__filter {
      border: 1px solid #f3d6da;
      border-radius: 999px;
      background: #fff;
      text-transform: capitalize;
    }

    .dev-diagnostics__filter.is-active {
      border-color: #be123c;
      color: #fff;
      background: #be123c;
    }

    .dev-diagnostics__checkbox {
      display: inline-flex;
      gap: 0.45rem;
      align-items: center;
      color: var(--app-text-muted);
      font-size: 0.86rem;
    }

    .dev-diagnostics__empty {
      padding: 0.9rem 0;
      color: var(--app-text-muted);
      font-size: 0.9rem;
    }

    .dev-diagnostics__entry + .dev-diagnostics__entry {
      margin-top: 0.85rem;
      padding-top: 0.85rem;
      border-top: 1px solid #f3d6da;
    }

    .dev-diagnostics__badge {
      display: inline-flex;
      align-items: center;
      min-height: 1.5rem;
      padding: 0.1rem 0.5rem;
      border-radius: 999px;
      background: #fde7ea;
      color: #9f1239;
      font-size: 0.76rem;
      font-weight: 700;
    }

    .dev-diagnostics__message {
      margin-top: 0.55rem;
      color: #111827;
      font-size: 0.92rem;
      font-weight: 700;
      line-height: 1.5;
      word-break: break-word;
    }

    .dev-diagnostics__details-wrap {
      margin-top: 0.55rem;
    }

    .dev-diagnostics__details-wrap summary {
      cursor: pointer;
      color: #9f1239;
      font-size: 0.84rem;
      font-weight: 700;
    }

    .dev-diagnostics__details {
      overflow: auto;
      margin: 0.55rem 0 0;
      padding: 0.75rem;
      border-radius: 12px;
      background: #111827;
      color: #f8fafc;
      font-size: 0.78rem;
      line-height: 1.45;
      white-space: pre-wrap;
      word-break: break-word;
    }

    @media (max-width: 720px) {
      .dev-diagnostics {
        right: var(--app-shell-gutter);
        left: var(--app-shell-gutter);
        width: auto;
      }

      .dev-diagnostics__panel {
        max-height: 65vh;
      }

      .dev-diagnostics__launcher,
      .dev-diagnostics__toggle {
        width: 100%;
        justify-content: center;
      }

      .dev-diagnostics__header,
      .dev-diagnostics__entry-top {
        display: grid;
      }
    }

    @media (max-width: 560px) {
      .dev-diagnostics {
        bottom: 0.75rem;
        gap: 0.5rem;
      }

      .dev-diagnostics__panel {
        max-height: min(68vh, calc(100dvh - 5.5rem));
        padding: 0.85rem;
      }

      .dev-diagnostics__actions,
      .dev-diagnostics__entry-actions {
        width: 100%;
      }
    }
  `],
})
export class DevDiagnosticsComponent {
  protected readonly diagnostics = inject(DevDiagnosticsService);
  protected readonly sourceFilters: DiagnosticFilter[] = ['all', 'runtime', 'http', 'promise', 'router', 'system'];
  protected readonly levelFilters: DiagnosticLevelFilter[] = ['all', 'error', 'warning', 'info'];

  copyEntry(entry: DiagnosticEntry): void {
    void this.diagnostics.copyEntry(entry.id);
  }

  copyAll(): void {
    void this.diagnostics.copyFilteredEntries();
  }
}
