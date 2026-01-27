import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  viewChild,
  TemplateRef,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { DeleteUserDialog } from '../../components/delete-user-dialog/delete-user-dialog';
import { User } from '../../../../core/models/user';
import { DataTable } from '../../../../shared/components/data-table/data-table';
import { TableColumn } from '../../../../shared/components/data-table/data-table.models';
import { LucideAngularModule, ChevronDown, Pencil, Trash2, X, Plus, Filter } from 'lucide-angular';
import { HasRoleDirective } from '../../../../shared/directives/has-role.directive';

export interface FilterChip {
  id: string;
  label: string;
  type: 'role' | 'status' | 'date';
  value: unknown;
}

@Component({
  selector: 'app-user-list-page',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    DeleteUserDialog,
    LucideAngularModule,
    DataTable,
    HasRoleDirective,
    DatePipe,
  ],
  templateUrl: './user-list-page.html',
  styleUrl: './user-list-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListPage implements OnInit {
  readonly userCell = viewChild.required<TemplateRef<unknown>>('userCell');
  readonly roleCell = viewChild.required<TemplateRef<unknown>>('roleCell');
  readonly statusCell = viewChild.required<TemplateRef<unknown>>('statusCell');
  readonly dateCell = viewChild.required<TemplateRef<unknown>>('dateCell');
  readonly actionCell = viewChild.required<TemplateRef<unknown>>('actionCell');

  readonly ChevronDown = ChevronDown;
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;
  readonly X = X;
  readonly Plus = Plus;
  readonly Filter = Filter;

  private readonly userService = inject(UserService);
  private readonly notificationService = inject(NotificationService);

  columns: TableColumn<User>[] = [];

  ngOnInit() {
    this.columns = [
      { key: 'name', header: 'User', width: '30%', cellTemplate: this.userCell(), sortable: true },
      { key: 'role', header: 'Role', width: '15%', cellTemplate: this.roleCell(), sortable: true },
      {
        key: 'active',
        header: 'Status',
        width: '15%',
        cellTemplate: this.statusCell(),
        sortable: true,
      },
      {
        key: 'lastLogin',
        header: 'Last Login',
        width: '20%',
        cellTemplate: this.dateCell(),
        sortable: true,
      },
      { key: 'actions', header: 'Actions', width: '20%', cellTemplate: this.actionCell() },
    ];
  }

  // Signals
  users = this.userService.users;

  // Form Controls for filtering
  searchControl = new FormControl('');

  // Filter signals
  searchTerm = toSignal(
    this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()),
    { initialValue: '' },
  );

  // Smart Filters
  activeFilters = signal<FilterChip[]>([]);
  isFilterDropdownOpen = signal(false);

  readonly filterOptions: Omit<FilterChip, 'id'>[] = [
    { label: 'Role: Admin', type: 'role', value: 'admin' },
    { label: 'Role: User', type: 'role', value: 'user' },
    { label: 'Role: Editor', type: 'role', value: 'editor' },
    { label: 'Status: Active', type: 'status', value: true },
    { label: 'Status: Inactive', type: 'status', value: false },
    { label: 'Last Login: Last 7 Days', type: 'date', value: 7 },
    { label: 'Last Login: Last 30 Days', type: 'date', value: 30 },
  ];

  // Dialog state
  userToDelete = signal<User | null>(null);

  // Computed filtered users
  filteredUsers = computed(() => {
    const allUsers = this.users();
    const search = this.searchTerm()?.toLowerCase() ?? '';
    const filters = this.activeFilters();

    return allUsers.filter((user) => {
      // 1. Text Search
      if (
        search &&
        !user.name.toLowerCase().includes(search) &&
        !user.email.toLowerCase().includes(search)
      ) {
        return false;
      }

      // 2. Chip Filters
      const roleFilters = filters.filter((f) => f.type === 'role');
      const statusFilters = filters.filter((f) => f.type === 'status');
      const dateFilters = filters.filter((f) => f.type === 'date');

      // Role (OR logic)
      if (roleFilters.length > 0) {
        if (!roleFilters.some((f) => user.role === f.value)) return false;
      }

      // Status (OR logic)
      if (statusFilters.length > 0) {
        if (!statusFilters.some((f) => user.active === f.value)) return false;
      }

      // Date (OR logic - if matches any date range)
      if (dateFilters.length > 0) {
        const now = new Date();
        const hasMatch = dateFilters.some((f) => {
          if (!user.lastLogin) return false;
          // Calculate difference in days
          const diffTime = Math.abs(now.getTime() - new Date(user.lastLogin).getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= (f.value as number);
        });
        if (!hasMatch) return false;
      }

      return true;
    });
  });

  initDeleteUser(user: User) {
    this.userToDelete.set(user);
  }

  // Filter Actions
  toggleFilterDropdown() {
    this.isFilterDropdownOpen.update((v) => !v);
  }

  addFilter(option: Omit<FilterChip, 'id'>) {
    const id = `${option.type}-${option.value}`;
    this.activeFilters.update((current) => {
      if (current.some((c) => c.id === id)) return current;
      return [...current, { ...option, id }];
    });
    this.isFilterDropdownOpen.set(false);
  }

  removeFilter(id: string) {
    this.activeFilters.update((current) => current.filter((c) => c.id !== id));
  }

  cancelDelete() {
    this.userToDelete.set(null);
  }

  confirmDelete() {
    const user = this.userToDelete();
    if (user) {
      this.userService.deleteUser(user.id).subscribe(() => {
        this.notificationService.add({
          title: 'User Management',
          message: `User ${user.name} deleted successfully`,
          type: 'success',
        });
        this.userToDelete.set(null);
      });
    }
  }
}
