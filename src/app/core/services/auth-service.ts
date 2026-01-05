import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginCredentials, AuthResponse } from '../models/auth';
import { User } from '../models/user';
import { of, delay, tap, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);

  // State
  private _currentUser = signal<User | null>(null);
  private _isAuthenticated = computed(() => !!this._currentUser());

  // Public signals
  currentUser = this._currentUser.asReadonly();
  isAuthenticated = this._isAuthenticated;

  constructor() {
    // Check local storage for existing session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this._currentUser.set(JSON.parse(storedUser));
    }
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    // Mock API call
    const mockUser: User = {
      id: 1,
      name: 'Admin User',
      email: credentials.email,
      role: 'admin',
      active: true,
      lastLogin: new Date(),
    };

    const response: AuthResponse = {
      token: 'mock-jwt-token',
      user: mockUser,
    };

    return of(response).pipe(
      delay(1000), // Simulate network latency
      tap((res) => {
        this._currentUser.set(res.user);
        localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('token', res.token);
        this.router.navigate(['/dashboard']);
      })
    );
  }

  logout(): void {
    this._currentUser.set(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/auth/login']);
  }
}
