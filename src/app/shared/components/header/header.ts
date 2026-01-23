import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeCustomizer } from '../theme-customizer/theme-customizer';
import { AuthService } from '../../../core/auth/auth-service';
import { ThemeService } from '../../../core/theme/theme.service';

import { LayoutService } from '../../../core/layout/layout-service';
import { ToastService } from '../../../core/services/toast.service';
import { NotificationService } from '../../../core/services/notification.service';
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
  Check,
  Trash2,
  X,
  Info,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
} from 'lucide-angular';

@Component({
  selector: 'app-header',
  imports: [CommonModule, LucideAngularModule, RouterModule, ThemeCustomizer],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  authService = inject(AuthService);
  layoutService = inject(LayoutService);
  toastService = inject(ToastService);
  themeService = inject(ThemeService);
  notificationService = inject(NotificationService);

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
  readonly Check = Check;
  readonly Trash2 = Trash2;
  readonly X = X;

  // Icons for notification types
  readonly Info = Info;
  readonly CheckCircle = CheckCircle;
  readonly AlertTriangle = AlertTriangle;
  readonly AlertCircle = AlertCircle;

  logout() {
    this.authService.logout();
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }

  toggleSidebar() {
    this.layoutService.toggleSidebar();
  }

  toggleNotifications() {
    this.showNotifications.update((v) => !v);
    if (this.showNotifications()) {
      this.showProfileMenu.set(false);
    }
  }

  toggleProfileMenu() {
    this.showProfileMenu.update((v) => !v);
    if (this.showProfileMenu()) {
      this.showNotifications.set(false);
    }
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead();
  }

  clearNotifications() {
    this.notificationService.clearAll();
  }
}
