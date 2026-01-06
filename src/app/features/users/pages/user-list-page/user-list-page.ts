import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { DeleteUserDialog } from '../../components/delete-user-dialog/delete-user-dialog';
import { User } from '../../../../core/models/user';
import { LucideAngularModule, ChevronDown, Pencil, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-user-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, DeleteUserDialog, LucideAngularModule],
  templateUrl: './user-list-page.html',
  styleUrl: './user-list-page.css',
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
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;

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
