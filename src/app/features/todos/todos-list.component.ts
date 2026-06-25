import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  EmptyStateComponent,
  LoadingStateComponent,
  PageSectionHeaderComponent,
  StatusBannerComponent,
} from '@shared/components';
import { Todo } from '@shared/models';
import { TodoFormComponent } from './components/todo-form.component';
import { TodoItemComponent } from './components/todo-item.component';
import { TodosStore, type TodosStoreInstance } from './state/todos.store';

@Component({
  selector: 'app-todos-list',
  standalone: true,
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
          [meta]="store.completedCount() + ' of ' + store.todos().length + ' completed in your personal checklist.'"
          icon="task_alt"
          [chipLabel]="store.completedCount() + ' done'"
          chipVariant="warning"
        />

        <app-todo-form
          [isSaving]="store.isSaving()"
          (addTodo)="store.addTodo($event)"
        />

        <app-status-banner
          *ngIf="store.errorMessage()"
          tone="error"
          icon="error_outline"
          [message]="store.errorMessage()"
        />

        <app-loading-state
          *ngIf="store.isLoading()"
          title="Loading todos"
          message="Your task list is syncing before the Ignite UI checklist appears."
        />

        <div *ngIf="!store.isLoading() && store.todos().length > 0" class="todos-list">
          <app-todo-item
            *ngFor="let todo of store.todos(); trackBy: trackByTodoId"
            [todo]="todo"
            [isUpdating]="store.isUpdating(todo.id)"
            (toggle)="store.toggleTodo(todo, $event)"
            (deleteTodo)="store.deleteTodo(todo)"
          />
        </div>

        <app-empty-state
          *ngIf="!store.isLoading() && store.todos().length === 0"
          title="No todos found"
          description="Create the first task above and it will appear in the checklist."
          icon="task_alt"
        />
      </div>
    </section>
  `,
  styles: [`
    .todos-page {
      --section-color: var(--app-accent);
      --section-color-dark: var(--app-accent-dark);
    }

    .todos-list {
      display: grid;
      gap: 0.5rem;
    }
  `],
})
export class TodosListComponent {
  protected readonly store: TodosStoreInstance = inject(TodosStore);

  trackByTodoId(_index: number, todo: Todo): number {
    return todo.id;
  }
}
