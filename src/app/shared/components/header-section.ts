import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth-service';
import { LayoutService } from '../../core/services/layout-service';
import { LucideAngularModule, Menu, Search, Sun, Moon, Bell } from 'lucide-angular';

@Component({
  selector: 'app-header',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <header
      class="relative h-16 flex items-center justify-between px-4 md:px-8 transition-colors duration-300"
    >
      <!-- Background with blur -->
      <div
        class="absolute inset-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 -z-10"
      ></div>

      <!-- Left: Mobile Menu & Search -->
      <div class="flex items-center gap-4 flex-1">
        <button
          (click)="toggleSidebar()"
          class="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
        >
          <lucide-angular [img]="Menu" class="w-6 h-6"></lucide-angular>
        </button>

        <div class="relative hidden md:block w-full max-w-md">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <lucide-angular [img]="Search" class="w-5 h-5"></lucide-angular>
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
          <lucide-angular [img]="Sun" class="w-5 h-5 hidden dark:block"></lucide-angular>
          <!-- Moon Icon -->
          <lucide-angular [img]="Moon" class="w-5 h-5 block dark:hidden"></lucide-angular>
        </button>

        <!-- Notifications -->
        <div class="relative">
          <button
            (click)="toggleNotifications()"
            class="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <lucide-angular [img]="Bell" class="w-6 h-6"></lucide-angular>
            <span
              class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-800"
            ></span>
          </button>

          <!-- Dropdown -->
          @if (showNotifications()) {
          <div
            class="fixed inset-0 z-40 cursor-pointer"
            (click)="showNotifications.set(false)"
          ></div>
          <div
            class="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50"
          >
            <div class="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
              <h3 class="font-semibold text-slate-900 dark:text-white">Notifications</h3>
            </div>
            <div class="max-h-64 overflow-y-auto">
              <a
                href="javascript:void(0)"
                class="block px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <p class="text-sm font-medium text-slate-900 dark:text-white">
                  New user registered
                </p>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Just now</p>
              </a>
              <a
                href="javascript:void(0)"
                class="block px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <p class="text-sm font-medium text-slate-900 dark:text-white">
                  System update completed
                </p>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">2 hours ago</p>
              </a>
            </div>
            <div class="px-4 py-2 border-t border-slate-100 dark:border-slate-700 text-center">
              <a
                href="javascript:void(0)"
                class="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                >View all notifications</a
              >
            </div>
          </div>
          }
        </div>

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
  layoutService = inject(LayoutService);

  showNotifications = signal(false);

  readonly Menu = Menu;
  readonly Search = Search;
  readonly Sun = Sun;
  readonly Moon = Moon;
  readonly Bell = Bell;

  logout() {
    this.authService.logout();
  }

  toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
  }

  toggleSidebar() {
    this.layoutService.toggleSidebar();
  }

  toggleNotifications() {
    this.showNotifications.update((v) => !v);
  }
}
