import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevenueChart } from '../../components/revenue-chart/revenue-chart';
import { UserActivityChart } from '../../components/user-activity-chart/user-activity-chart';
import {
  LucideAngularModule,
  Users,
  DollarSign,
  Zap,
  Ticket,
  TrendingUp,
  TrendingDown,
} from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RevenueChart, UserActivityChart, LucideAngularModule],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  readonly TrendingUp = TrendingUp;
  readonly TrendingDown = TrendingDown;

  stats = [
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
      value: '56',
      trend: 2,
      icon: Ticket,
      colorClass: 'bg-purple-100 text-purple-600',
    },
  ];
}
