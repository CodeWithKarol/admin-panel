import { Component, ChangeDetectionStrategy, inject, signal, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-user-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="max-w-2xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-800">
          {{ isEditMode() ? 'Edit User' : 'New User' }}
        </h2>
        <a routerLink="/users" class="text-gray-600 hover:text-gray-900">Cancel</a>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              formControlName="name"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            @if (name?.invalid && name?.touched) {
            <p class="mt-1 text-sm text-red-600">Name is required</p>
            }
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            @if (email?.invalid && email?.touched) {
            <p class="mt-1 text-sm text-red-600">Valid email is required</p>
            }
          </div>

          <div>
            <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
            <select
              id="role"
              formControlName="role"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
            </select>
          </div>

          <div class="flex items-center">
            <input
              type="checkbox"
              id="active"
              formControlName="active"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="active" class="ml-2 block text-sm text-gray-900">Active</label>
          </div>

          <div class="flex justify-end pt-4">
            <button
              type="submit"
              [disabled]="userForm.invalid || isSaving()"
              class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {{ isSaving() ? 'Saving...' : 'Save User' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEditMode = signal(false);
  isSaving = signal(false);
  userId = signal<number | null>(null);

  userForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['user', Validators.required],
    active: [true],
  });

  get name() {
    return this.userForm.get('name');
  }
  get email() {
    return this.userForm.get('email');
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode.set(true);
      this.userId.set(+id);
      this.loadUser(+id);
    }
  }

  loadUser(id: number) {
    this.userService.getUserById(id).subscribe((user) => {
      if (user) {
        this.userForm.patchValue({
          name: user.name,
          email: user.email,
          role: user.role,
          active: user.active,
        });
      }
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.isSaving.set(true);
      const formValue = this.userForm.value;

      const userPayload: any = {
        name: formValue.name!,
        email: formValue.email!,
        role: formValue.role as 'admin' | 'user' | 'editor',
        active: formValue.active!,
      };

      const request = this.isEditMode()
        ? this.userService.updateUser({ ...userPayload, id: this.userId()! })
        : this.userService.addUser(userPayload);

      request.subscribe({
        next: () => {
          this.router.navigate(['/users']);
        },
        error: () => {
          this.isSaving.set(false);
        },
      });
    }
  }
}
