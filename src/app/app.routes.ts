import { Routes } from '@angular/router';
import { authGuard, publicGuard } from '@core/guards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('@features/auth').then((m) => m.LoginComponent),
        canActivate: [publicGuard],
      },
    ],
  },
  {
    path: 'dashboard',
    loadComponent: () => import('@features/dashboard').then((m) => m.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: 'products',
    loadComponent: () => import('@features/products').then((m) => m.ProductsListComponent),
  },
  {
    path: 'products/:id',
    loadComponent: () => import('@features/products').then((m) => m.ProductDetailComponent),
  },
  {
    path: 'posts',
    loadComponent: () => import('@features/posts').then((m) => m.PostsListComponent),
  },
  {
    path: 'posts/:id',
    loadComponent: () => import('@features/posts').then((m) => m.PostDetailComponent),
  },
  {
    path: 'todos',
    loadComponent: () => import('@features/todos').then((m) => m.TodosListComponent),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
