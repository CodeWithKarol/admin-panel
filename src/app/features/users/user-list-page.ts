import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { DeleteUserDialog } from './delete-user-dialog';
import { User } from '../../core/models/user';
import { LucideAngularModule, ChevronDown } from 'lucide-angular';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, DeleteUserDialog, LucideAngularModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Users</h2>
        <a
          routerLink="new"
          class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
        >
          Add User
        </a>
      </div>

      <!-- Filters -->
      <div
        class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 flex gap-4 transition-colors duration-300"
      >
        <div class="flex-1">
          <input
            [formControl]="searchControl"
            type="text"
            placeholder="Search users..."
            class="block w-full rounded-md border border-gray-300 px-3 py-2.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400 transition-colors"
          />
        </div>
        <div class="relative">
          <select
            [formControl]="roleControl"
            class="block w-full appearance-none rounded-md border border-gray-300 py-2.5 pl-3 pr-10 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white transition-colors"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="editor">Editor</option>
          </select>
          <div
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-slate-400"
          >
            <lucide-angular [img]="ChevronDown" class="h-4 w-4"></lucide-angular>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div
        class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden transition-colors duration-300"
      >
        <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead class="bg-gray-50 dark:bg-slate-700/50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
            @for (user of filteredUsers(); track user.id) {
            <tr class="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ user.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500 dark:text-slate-400">{{ user.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 capitalize"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  [class]="
                    user.active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  "
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ user.active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <a
                  [routerLink]="[user.id]"
                  class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4 transition-colors"
                  >Edit</a
                >
                <button
                  (click)="initDeleteUser(user)"
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
            } @empty {
            <tr>
              <td colspan="5" class="px-6 py-4 text-center text-gray-500 dark:text-slate-400">
                No users found.
              </td>
            </tr>
            }
          </tbody>
        </table>
      </div>

      @if (userToDelete()) {
      <app-delete-user-dialog
        [user]="userToDelete()!"
        (confirm)="confirmDelete()"
        (cancel)="cancelDelete()"
      />
      }
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListPage {
  readonly ChevronDown = ChevronDown;
  private userService = inject(UserService);

  // Signals
  users = this.userService.users;

  // Form Controls for filtering
  searchControl = new FormControl('');
  roleControl = new FormControl('');

  // Filter signals
  searchTerm = toSignal(
    this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()),
    { initialValue: '' }
  );
  roleFilter = toSignal(this.roleControl.valueChanges, { initialValue: '' });

  // Dialog state
  userToDelete = signal<User | null>(null);

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

  initDeleteUser(user: User) {
    this.userToDelete.set(user);
  }

  cancelDelete() {
    this.userToDelete.set(null);
  }

  confirmDelete() {
    const user = this.userToDelete();
    if (user) {
      this.userService.deleteUser(user.id).subscribe(() => {
        this.userToDelete.set(null);
      });
    }
  }
}
