import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, Zap, LayoutGrid, Users } from 'lucide-angular';
import { LayoutService } from '../../../core/layout/layout-service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  private layoutService = inject(LayoutService);
  readonly Zap = Zap;
  readonly LayoutGrid = LayoutGrid;
  readonly Users = Users;

  closeSidebar() {
    this.layoutService.closeSidebar();
  }
}
