import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './shared/components/layout.component';

export const routes: Routes = [
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/users/user-list.component').then((m) => m.UserListComponent),
      },
      {
        path: 'users/new',
        loadComponent: () =>
          import('./features/users/user-form.component').then((m) => m.UserFormComponent),
      },
      {
        path: 'users/:id',
        loadComponent: () =>
          import('./features/users/user-form.component').then((m) => m.UserFormComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
