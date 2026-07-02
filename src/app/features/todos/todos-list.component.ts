import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  EmptyStateComponent,
  LoadingStateComponent,
  PageSectionHeaderComponent,
  StatusBannerComponent,
} from '@shared/components';
import { TodoFormComponent } from './components/todo-form.component';
import { TodoItemComponent } from './components/todo-item.component';
import { TodosStore, type TodosStoreInstance } from './state/todos.store';

@Component({
  selector: 'app-todos-list',
  imports: [
    CommonModule,
    TodoFormComponent,
    TodoItemComponent,
    StatusBannerComponent,
    LoadingStateComponent,
    EmptyStateComponent,
    PageSectionHeaderComponent,
  ],
  providers: [TodosStore],
  template: `
    <section class="app-page todos-page">
      <div class="app-shell app-shell--compact">
        <app-page-section-header
          eyebrow="DummyJSON todos"
          title="My Todos"
          [meta]="
            store.completedCount() +
            ' of ' +
            store.todos().length +
            ' completed in your personal checklist.'
          "
          icon="task_alt"
          [chipLabel]="store.completedCount() + ' done'"
          chipVariant="warning"
        />

        <app-todo-form [isSaving]="store.isSaving()" (addTodo)="store.addTodo($event)" />

        @if (store.errorMessage()) {
          <app-status-banner tone="error" icon="error_outline" [message]="store.errorMessage()">
            <button
              type="button"
              class="outline-button"
              (click)="store.loadTodos()"
              [disabled]="store.isLoading()"
            >
              Try again
            </button>
          </app-status-banner>
        }

        @if (store.isLoading()) {
          <app-loading-state
            title="Loading todos"
            message="Your task list is syncing before the Ignite UI checklist appears."
          />
        }

        @if (!store.isLoading() && store.todos().length > 0) {
          <div class="todos-list">
            @for (todo of store.todos(); track todo.id) {
              <app-todo-item
                [todo]="todo"
                [isUpdating]="store.isUpdating(todo.id)"
                (toggle)="store.toggleTodo(todo, $event)"
                (deleteTodo)="store.deleteTodo(todo)"
              />
            }
          </div>
        }

        @if (!store.isLoading() && !store.errorMessage() && store.todos().length === 0) {
          <app-empty-state
            title="No todos found"
            description="Create the first task above and it will appear in the checklist."
            icon="task_alt"
          />
        }
      </div>
    </section>
  `,
  styles: [
    `
      .todos-page {
        --section-color: var(--app-accent);
        --section-color-dark: var(--app-accent-dark);
      }

      .todos-list {
        display: grid;
        gap: 0.5rem;
      }
    `,
  ],
})
export class TodosListComponent implements OnInit {
  protected readonly store: TodosStoreInstance = inject(TodosStore);

  ngOnInit(): void {
    this.store.loadTodos();
  }
}
