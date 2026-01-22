import { Injectable, signal } from '@angular/core';
import { User } from '../../../core/models/user';
import { of, delay, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly _users = signal<User[]>([
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
  ]);

  users = this._users.asReadonly();

  getUsers(): Observable<User[]> {
    return of(this._users()).pipe(delay(500));
  }

  getUserById(id: number): Observable<User | undefined> {
    const user = this._users().find((u) => u.id === id);
    return of(user).pipe(delay(300));
  }

  addUser(user: Omit<User, 'id'>): Observable<User> {
    const newUser = { ...user, id: this._users().length + 1 };
    this._users.update((users) => [...users, newUser]);
    return of(newUser).pipe(delay(500));
  }

  updateUser(user: User): Observable<User> {
    this._users.update((users) => users.map((u) => (u.id === user.id ? user : u)));
    return of(user).pipe(delay(500));
  }

  deleteUser(id: number): Observable<boolean> {
    this._users.update((users) => users.filter((u) => u.id !== id));
    return of(true).pipe(delay(500));
  }
}
