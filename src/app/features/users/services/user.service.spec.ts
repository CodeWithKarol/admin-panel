// @vitest-environment jsdom
import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { UserService } from './user.service';
import { User } from '../../../core/models/user';
import { describe, it, expect, beforeEach, afterEach, vi, beforeAll } from 'vitest';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    vi.useFakeTimers();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all users', () => {
    let users: User[] = [];
    service.getUsers().subscribe((res) => (users = res));

    vi.advanceTimersByTime(500);

    expect(users.length).toBeGreaterThan(0);
    expect(users.length).toBe(5); // Initial mock data has 5 users
  });

  it('should get user by id', () => {
    let user: User | undefined;
    service.getUserById(1).subscribe((res) => (user = res));

    vi.advanceTimersByTime(300);

    expect(user).toBeTruthy();
    expect(user?.id).toBe(1);
    expect(user?.name).toBe('Admin User');
  });

  it('should return undefined for non-existent user id', () => {
    let user: User | undefined | null = null;
    service.getUserById(999).subscribe((res) => (user = res));

    vi.advanceTimersByTime(300);

    expect(user).toBeUndefined();
  });

  it('should add a new user', () => {
    const newUser: Omit<User, 'id'> = {
      name: 'New User',
      email: 'new@example.com',
      role: 'user',
      active: true,
      lastLogin: new Date(),
    };

    let addedUser: User | undefined;
    service.addUser(newUser).subscribe((res) => (addedUser = res));

    vi.advanceTimersByTime(500);

    expect(addedUser).toBeTruthy();
    expect(addedUser?.id).toBe(6); // 5 + 1
    expect(addedUser?.name).toBe('New User');

    // Verify it's in the list
    expect(service.users().length).toBe(6);
    expect(service.users().find((u) => u.id === 6)).toBeTruthy();
  });

  it('should update an existing user', () => {
    const updateData: User = {
      id: 2,
      name: 'John Updated',
      email: 'john@example.com',
      role: 'user',
      active: false,
      lastLogin: new Date(),
    };

    let updatedUser: User | undefined;
    service.updateUser(updateData).subscribe((res) => (updatedUser = res));

    vi.advanceTimersByTime(500);

    expect(updatedUser).toEqual(updateData);

    const userInList = service.users().find((u) => u.id === 2);
    expect(userInList?.name).toBe('John Updated');
    expect(userInList?.active).toBe(false);
  });

  it('should delete a user', () => {
    let success: boolean | undefined;
    service.deleteUser(3).subscribe((res) => (success = res));

    vi.advanceTimersByTime(500);

    expect(success).toBe(true);
    expect(service.users().length).toBe(4); // 5 - 1
    expect(service.users().find((u) => u.id === 3)).toBeUndefined();
  });
});
