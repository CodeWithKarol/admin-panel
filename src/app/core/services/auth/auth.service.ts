import { Injectable, signal } from '@angular/core';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = signal<User | null>({
    id: 'u1',
    name: 'Admin User',
    email: 'admin@axon.dev',
    role: 'Administrator',
    avatar: 'https://i.pravatar.cc/150?u=1',
  });

  logout() {
    // In a real app, this would clear tokens and redirect
    console.log('Logging out...');
    this.currentUser.set(null);
    // Reload to simulate full reset or redirect
    window.location.reload();
  }
}
