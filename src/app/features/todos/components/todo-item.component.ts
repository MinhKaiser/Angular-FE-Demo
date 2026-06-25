import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Todo } from '@shared/models';
import { IgxButtonDirective } from 'igniteui-angular/directives';
import { IgxCheckboxModule } from 'igniteui-angular/checkbox';
import { IgxIconModule } from 'igniteui-angular/icon';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, IgxButtonDirective, IgxCheckboxModule, IgxIconModule],
  template: `
    <article class="todo-item card">
      <igx-checkbox
        [checked]="todo().completed"
        [disabled]="isUpdating()"
        (click)="toggle.emit(!todo().completed)"
        class="todo-item__checkbox"
      >
      </igx-checkbox>

      <span
        class="todo-item__text"
        [class.todo-item__text--done]="todo().completed"
      >
        {{ todo().todo }}
      </span>

      <button
        igxButton="outlined"
        type="button"
        (click)="deleteTodo.emit()"
        [disabled]="isUpdating()"
        class="outline-button todo-item__delete"
      >
        <igx-icon>delete</igx-icon>
        Delete
      </button>
    </article>
  `,
  styles: [`
    .todo-item {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
    }

    .todo-item__text {
      color: var(--app-text);
      font-size: 0.94rem;
    }

    .todo-item__text--done {
      color: #94a3b8;
      text-decoration: line-through;
    }

    .todo-item__delete {
      display: inline-flex;
      gap: 0.35rem;
      align-items: center;
      min-height: 2rem;
      padding: 0.35rem 0.75rem;
      font-size: 0.78rem;
    }
  `],
})
export class TodoItemComponent {
  readonly todo = input.required<Todo>();
  readonly isUpdating = input(false);
  readonly toggle = output<boolean>();
  readonly deleteTodo = output<void>();
}
