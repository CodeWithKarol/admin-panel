import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div
      class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900 transition-colors"
    >
      <div
        class="max-w-md w-full bg-white dark:bg-slate-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-slate-700 transition-colors"
      >
        <h2 class="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">Sign In</h2>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-slate-300"
              >Email</label
            >
            <input
              type="email"
              id="email"
              formControlName="email"
              class="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-slate-700 dark:text-white dark:ring-slate-600 dark:placeholder-slate-400 transition-colors"
              [class.ring-red-500]="email?.invalid && email?.touched"
              [class.focus:ring-red-500]="email?.invalid && email?.touched"
            />
            @if (email?.invalid && email?.touched) {
            <p class="mt-1 text-sm text-red-600 dark:text-red-400">Valid email is required</p>
            }
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 dark:text-slate-300"
              >Password</label
            >
            <input
              type="password"
              id="password"
              formControlName="password"
              class="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-slate-700 dark:text-white dark:ring-slate-600 dark:placeholder-slate-400 transition-colors"
              [class.ring-red-500]="password?.invalid && password?.touched"
              [class.focus:ring-red-500]="password?.invalid && password?.touched"
            />
            @if (password?.invalid && password?.touched) {
            <p class="mt-1 text-sm text-red-600 dark:text-red-400">Password is required</p>
            }
          </div>

          <button
            type="submit"
            [disabled]="loginForm.invalid || isLoading()"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-slate-800"
          >
            @if (isLoading()) {
            <span>Loading...</span>
            } @else {
            <span>Sign In</span>
            }
          </button>
        </form>

        <div class="mt-4 text-center text-sm text-gray-500 dark:text-slate-400">
          <p>Use any email and password to login.</p>
        </div>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  isLoading = signal(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      const { email, password } = this.loginForm.value;

      this.authService
        .login({
          email: email!,
          password: password!,
        })
        .subscribe({
          next: () => {
            // Navigation handled in service
            this.isLoading.set(false);
          },
          error: (err) => {
            console.error('Login failed', err);
            this.isLoading.set(false);
          },
        });
    }
  }
}
