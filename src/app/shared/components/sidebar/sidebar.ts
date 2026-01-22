import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  LucideAngularModule,
  Zap,
  LayoutGrid,
  Users,
  Calendar,
  FolderPlus,
  Trello,
  Folder,
  MessageSquare,
} from 'lucide-angular';
import { LayoutService } from '../../../core/layout/layout-service';

import { AuthService } from '../../../core/auth/auth-service';
import { HasRoleDirective } from '../../directives/has-role.directive';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule, HasRoleDirective],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  private layoutService = inject(LayoutService);
  private authService = inject(AuthService);

  readonly Zap = Zap;
  readonly LayoutGrid = LayoutGrid;
  readonly Users = Users;
  readonly FolderPlus = FolderPlus;
  readonly Calendar = Calendar;
  readonly Trello = Trello;
  readonly Folder = Folder;
  readonly MessageSquare = MessageSquare;

  user = this.authService.currentUser;

  closeSidebar() {
    this.layoutService.closeSidebar();
  }
}
