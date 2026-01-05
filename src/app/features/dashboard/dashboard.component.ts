import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-800">Dashboard</h2>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        @for (stat of stats; track stat.label) {
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">{{ stat.label }}</p>
              <p class="text-2xl font-semibold text-gray-900 mt-1">{{ stat.value }}</p>
            </div>
            <div [class]="'p-3 rounded-full ' + stat.colorClass">
              <!-- Icon placeholder -->
              <span class="text-xl font-bold">{{ stat.icon }}</span>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span [class]="stat.trend > 0 ? 'text-green-600' : 'text-red-600'">
              {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
            </span>
            <span class="text-gray-500 ml-2">from last month</span>
          </div>
        </div>
        }
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Revenue Overview</h3>
          <div class="h-64 bg-gray-50 flex items-center justify-center rounded">
            <span class="text-gray-400">Chart Placeholder (Revenue)</span>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 class="text-lg font-medium text-gray-900 mb-4">User Activity</h3>
          <div class="h-64 bg-gray-50 flex items-center justify-center rounded">
            <span class="text-gray-400">Chart Placeholder (Activity)</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  stats = [
    {
      label: 'Total Users',
      value: '12,345',
      trend: 12,
      icon: '👥',
      colorClass: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Total Revenue',
      value: '$45,678',
      trend: 8,
      icon: '💰',
      colorClass: 'bg-green-100 text-green-600',
    },
    {
      label: 'Active Sessions',
      value: '1,234',
      trend: -3,
      icon: '⚡',
      colorClass: 'bg-yellow-100 text-yellow-600',
    },
    {
      label: 'Support Tickets',
      value: '56',
      trend: 2,
      icon: '🎫',
      colorClass: 'bg-purple-100 text-purple-600',
    },
  ];
}
