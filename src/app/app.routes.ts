import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { MainLayout } from './shared/components/main-layout';

export const routes: Routes = [
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login-page').then((m) => m.LoginPage),
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard-page').then((m) => m.DashboardPage),
      },
      {
        path: 'users',
        loadComponent: () => import('./features/users/user-list-page').then((m) => m.UserListPage),
      },
      {
        path: 'users/new',
        loadComponent: () => import('./features/users/user-form-page').then((m) => m.UserFormPage),
      },
      {
        path: 'users/:id',
        loadComponent: () => import('./features/users/user-form-page').then((m) => m.UserFormPage),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
