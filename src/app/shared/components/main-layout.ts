import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderSection } from './header-section';
import { SidebarSection } from './sidebar-section';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, HeaderSection, SidebarSection],
  template: `
    <div class="flex h-screen bg-gray-100">
      <app-sidebar class="hidden md:block" />
      <div class="flex-1 flex flex-col overflow-hidden">
        <app-header />
        <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {}
