import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { IgxButtonDirective } from 'igniteui-angular/directives';
import { IgxIconModule } from 'igniteui-angular/icon';
import { IgxInputGroupModule } from 'igniteui-angular/input-group';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todo-form',
  imports: [ReactiveFormsModule, IgxButtonDirective, IgxIconModule, IgxInputGroupModule],
  template: `
    <form (ngSubmit)="submitTodo()" class="todo-form card">
      <igx-input-group type="box" class="todo-form__input">
        <igx-icon igxPrefix>playlist_add_check_circle</igx-icon>
        <label igxLabel>Add a new todo</label>
        <input #todoInput igxInput type="text" [formControl]="todoControl" autocomplete="off" />
      </igx-input-group>
      <p class="todo-form__hint">{{ remainingCharacters() }} characters remaining</p>
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
  styles: [
    `
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
        justify-content: center;
      }

      .todo-form__hint {
        grid-column: 1 / 2;
        margin: -0.25rem 0 0;
        color: var(--app-text-muted);
        font-size: 0.8rem;
      }

      @media (max-width: 560px) {
        .todo-form {
          grid-template-columns: 1fr;
        }

        .todo-form__hint {
          grid-column: auto;
        }

        .todo-form__button {
          width: 100%;
        }
      }
    `,
  ],
})
export class TodoFormComponent implements AfterViewInit {
  private readonly router = inject(Router);

  readonly isSaving = input(false);
  readonly addTodo = output<string>();

  readonly todoControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(120)],
  });
  private readonly todoValue = toSignal(this.todoControl.valueChanges, {
    initialValue: this.todoControl.value,
  });
  readonly remainingCharacters = computed(() => Math.max(0, 120 - this.todoValue().length));

  @ViewChild('todoInput') private todoInput?: ElementRef<HTMLInputElement>;

  ngAfterViewInit(): void {
    if (this.router.url.includes('/todos')) {
      queueMicrotask(() => this.todoInput?.nativeElement.focus());
    }
  }

  submitTodo(): void {
    if (this.todoControl.invalid) {
      this.todoControl.markAsTouched();
      return;
    }

    this.addTodo.emit(this.todoControl.value.trim());
    this.todoControl.reset('');
  }
}
