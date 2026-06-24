import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Todo } from '@shared/models';
import { TodoFormComponent } from './components/todo-form.component';
import { TodoItemComponent } from './components/todo-item.component';
import { TodosStore, type TodosStoreInstance } from './state/todos.store';

@Component({
  selector: 'app-todos-list',
  standalone: true,
  imports: [CommonModule, TodoFormComponent, TodoItemComponent],
  providers: [TodosStore],
  template: `
    <section class="app-page todos-page">
      <div class="app-shell app-shell--compact">
        <div class="page-heading">
          <p class="page-heading__eyebrow">DummyJSON todos</p>
          <h1>My Todos</h1>
          <p class="page-heading__meta">{{ store.completedCount() }} of {{ store.todos().length }} completed</p>
        </div>

        <app-todo-form
          [isSaving]="store.isSaving()"
          (addTodo)="store.addTodo($event)"
        />

        <div *ngIf="store.errorMessage()" class="alert">
          {{ store.errorMessage() }}
        </div>

        <div *ngIf="store.isLoading()" class="spinner-wrap">
          <div class="spinner"></div>
        </div>

        <div *ngIf="!store.isLoading() && store.todos().length > 0" class="todos-list">
          <app-todo-item
            *ngFor="let todo of store.todos(); trackBy: trackByTodoId"
            [todo]="todo"
            [isUpdating]="store.isUpdating(todo.id)"
            (toggle)="store.toggleTodo(todo, $event)"
            (deleteTodo)="store.deleteTodo(todo)"
          />
        </div>

        <div *ngIf="!store.isLoading() && store.todos().length === 0" class="empty-state">
          <p><strong>No todos found</strong></p>
          <p class="muted">Create the first one above.</p>
        </div>
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
export class TodosListComponent implements OnInit {
  protected readonly store: TodosStoreInstance = inject(TodosStore);

  ngOnInit(): void {
    this.store.loadTodos();
  }

  trackByTodoId(_index: number, todo: Todo): number {
    return todo.id;
  }
}
