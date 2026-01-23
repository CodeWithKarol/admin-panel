import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { RevenueChart } from '../../components/revenue-chart/revenue-chart';
import { UserActivityChart } from '../../components/user-activity-chart/user-activity-chart';
import { NotificationService } from '../../../../core/services/notification.service';
import { Skeleton } from '../../../../shared/components/skeleton/skeleton';
import { HasRoleDirective } from '../../../../shared/directives/has-role.directive';
import {
  LucideAngularModule,
  Users,
  DollarSign,
  Zap,
  Ticket,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
} from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  imports: [RevenueChart, UserActivityChart, LucideAngularModule, Skeleton, HasRoleDirective],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage implements OnInit {
  private notificationService = inject(NotificationService);

  readonly TrendingUp = TrendingUp;
  readonly TrendingDown = TrendingDown;
  readonly Download = Download;
  readonly Filter = Filter;

  protected isLoading = signal(true);

  protected readonly stats = [
    {
      label: 'Total Users',
      value: '12,345',
      trend: 12,
      icon: Users,
      colorClass: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Total Revenue',
      value: '$45,678',
      trend: 8,
      icon: DollarSign,
      colorClass: 'bg-green-100 text-green-600',
    },
    {
      label: 'Active Sessions',
      value: '1,234',
      trend: -3,
      icon: Zap,
      colorClass: 'bg-yellow-100 text-yellow-600',
    },
    {
      label: 'Support Tickets',
      value: '456',
      trend: 5,
      icon: Ticket,
      colorClass: 'bg-purple-100 text-purple-600',
    },
  ];

  ngOnInit() {
    // Simulate initial loading
    setTimeout(() => {
      this.isLoading.set(false);
      // Optional: Don't always show this to avoid spam, but for demo it's fine
      // or remove if not needed. Keeping it for now.
      // this.notificationService.add('Dashboard updated', 'success');
    }, 1500);
  }

  exportData() {
    this.notificationService.add({
      title: 'Export',
      message: 'Downloading report...',
      type: 'info',
    });
    setTimeout(() => {
      this.notificationService.add({
        title: 'Export',
        message: 'Report downloaded successfully',
        type: 'success',
      });
    }, 1000);
  }

  createReport() {
    this.notificationService.add({
      title: 'Report',
      message: 'Creating new report...',
      type: 'info',
    });
  }
}
