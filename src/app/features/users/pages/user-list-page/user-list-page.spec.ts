import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserListPage } from './user-list-page';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { User } from '../../../../core/models/user';
import { AuthService } from '../../../../core/auth/auth-service';

describe('UserListPage', () => {
  let component: UserListPage;
  let fixture: ComponentFixture<UserListPage>;
  let userServiceMock: any;
  let notificationServiceMock: any;
  let authServiceMock: any;

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

  beforeEach(async () => {
    vi.useFakeTimers();

    userServiceMock = {
      users: signal(mockUsers),
      deleteUser: vi.fn().mockReturnValue(of(true)),
    };

    notificationServiceMock = {
      add: vi.fn(),
    };

    authServiceMock = {
      currentUser: signal(null),
    };

    await TestBed.configureTestingModule({
      imports: [UserListPage],
      providers: [
        provideRouter([]),
        { provide: UserService, useValue: userServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
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
    component.addFilter({ label: 'Editor', type: 'role', value: 'editor' });

    expect(component.filteredUsers().length).toBe(1);
    expect(component.filteredUsers()[0].role).toBe('editor');
  });

  it('should filter by combined search and role', () => {
    // Add 'user' role filter (matches User Two)
    component.addFilter({ label: 'User', type: 'role', value: 'user' });

    // Search 'User' (matches User Two)
    component.searchControl.setValue('User');
    vi.advanceTimersByTime(300);

    expect(component.filteredUsers().length).toBe(1);
    expect(component.filteredUsers()[0].id).toBe(2);
  });
});
