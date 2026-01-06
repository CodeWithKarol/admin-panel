import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/auth-service';
import { LayoutService } from '../../../core/layout/layout-service';
import {
  LucideAngularModule,
  Menu,
  Search,
  Sun,
  Moon,
  Bell,
  LogOut,
  User,
  Settings,
  ChevronDown,
} from 'lucide-angular';

@Component({
  selector: 'app-header',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  authService = inject(AuthService);
  layoutService = inject(LayoutService);

  showNotifications = signal(false);
  showProfileMenu = signal(false);

  readonly Menu = Menu;
  readonly Search = Search;
  readonly Sun = Sun;
  readonly Moon = Moon;
  readonly Bell = Bell;
  readonly LogOut = LogOut;
  readonly User = User;
  readonly Settings = Settings;
  readonly ChevronDown = ChevronDown;

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

  toggleProfileMenu() {
    this.showProfileMenu.update((v) => !v);
  }
}
