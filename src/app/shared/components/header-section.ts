import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth-service';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  template: `
    <header
      class="h-16 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 md:px-8 transition-colors duration-300"
    >
      <!-- Left: Mobile Menu & Search -->
      <div class="flex items-center gap-4 flex-1">
        <button
          class="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div class="relative hidden md:block w-full max-w-md">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search..."
            class="w-full py-2 pl-10 pr-4 text-sm text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700/50 border-none rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all placeholder-slate-400"
          />
        </div>
      </div>

      <!-- Right: Actions -->
      <div class="flex items-center gap-3 md:gap-6">
        <!-- Dark Mode Toggle -->
        <button
          (click)="toggleDarkMode()"
          class="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
          aria-label="Toggle Dark Mode"
        >
          <!-- Sun Icon -->
          <svg
            class="w-5 h-5 hidden dark:block"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <!-- Moon Icon -->
          <svg
            class="w-5 h-5 block dark:hidden"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        </button>

        <!-- Notifications -->
        <button
          class="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span
            class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-800"
          ></span>
        </button>

        <!-- Profile Dropdown -->
        <div class="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-700">
          <div class="hidden md:block text-right">
            <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {{ authService.currentUser()?.name }}
            </p>
            <p class="text-xs text-slate-500 dark:text-slate-400">Administrator</p>
          </div>
          <button
            class="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold ring-2 ring-transparent hover:ring-indigo-500 transition-all"
          >
            {{ authService.currentUser()?.name?.charAt(0) }}
          </button>
          <button
            (click)="logout()"
            class="hidden md:block text-xs font-medium text-slate-500 hover:text-red-600 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderSection {
  authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }

  toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
  }
}
