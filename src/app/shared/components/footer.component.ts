import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="border-t border-slate-200 bg-white">
      <div class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>Dummy Shop training app</p>
        <div class="flex gap-4">
          <a routerLink="/products" class="hover:text-slate-950">Products</a>
          <a routerLink="/posts" class="hover:text-slate-950">Posts</a>
          <a routerLink="/todos" class="hover:text-slate-950">Todos</a>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
