// @vitest-environment jsdom
import { TestBed } from '@angular/core/testing';
import { UserListPage } from './user-list-page';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';
import { signal, Injector, runInInjectionContext } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { describe, it, expect, beforeEach, afterEach, vi, beforeAll } from 'vitest';
import { User } from '../../../../core/models/user';

describe('UserListPage Class Logic', () => {
  let component: UserListPage;
  let userServiceMock: any;

  const mockUsers: User[] = [
    {
      id: 1,
      name: 'Admin One',
      email: 'admin@test.com',
      role: 'admin',
      active: true,
      lastLogin: new Date(),
    },
    {
      id: 2,
      name: 'User Two',
      email: 'user@test.com',
      role: 'user',
      active: true,
      lastLogin: new Date(),
    },
    {
      id: 3,
      name: 'Editor Three',
      email: 'editor@test.com',
      role: 'editor',
      active: false,
      lastLogin: new Date(),
    },
  ];

  beforeEach(() => {
    vi.useFakeTimers();

    userServiceMock = {
      users: signal(mockUsers),
      deleteUser: vi.fn().mockReturnValue(of(true)),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: ActivatedRoute, useValue: {} },
      ],
    });

    component = TestBed.runInInjectionContext(() => new UserListPage());
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter users by search term', () => {
    // Initial state
    expect(component.filteredUsers().length).toBe(3);

    // Update form control
    component.searchControl.setValue('Admin');

    // Advance time for debounce
    vi.advanceTimersByTime(300);

    expect(component.filteredUsers().length).toBe(1);
    expect(component.filteredUsers()[0].name).toBe('Admin One');

    // Clear search
    component.searchControl.setValue('');
    vi.advanceTimersByTime(300);
    expect(component.filteredUsers().length).toBe(3);
  });

  it('should filter users by role', () => {
    component.roleControl.setValue('editor');
    // toSignal checks
    expect(component.filteredUsers().length).toBe(1);
    expect(component.filteredUsers()[0].role).toBe('editor');
  });

  it('should filter by combined search and role', () => {
    component.searchControl.setValue('Three');
    vi.advanceTimersByTime(300);
    component.roleControl.setValue('editor');

    expect(component.filteredUsers().length).toBe(1);
    expect(component.filteredUsers()[0].name).toBe('Editor Three');

    // Mismatch
    component.roleControl.setValue('admin');
    expect(component.filteredUsers().length).toBe(0);
  });

  it('should handle delete user flow', () => {
    const user = mockUsers[0];

    expect(component.userToDelete()).toBeNull();

    // Init delete
    component.initDeleteUser(user);
    expect(component.userToDelete()).toEqual(user);

    // Cancel
    component.cancelDelete();
    expect(component.userToDelete()).toBeNull();

    // Confirm
    component.initDeleteUser(user);
    component.confirmDelete();

    expect(userServiceMock.deleteUser).toHaveBeenCalledWith(user.id);
    expect(component.userToDelete()).toBeNull();
  });

  it('should not delete if no user selected', () => {
    // Confirm without user
    component.userToDelete.set(null);
    component.confirmDelete();
    expect(userServiceMock.deleteUser).not.toHaveBeenCalled();
  });

  it('should handle null search term gracefully', () => {
    // Force null value into search control if possible or mock the signal return
    component.searchControl.setValue(null);
    vi.advanceTimersByTime(300);
    expect(component.filteredUsers().length).toBe(3);
  });
});
