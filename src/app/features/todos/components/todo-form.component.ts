import { Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form (ngSubmit)="submitTodo()" class="mb-6 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[1fr_auto]">
      <input
        type="text"
        [formControl]="todoControl"
        class="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100"
        placeholder="Add a new todo"
      />
      <button
        type="submit"
        class="rounded-md bg-violet-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:bg-slate-400"
        [disabled]="todoControl.invalid || isSaving()"
      >
        Add todo
      </button>
    </form>
  `,
})
export class TodoFormComponent {
  readonly isSaving = input(false);
  readonly addTodo = output<string>();

  readonly todoControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(120)],
  });

  submitTodo(): void {
    if (this.todoControl.invalid) {
      this.todoControl.markAsTouched();
      return;
    }

    this.addTodo.emit(this.todoControl.value);
    this.todoControl.reset('');
  }
}
