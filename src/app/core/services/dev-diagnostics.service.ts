import { Injectable, OnDestroy, computed, inject, signal } from '@angular/core';
import {
  Event as RouterEvent,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  Router,
} from '@angular/router';
import { Subscription } from 'rxjs';
import { getEnvironmentConfig } from './environment.service';

export type DiagnosticLevel = 'error' | 'warning' | 'info';
export type DiagnosticSource = 'runtime' | 'http' | 'promise' | 'router' | 'system';
export type DiagnosticFilter = DiagnosticSource | 'all';
export type DiagnosticLevelFilter = DiagnosticLevel | 'all';

export interface DiagnosticEntry {
  id: number;
  source: DiagnosticSource;
  level: DiagnosticLevel;
  message: string;
  route: string;
  timestamp: string;
  details?: string;
  count: number;
}

interface DiagnosticsSnapshot {
  autoClearOnNavigation: boolean;
  entries: DiagnosticEntry[];
  isHidden: boolean;
  isExpanded: boolean;
  persistLogs: boolean;
}

const STORAGE_KEY = 'app_dev_diagnostics_v1';

@Injectable({
  providedIn: 'root',
})
export class DevDiagnosticsService implements OnDestroy {
  private readonly config = getEnvironmentConfig();
  private readonly persistenceAvailable = typeof sessionStorage !== 'undefined';
  private readonly router = inject(Router);
  private readonly subscriptions = new Subscription();
  private nextId = 1;
  private initialized = false;
  private readonly keydownHandler = (event: KeyboardEvent): void => {
    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'd') {
      event.preventDefault();
      this.isHidden() ? this.show() : this.toggle();
    }
  };
  private readonly unhandledRejectionHandler = (event: PromiseRejectionEvent): void => {
    this.reportPromise(event.reason);
  };
  private readonly windowErrorHandler = (event: ErrorEvent): void => {
    if (event.error) {
      return;
    }

    this.pushEntry({
      source: 'system',
      level: 'error',
      message: event.message || 'Unknown window error',
      details: `${event.filename ?? ''}:${event.lineno ?? 0}:${event.colno ?? 0}`,
    });
  };

  readonly enabled = signal(this.config.debug);
  readonly isHidden = signal(false);
  readonly isExpanded = signal(true);
  readonly persistLogs = signal(true);
  readonly autoClearOnNavigation = signal(false);
  readonly sourceFilter = signal<DiagnosticFilter>('all');
  readonly levelFilter = signal<DiagnosticLevelFilter>('all');
  readonly searchTerm = signal('');
  readonly entries = signal<DiagnosticEntry[]>([]);

  readonly filteredEntries = computed(() => {
    const source = this.sourceFilter();
    const level = this.levelFilter();
    const term = this.searchTerm().trim().toLowerCase();

    return this.entries().filter((entry) => {
      const matchesSource = source === 'all' || entry.source === source;
      const matchesLevel = level === 'all' || entry.level === level;
      const haystack = `${entry.message}\n${entry.details ?? ''}\n${entry.route}`.toLowerCase();
      const matchesSearch = !term || haystack.includes(term);
      return matchesSource && matchesLevel && matchesSearch;
    });
  });

  readonly errorCount = computed(() =>
    this.entries().reduce((total, entry) => total + entry.count, 0),
  );

  readonly activeSummary = computed(() => ({
    total: this.entries().length,
    filtered: this.filteredEntries().length,
  }));

  constructor() {
    this.initialize();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();

    if (typeof window === 'undefined') {
      return;
    }

    window.removeEventListener('keydown', this.keydownHandler);
    window.removeEventListener('unhandledrejection', this.unhandledRejectionHandler);
    window.removeEventListener('error', this.windowErrorHandler);
  }

  reportRuntime(error: unknown): void {
    this.pushEntry({
      source: 'runtime',
      level: 'error',
      message: this.getErrorMessage(error),
      details: this.stringifyDetails(error),
    });
  }

  reportPromise(reason: unknown): void {
    this.pushEntry({
      source: 'promise',
      level: 'error',
      message: this.getErrorMessage(reason),
      details: this.stringifyDetails(reason),
    });
  }

  reportHttp(error: { status: number; message: string; url: string | null; raw: unknown }): void {
    this.pushEntry({
      source: 'http',
      level: 'error',
      message: `[${error.status}] ${error.message}`,
      details: `URL: ${error.url ?? 'unknown'}\nPayload: ${this.stringifyDetails(error.raw)}`,
    });
  }

  clear(): void {
    this.entries.set([]);
    this.saveState();
  }

  hide(): void {
    this.isHidden.set(true);
    this.saveState();
  }

  show(): void {
    this.isHidden.set(false);
    this.isExpanded.set(true);
    this.saveState();
  }

  toggle(): void {
    this.isExpanded.update((value) => !value);
    this.saveState();
  }

  remove(entryId: number): void {
    this.entries.update((entries) => entries.filter((entry) => entry.id !== entryId));
    this.saveState();
  }

  setSourceFilter(filter: DiagnosticFilter): void {
    this.sourceFilter.set(filter);
  }

  setLevelFilter(filter: DiagnosticLevelFilter): void {
    this.levelFilter.set(filter);
  }

  setSearchTerm(value: string): void {
    this.searchTerm.set(value);
  }

  togglePersistLogs(): void {
    this.persistLogs.update((value) => !value);
    this.saveState();
  }

  toggleAutoClearOnNavigation(): void {
    this.autoClearOnNavigation.update((value) => !value);
    this.saveState();
  }

  async copyEntry(entryId: number): Promise<boolean> {
    const entry = this.entries().find((item) => item.id === entryId);
    if (!entry) {
      return false;
    }

    return this.copyText(this.formatEntry(entry));
  }

  async copyFilteredEntries(): Promise<boolean> {
    if (!this.filteredEntries().length) {
      return false;
    }

    const text = this.filteredEntries()
      .map((entry) => this.formatEntry(entry))
      .join('\n\n');
    return this.copyText(text);
  }

  private initialize(): void {
    if (this.initialized || !this.enabled()) {
      return;
    }

    this.initialized = true;
    this.restoreState();
    this.bindGlobalListeners();
    this.bindRouterEvents();
  }

  private bindGlobalListeners(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.addEventListener('keydown', this.keydownHandler);
    window.addEventListener('unhandledrejection', this.unhandledRejectionHandler);
    window.addEventListener('error', this.windowErrorHandler);
  }

  private bindRouterEvents(): void {
    this.subscriptions.add(
      this.router.events.subscribe((event: RouterEvent) => {
        if (event instanceof NavigationEnd && this.autoClearOnNavigation()) {
          this.clear();
          this.pushEntry({
            source: 'router',
            level: 'info',
            message: `Diagnostics reset after navigation to ${event.urlAfterRedirects}`,
          });
          return;
        }

        if (event instanceof NavigationError) {
          this.pushEntry({
            source: 'router',
            level: 'error',
            message: `Navigation failed for ${event.url}`,
            details: this.stringifyDetails(event.error),
          });
          return;
        }

        if (event instanceof NavigationCancel) {
          this.pushEntry({
            source: 'router',
            level: 'warning',
            message: `Navigation canceled for ${event.url}`,
            details: event.reason,
          });
        }
      }),
    );
  }

  private pushEntry(input: Omit<DiagnosticEntry, 'id' | 'route' | 'timestamp' | 'count'>): void {
    if (!this.enabled()) {
      return;
    }

    const route = this.router.url || '/';
    const timestamp = new Date().toLocaleTimeString();

    this.entries.update((entries) => {
      const existing = entries.find(
        (entry) =>
          entry.source === input.source &&
          entry.level === input.level &&
          entry.message === input.message &&
          entry.route === route,
      );

      if (existing) {
        return entries.map((entry) => {
          if (entry.id !== existing.id) {
            return entry;
          }

          const updatedEntry = { ...entry, count: entry.count + 1, timestamp };
          return input.details === undefined
            ? updatedEntry
            : { ...updatedEntry, details: input.details };
        });
      }

      const entry: DiagnosticEntry = {
        id: this.nextId++,
        route,
        timestamp,
        count: 1,
        ...input,
      };

      return [entry, ...entries].slice(0, 50);
    });

    this.saveState();
  }

  private restoreState(): void {
    if (!this.persistenceAvailable) {
      return;
    }

    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return;
      }

      const snapshot = JSON.parse(raw) as Partial<DiagnosticsSnapshot>;
      this.isHidden.set(snapshot.isHidden ?? false);
      this.isExpanded.set(snapshot.isExpanded ?? true);
      this.persistLogs.set(snapshot.persistLogs ?? true);
      this.autoClearOnNavigation.set(snapshot.autoClearOnNavigation ?? false);

      if (snapshot.persistLogs && Array.isArray(snapshot.entries)) {
        this.entries.set(snapshot.entries);
        this.nextId = snapshot.entries.reduce((max, entry) => Math.max(max, entry.id), 0) + 1;
      }
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }

  private saveState(): void {
    if (!this.persistenceAvailable) {
      return;
    }

    const snapshot: DiagnosticsSnapshot = {
      isHidden: this.isHidden(),
      isExpanded: this.isExpanded(),
      persistLogs: this.persistLogs(),
      autoClearOnNavigation: this.autoClearOnNavigation(),
      entries: this.persistLogs() ? this.entries() : [],
    };

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  }

  private async copyText(text: string): Promise<boolean> {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      this.pushEntry({
        source: 'system',
        level: 'info',
        message: 'Diagnostics copied to clipboard',
      });
      return true;
    } catch (error) {
      this.pushEntry({
        source: 'system',
        level: 'warning',
        message: 'Could not copy diagnostics to clipboard',
        details: this.stringifyDetails(error),
      });
      return false;
    }
  }

  private formatEntry(entry: DiagnosticEntry): string {
    return [
      `[${entry.timestamp}] ${entry.source.toUpperCase()} ${entry.route} x${entry.count}`,
      entry.message,
      entry.details ?? '',
    ]
      .filter(Boolean)
      .join('\n');
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    return String(error);
  }

  private stringifyDetails(value: unknown): string {
    if (value instanceof Error && value.stack) {
      return value.stack;
    }

    if (typeof value === 'string') {
      return value;
    }

    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }
}
