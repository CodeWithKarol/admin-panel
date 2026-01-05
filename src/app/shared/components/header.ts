import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  template: `
    <header class="bg-white shadow-sm h-16 flex items-center justify-between px-6">
      <div class="flex items-center">
        <h1 class="text-xl font-bold text-gray-800">AdminPanel Pro</h1>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-sm text-gray-600"> Welcome, {{ authService.currentUser()?.name }} </span>
        <button (click)="logout()" class="text-sm text-red-600 hover:text-red-800 font-medium">
          Logout
        </button>
      </div>
    </header>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
