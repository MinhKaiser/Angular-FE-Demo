import { Component, input } from '@angular/core';

@Component({
  selector: 'app-dashboard-stat-card',
  standalone: true,
  template: `
    <article class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-slate-500">{{ label() }}</p>
          <p class="mt-2 text-3xl font-bold text-slate-950">{{ value() }}</p>
        </div>
        <div [class]="badgeClass()">
          {{ code() }}
        </div>
      </div>
    </article>
  `,
})
export class DashboardStatCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<number>();
  readonly code = input.required<string>();
  readonly tone = input<'blue' | 'emerald' | 'violet' | 'amber'>('blue');

  badgeClass(): string {
    const classes = {
      blue: 'bg-blue-50 text-blue-700',
      emerald: 'bg-emerald-50 text-emerald-700',
      violet: 'bg-violet-50 text-violet-700',
      amber: 'bg-amber-50 text-amber-700',
    };

    return `flex h-11 w-11 items-center justify-center rounded-md text-sm font-bold ${classes[this.tone()]}`;
  }
}
