import { Component, signal, HostListener, inject, computed, TemplateRef } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  FileText,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  User,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Info,
  LucideAngularModule,
} from 'lucide-angular';
import { AuthService } from '../../../core/services/auth/auth.service';
import { AnalyticsService } from '../../../core/services/analytics/analytics.service';
import { MilestoneService } from '../../../core/services/milestone/milestone.service';
import { InspectorService } from '../../../core/services/inspector/inspector.service';
import { ModalService } from '../../../core/services/modal/modal.service';
import { CommonModule } from '@angular/common';
import { InspectorComponent } from '../inspector/inspector';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    LucideAngularModule,
    InspectorComponent,
    ModalComponent,

    FormsModule,
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  private analyticsService = inject(AnalyticsService);
  private milestoneService = inject(MilestoneService);
  private inspector = inject(InspectorService);
  protected modalService = inject(ModalService);
  private router = inject(Router);

  currentUser = this.authService.currentUser;
  activities = this.analyticsService.activities;
  milestones = this.milestoneService.milestones;
  teamMembers = this.analyticsService.teamMembers;

  isSidebarOpen = signal(false);
  isUserMenuOpen = signal(false);
  isNotificationsOpen = signal(false);
  searchQuery = signal('');
  isMobile = signal(window.innerWidth < 1280);

  @HostListener('window:resize')
  onResize() {
    this.isMobile.set(window.innerWidth < 1280);
    if (!this.isMobile()) {
      this.isSidebarOpen.set(false);
    }
  }

  // Expose icons for template
  readonly LayoutDashboard = LayoutDashboard;
  readonly Users = Users;
  readonly FolderKanban = FolderKanban;
  readonly FileText = FileText;
  readonly Settings = Settings;
  readonly Bell = Bell;
  readonly Search = Search;
  readonly Menu = Menu;
  readonly X = X;
  readonly LogOut = LogOut;
  readonly User = User;
  readonly Activity = Activity;
  readonly CheckCircle2 = CheckCircle2;
  readonly AlertTriangle = AlertTriangle;
  readonly Info = Info;

  navItems = [
    { label: 'Overview', icon: LayoutDashboard, route: '/dashboard' },
    { label: 'Team', icon: Users, route: '/team' },
    { label: 'Projects', icon: FolderKanban, route: '/projects' },
    { label: 'Reports', icon: FileText, route: '/reports' },
  ];

  searchResults = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return [];

    const results: {
      type: string;
      label: string;
      route?: string;
      data?: unknown;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      icon: any; // Lucide icon components are often typed as any in their own module or complex to type exactly here
    }[] = [];

    // Navigation
    this.navItems.forEach((item) => {
      if (item.label.toLowerCase().includes(query)) {
        results.push({ type: 'Navigation', label: item.label, route: item.route, icon: item.icon });
      }
    });

    // Projects
    this.milestones().forEach((m) => {
      if (m.projectName.toLowerCase().includes(query)) {
        results.push({ type: 'Project', label: m.projectName, data: m, icon: FolderKanban });
      }
    });

    // Team
    this.teamMembers().forEach((m) => {
      if (m.name.toLowerCase().includes(query)) {
        results.push({ type: 'Team', label: m.name, data: m, icon: Users });
      }
    });

    return results;
  });

  handleSearchResult(result: { type: string; route?: string; data?: unknown }) {
    this.searchQuery.set('');

    if (result.type === 'Navigation') {
      this.router.navigate([result.route]);
    } else if (result.type === 'Project') {
      this.inspector.open(result.data, 'milestone');
    } else if (result.type === 'Team') {
      // Prepare simple inspector view for team member if needed, or navigate
      this.router.navigate(['/team']);
    }
  }

  toggleSidebar() {
    this.isSidebarOpen.update((v) => !v);
  }

  toggleUserMenu() {
    this.isUserMenuOpen.update((v) => !v);
  }

  closeSidebar() {
    this.isSidebarOpen.set(false);
  }

  closeUserMenu() {
    this.isUserMenuOpen.set(false);
  }

  logout(template: TemplateRef<unknown>) {
    this.closeUserMenu();
    this.modalService.open({
      title: 'Sign Out Protocol',
      template: template,
    });
  }

  confirmLogout() {
    this.modalService.close();
    this.authService.logout();
  }

  toggleNotifications() {
    this.isNotificationsOpen.update((v) => !v);
    if (this.isNotificationsOpen()) this.isUserMenuOpen.set(false);
  }

  closeNotifications() {
    this.isNotificationsOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // Handle User Menu
    if (this.isUserMenuOpen()) {
      const isInsideUser =
        target.closest('.user-menu-trigger') || target.closest('.user-menu-dropdown');
      if (!isInsideUser) this.closeUserMenu();
    }

    // Handle Notifications
    if (this.isNotificationsOpen()) {
      const isInsideNotif =
        target.closest('.notifications-trigger') || target.closest('.notifications-dropdown');
      if (!isInsideNotif) this.closeNotifications();
    }
  }
}
