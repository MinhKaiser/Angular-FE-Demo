import { Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { IgxButtonDirective } from 'igniteui-angular/directives';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [ReactiveFormsModule, IgxButtonDirective],
  template: `
    <form (ngSubmit)="submitTodo()" class="todo-form card">
      <input
        type="text"
        [formControl]="todoControl"
        class="field"
        placeholder="Add a new todo"
      />
      <button
        igxButton="contained"
        type="submit"
        class="primary-button"
        [disabled]="todoControl.invalid || isSaving()"
      >
        Add todo
      </button>
    </form>
  `,
  styles: [`
    .todo-form {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      padding: 1rem;
    }

    @media (max-width: 560px) {
      .todo-form {
        grid-template-columns: 1fr;
      }
    }
  `],
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
