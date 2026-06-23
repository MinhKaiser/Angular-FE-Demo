import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Todo } from '@shared/models';
import { TodoFormComponent } from './components/todo-form.component';
import { TodoItemComponent } from './components/todo-item.component';
import { TodosStore } from './state/todos.store';

@Component({
  selector: 'app-todos-list',
  standalone: true,
  imports: [CommonModule, TodoFormComponent, TodoItemComponent],
  providers: [TodosStore],
  template: `
    <section class="min-h-screen bg-slate-50">
      <div class="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div class="mb-8">
          <p class="text-sm font-medium uppercase tracking-wide text-violet-700">DummyJSON todos</p>
          <h1 class="mt-1 text-3xl font-bold text-slate-950">My Todos</h1>
          <p class="mt-2 text-sm text-slate-600">{{ store.completedCount() }} of {{ store.todos().length }} completed</p>
        </div>

        <app-todo-form
          [isSaving]="store.isSaving()"
          (addTodo)="store.addTodo($event)"
        />

        <div *ngIf="store.errorMessage()" class="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {{ store.errorMessage() }}
        </div>

        <div *ngIf="store.isLoading()" class="flex min-h-64 items-center justify-center">
          <div class="h-12 w-12 animate-spin rounded-full border-4 border-violet-200 border-t-violet-700"></div>
        </div>

        <div *ngIf="!store.isLoading() && store.todos().length > 0" class="space-y-2">
          <app-todo-item
            *ngFor="let todo of store.todos(); trackBy: trackByTodoId"
            [todo]="todo"
            [isUpdating]="store.isUpdating(todo.id)"
            (toggle)="store.toggleTodo(todo, $event)"
            (deleteTodo)="store.deleteTodo(todo)"
          />
        </div>

        <div *ngIf="!store.isLoading() && store.todos().length === 0" class="rounded-lg border border-dashed border-slate-300 bg-white py-16 text-center">
          <p class="font-medium text-slate-900">No todos found</p>
          <p class="mt-1 text-sm text-slate-500">Create the first one above.</p>
        </div>
      </div>
    </section>
  `,
})
export class TodosListComponent implements OnInit {
  protected readonly store = inject(TodosStore);

  ngOnInit(): void {
    this.store.loadTodos();
  }

  trackByTodoId(_index: number, todo: Todo): number {
    return todo.id;
  }
}
