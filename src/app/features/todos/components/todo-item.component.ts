import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Todo } from '@shared/models';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <input
        #completedInput
        type="checkbox"
        [checked]="todo().completed"
        [disabled]="isUpdating()"
        (change)="toggle.emit(completedInput.checked)"
        class="h-5 w-5 rounded border-slate-300 text-violet-700 focus:ring-violet-600"
      />

      <span
        class="text-sm text-slate-900"
        [class.line-through]="todo().completed"
        [class.text-slate-400]="todo().completed"
      >
        {{ todo().todo }}
      </span>

      <button
        type="button"
        (click)="deleteTodo.emit()"
        [disabled]="isUpdating()"
        class="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:text-slate-400"
      >
        Delete
      </button>
    </article>
  `,
})
export class TodoItemComponent {
  readonly todo = input.required<Todo>();
  readonly isUpdating = input(false);
  readonly toggle = output<boolean>();
  readonly deleteTodo = output<void>();
}
