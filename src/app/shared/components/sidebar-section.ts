import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="h-full flex flex-col bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300">
      <!-- Logo Area -->
      <div class="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-700">
        <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span class="text-xl font-bold tracking-tight text-slate-900 dark:text-white"
            >Admin<span class="text-indigo-600 dark:text-indigo-400">Panel</span></span
          >
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div class="px-2 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Overview
        </div>

        <a
          routerLink="/dashboard"
          routerLinkActive="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
          [routerLinkActiveOptions]="{ exact: true }"
          class="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
        >
          <svg
            class="w-5 h-5 mr-3 text-slate-400 group-hover:text-indigo-500 group-[.active]:text-indigo-500 transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
          Dashboard
        </a>

        <div class="px-2 mt-6 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Management
        </div>

        <a
          routerLink="/users"
          routerLinkActive="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
          class="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
        >
          <svg
            class="w-5 h-5 mr-3 text-slate-400 group-hover:text-indigo-500 group-[.active]:text-indigo-500 transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          Users
        </a>
      </nav>

      <!-- Footer -->
      <div class="p-4 border-t border-slate-100 dark:border-slate-700">
        <div class="flex items-center gap-3 px-2">
          <div
            class="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs"
          >
            AP
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-slate-900 dark:text-white truncate">Admin Pro</p>
            <p class="text-xs text-slate-500 dark:text-slate-400 truncate">v2.0.0</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarSection {}
