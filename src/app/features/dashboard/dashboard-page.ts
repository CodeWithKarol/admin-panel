import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevenueChart } from './ui/revenue-chart';
import { UserActivityChart } from './ui/user-activity-chart';
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
  template: `
    <div class="space-y-8">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Dashboard Overview
          </h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, here's what's happening today.
          </p>
        </div>
        <div class="flex gap-3">
          <button
            class="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            Export
          </button>
          <button
            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-200 dark:shadow-none transition-colors"
          >
            + New Report
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        @for (stat of stats; track stat.label) {
        <div
          class="group bg-white dark:bg-slate-800 p-6 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] dark:shadow-none border border-slate-100 dark:border-slate-700 hover:border-indigo-100 dark:hover:border-slate-600 transition-all duration-200"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ stat.label }}</p>
              <h3 class="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                {{ stat.value }}
              </h3>
            </div>
            <div
              [class]="'p-2.5 rounded-lg ' + stat.colorClass + ' bg-opacity-10 dark:bg-opacity-20'"
            >
              <lucide-angular [img]="stat.icon" class="w-6 h-6"></lucide-angular>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span
              [class]="
                'flex items-center font-medium ' +
                (stat.trend > 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400')
              "
            >
              <lucide-angular
                [img]="stat.trend > 0 ? TrendingUp : TrendingDown"
                class="w-4 h-4 mr-1"
              ></lucide-angular>
              {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
            </span>
            <span class="text-slate-400 ml-2">vs last month</span>
          </div>
        </div>
        }
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <app-revenue-chart class="contents"></app-revenue-chart>
        <app-user-activity-chart class="contents"></app-user-activity-chart>
      </div>

      <!-- Recent Activity Table (Placeholder) -->
      <div
        class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden"
      >
        <div
          class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between"
        >
          <h3 class="font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
          <button
            class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium"
          >
            View All
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th class="px-6 py-3 font-medium">User</th>
                <th class="px-6 py-3 font-medium">Action</th>
                <th class="px-6 py-3 font-medium">Date</th>
                <th class="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <td class="px-6 py-4 font-medium text-slate-900 dark:text-white">Alice Johnson</td>
                <td class="px-6 py-4 text-slate-500 dark:text-slate-400">Created new project</td>
                <td class="px-6 py-4 text-slate-500 dark:text-slate-400">2 mins ago</td>
                <td class="px-6 py-4">
                  <span
                    class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                    >Completed</span
                  >
                </td>
              </tr>
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <td class="px-6 py-4 font-medium text-slate-900 dark:text-white">Bob Smith</td>
                <td class="px-6 py-4 text-slate-500 dark:text-slate-400">Updated billing info</td>
                <td class="px-6 py-4 text-slate-500 dark:text-slate-400">1 hour ago</td>
                <td class="px-6 py-4">
                  <span
                    class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                    >Pending</span
                  >
                </td>
              </tr>
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <td class="px-6 py-4 font-medium text-slate-900 dark:text-white">Carol White</td>
                <td class="px-6 py-4 text-slate-500 dark:text-slate-400">Deleted user account</td>
                <td class="px-6 py-4 text-slate-500 dark:text-slate-400">3 hours ago</td>
                <td class="px-6 py-4">
                  <span
                    class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400"
                    >Failed</span
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [],
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
