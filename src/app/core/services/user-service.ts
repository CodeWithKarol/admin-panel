import { Injectable, signal } from '@angular/core';
import { User } from '../models/user';
import { of, delay, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private mockUsers: User[] = [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      active: true,
      lastLogin: new Date('2023-01-01'),
    },
    {
      id: 2,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      active: true,
      lastLogin: new Date('2023-01-02'),
    },
    {
      id: 3,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'editor',
      active: false,
      lastLogin: new Date('2023-01-03'),
    },
    {
      id: 4,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'user',
      active: true,
      lastLogin: new Date('2023-01-04'),
    },
    {
      id: 5,
      name: 'Alice Brown',
      email: 'alice@example.com',
      role: 'editor',
      active: true,
      lastLogin: new Date('2023-01-05'),
    },
  ];

  getUsers(): Observable<User[]> {
    return of([...this.mockUsers]).pipe(delay(500));
  }

  getUserById(id: number): Observable<User | undefined> {
    const user = this.mockUsers.find((u) => u.id === id);
    return of(user).pipe(delay(300));
  }

  addUser(user: Omit<User, 'id'>): Observable<User> {
    const newUser = { ...user, id: this.mockUsers.length + 1 };
    this.mockUsers = [...this.mockUsers, newUser];
    return of(newUser).pipe(delay(500));
  }

  updateUser(user: User): Observable<User> {
    this.mockUsers = this.mockUsers.map((u) => (u.id === user.id ? user : u));
    return of(user).pipe(delay(500));
  }

  deleteUser(id: number): Observable<boolean> {
    this.mockUsers = this.mockUsers.filter((u) => u.id !== id);
    return of(true).pipe(delay(500));
  }
}
