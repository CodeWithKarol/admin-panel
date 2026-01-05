import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderSection } from './header-section';
import { SidebarSection } from './sidebar-section';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, HeaderSection, SidebarSection],
  template: `
    <div class="flex h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <!-- Sidebar (Hidden on mobile, fixed on desktop) -->
      <app-sidebar
        class="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 z-50 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shadow-sm"
      />

      <!-- Main Content Wrapper -->
      <div class="flex-1 flex flex-col md:pl-64 overflow-hidden">
        <!-- Header -->
        <app-header class="sticky top-0 z-40" />

        <!-- Main Scrollable Area -->
        <main
          class="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-900 p-4 md:p-8"
        >
          <div class="max-w-7xl mx-auto">
            <router-outlet />
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {}
