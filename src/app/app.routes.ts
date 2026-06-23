import { Routes } from '@angular/router';
import { authGuard, publicGuard } from '@core/guards';
import { LoginComponent } from '@features/auth';
import { ProductsListComponent } from '@features/products';
import { PostsListComponent } from '@features/posts';
import { TodosListComponent } from '@features/todos';
import { DashboardComponent } from '@features/dashboard';

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
        component: LoginComponent,
        canActivate: [publicGuard],
      },
    ],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'products',
    component: ProductsListComponent,
  },
  {
    path: 'posts',
    component: PostsListComponent,
  },
  {
    path: 'todos',
    component: TodosListComponent,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
