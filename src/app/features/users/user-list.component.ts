import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-800">Users</h2>
        <a
          routerLink="new"
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Add User
        </a>
      </div>

      <!-- Filters -->
      <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex gap-4">
        <div class="flex-1">
          <input
            [formControl]="searchControl"
            type="text"
            placeholder="Search users..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <select
          [formControl]="roleControl"
          class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="editor">Editor</option>
        </select>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            @for (user of filteredUsers(); track user.id) {
            <tr>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ user.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  [class]="user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ user.active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <a [routerLink]="[user.id]" class="text-indigo-600 hover:text-indigo-900 mr-4"
                  >Edit</a
                >
                <button (click)="deleteUser(user.id)" class="text-red-600 hover:text-red-900">
                  Delete
                </button>
              </td>
            </tr>
            } @empty {
            <tr>
              <td colspan="5" class="px-6 py-4 text-center text-gray-500">No users found.</td>
            </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {
  private userService = inject(UserService);

  // Signals
  users = toSignal(this.userService.getUsers(), { initialValue: [] });

  // Form Controls for filtering
  searchControl = new FormControl('');
  roleControl = new FormControl('');

  // Filter signals
  searchTerm = toSignal(
    this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()),
    { initialValue: '' }
  );
  roleFilter = toSignal(this.roleControl.valueChanges, { initialValue: '' });

  // Computed filtered users
  filteredUsers = computed(() => {
    const allUsers = this.users();
    const search = this.searchTerm()?.toLowerCase() ?? '';
    const role = this.roleFilter() ?? '';

    return allUsers.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search);
      const matchesRole = role ? user.role === role : true;
      return matchesSearch && matchesRole;
    });
  });

  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe(() => {
        // In a real app, we would refresh the list or update the signal
        // For this mock, we might need to manually trigger a refresh or update local state
        // Since toSignal is read-only from observable, we'd typically use a service with a signal source
        // But for simplicity here, we'll just reload the page or assume the service updates a subject
        window.location.reload(); // Simple hack for this mock
      });
    }
  }
}
