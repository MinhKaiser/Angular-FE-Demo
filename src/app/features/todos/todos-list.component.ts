import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService, AuthService } from '@core/services';
import { Todo } from '@shared/models';

@Component({
  selector: 'app-todos-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">My Todos</h1>
        
        <div *ngIf="isLoading" class="flex justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <div *ngIf="!isLoading && todos.length > 0" class="space-y-2">
          <div *ngFor="let todo of todos" class="bg-white rounded-lg shadow-md p-4 flex items-center gap-4 hover:shadow-lg transition">
            <input 
              type="checkbox" 
              [checked]="todo.completed"
              class="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-600 cursor-pointer"
            />
            <span [class.line-through]="todo.completed" [class.text-gray-400]="todo.completed" class="flex-1 text-gray-900">
              {{ todo.todo }}
            </span>
            <span *ngIf="todo.completed" class="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
              Done
            </span>
          </div>
        </div>

        <div *ngIf="!isLoading && todos.length === 0" class="text-center py-12">
          <p class="text-gray-600">No todos found</p>
        </div>
      </div>
    </div>
  `,
})
export class TodosListComponent implements OnInit {
  private todoService = inject(TodoService);
  private authService = inject(AuthService);
  
  todos: Todo[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadTodos();
  }

  private loadTodos(): void {
    const userId = this.authService.user()?.id;
    if (userId) {
      this.todoService.getTodosByUserId(userId, { limit: 50, skip: 0 }).subscribe({
        next: (response) => {
          this.todos = response.todos;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load todos:', err);
          this.isLoading = false;
        },
      });
    }
  }
}
