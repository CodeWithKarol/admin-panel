import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="w-64 bg-gray-800 text-white h-full flex flex-col">
      <div class="p-6 border-b border-gray-700">
        <span class="text-lg font-semibold tracking-wide">MENU</span>
      </div>
      <nav class="flex-1 p-4 space-y-2">
        <a
          routerLink="/dashboard"
          routerLinkActive="bg-gray-700 text-white"
          [routerLinkActiveOptions]="{ exact: true }"
          class="block px-4 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
        >
          Dashboard
        </a>
        <a
          routerLink="/users"
          routerLinkActive="bg-gray-700 text-white"
          class="block px-4 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
        >
          Users
        </a>
      </nav>
      <div class="p-4 border-t border-gray-700 text-xs text-gray-500 text-center">v1.0.0</div>
    </aside>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarSection {}
