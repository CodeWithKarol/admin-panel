import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth-guard';
import { MainLayout } from './shared/components/layout/main-layout';

export const routes: Routes = [
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/pages/login-page/login-page').then((m) => m.LoginPage),
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
          import('./features/dashboard/pages/dashboard-page/dashboard-page').then(
            (m) => m.DashboardPage,
          ),
        data: { breadcrumb: 'Dashboard' },
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./features/calendar/pages/calendar-page/calendar-page').then(
            (m) => m.CalendarPage,
          ),
        data: { breadcrumb: 'Calendar' },
      },
      {
        path: 'projects/new',
        loadComponent: () =>
          import('./features/projects/pages/create-project-page/create-project-page').then(
            (m) => m.CreateProjectPage,
          ),
        data: { breadcrumb: 'New Project' },
      },
      {
        path: 'files',
        loadComponent: () =>
          import('./features/file-manager/pages/file-manager-page/file-manager-page').then(
            (m) => m.FileManagerPage,
          ),
        data: { breadcrumb: 'File Manager' },
      },
      {
        path: 'chat',
        loadComponent: () =>
          import('./features/chat/pages/chat-page/chat-page').then((m) => m.ChatPage),
        data: { breadcrumb: 'Messages' },
      },
      {
        path: 'kanban',
        loadComponent: () =>
          import('./features/kanban/pages/kanban-board-page/kanban-board-page').then(
            (m) => m.KanbanBoardPage,
          ),
        data: { breadcrumb: 'Kanban Board' },
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/users/pages/user-list-page/user-list-page').then(
            (m) => m.UserListPage,
          ),
        data: { breadcrumb: 'Users' },
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/pages/profile-page/profile-page').then((m) => m.ProfilePage),
        data: { breadcrumb: 'My Profile' },
      },
      {
        path: 'users/new',
        loadComponent: () =>
          import('./features/users/pages/user-form-page/user-form-page').then(
            (m) => m.UserFormPage,
          ),
        data: { breadcrumb: 'New User' },
      },
      {
        path: 'users/:id',
        loadComponent: () =>
          import('./features/users/pages/user-form-page/user-form-page').then(
            (m) => m.UserFormPage,
          ),
        data: { breadcrumb: 'Edit User' },
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
