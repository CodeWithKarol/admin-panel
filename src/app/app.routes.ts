import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { MainLayoutComponent } from './shared/components/layout/main-layout';

export const routes: Routes = [
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/pages/login-page/login-page').then((m) => m.LoginPage),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard-page/dashboard-page').then(
            (m) => m.DashboardPage
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/users/pages/user-list-page/user-list-page.component').then(
            (m) => m.UserListPageComponent
          ),
      },
      {
        path: 'users/new',
        loadComponent: () =>
          import('./features/users/pages/user-form-page/user-form-page.component').then(
            (m) => m.UserFormPageComponent
          ),
      },
      {
        path: 'users/:id',
        loadComponent: () =>
          import('./features/users/pages/user-form-page/user-form-page.component').then(
            (m) => m.UserFormPageComponent
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
