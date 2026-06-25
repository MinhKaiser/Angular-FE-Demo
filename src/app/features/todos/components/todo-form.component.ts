import { Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { IgxButtonDirective } from 'igniteui-angular/directives';
import { IgxIconModule } from 'igniteui-angular/icon';
import { IgxInputGroupModule } from 'igniteui-angular/input-group';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [ReactiveFormsModule, IgxButtonDirective, IgxIconModule, IgxInputGroupModule],
  template: `
    <form (ngSubmit)="submitTodo()" class="todo-form card">
      <igx-input-group type="box" class="todo-form__input">
        <igx-icon igxPrefix>playlist_add_check_circle</igx-icon>
        <label igxLabel>Add a new todo</label>
        <input
          igxInput
          type="text"
          [formControl]="todoControl"
          autocomplete="off"
        />
      </igx-input-group>
      <button
        igxButton="contained"
        type="submit"
        class="primary-button todo-form__button"
        [disabled]="todoControl.invalid || isSaving()"
      >
        <igx-icon>add_task</igx-icon>
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

    .todo-form__button {
      display: inline-flex;
      gap: 0.5rem;
      align-items: center;
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
