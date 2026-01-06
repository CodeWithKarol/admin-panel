// @vitest-environment jsdom
import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth-service';
import { User } from './auth.models';
import { describe, it, expect, beforeEach, afterEach, vi, beforeAll } from 'vitest';

describe('AuthService', () => {
  let service: AuthService;
  let routerSpy: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    // Mock Router
    const routerMock = {
      navigate: vi.fn(),
    };

    // Clean localStorage before each test
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [AuthService, { provide: Router, useValue: routerMock }],
    });

    service = TestBed.inject(AuthService);
    routerSpy = TestBed.inject(Router) as any;
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    localStorage.clear();
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with null user if localStorage is empty', () => {
      expect(service.currentUser()).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should initialize with user from localStorage if present', () => {
      const user: User = { id: 1, username: 'testuser', email: 'test@example.com', role: 'admin' };
      localStorage.setItem('user', JSON.stringify(user));

      // Re-create service to trigger constructor
      TestBed.resetTestingModule();
      const routerMock = { navigate: vi.fn() };
      TestBed.configureTestingModule({
        providers: [AuthService, { provide: Router, useValue: routerMock }],
      });
      const newService = TestBed.inject(AuthService);

      expect(newService.currentUser()).toEqual(user);
      expect(newService.isAuthenticated()).toBe(true);
    });
  });

  describe('login', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should set user and navigate on successful login', () => {
      const credentials = { email: 'admin@example.com', password: 'password' };
      let response: any;

      service.login(credentials).subscribe((res) => {
        response = res;
      });

      vi.advanceTimersByTime(1000);

      expect(response).toBeTruthy();
      expect(response.user).toBeTruthy();
      expect(response.user.email).toBe(credentials.email);
      expect(service.currentUser()).toBeTruthy();
      expect(localStorage.getItem('user')).toBeTruthy();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    // The service implementation shows it always returns success mock for now,
    // it doesn't seem to have failure logic based on the read content.
    // If I want to test failure, I would need to modify the service or mock it differently.
    // Given the current service code only returns `of(response)`, it seems calls always succeed.
    // I will remove the failure test or adapt it if I see validation in service.
  });

  describe('logout', () => {
    it('should clear user and navigate to login', () => {
      // Set initial state
      const user: User = { id: 1, username: 'test', email: 'test@example.com', role: 'user' };
      localStorage.setItem('user', JSON.stringify(user));

      // We need to set the internal signal.
      TestBed.resetTestingModule();
      const routerMock = { navigate: vi.fn() };
      TestBed.configureTestingModule({
        providers: [AuthService, { provide: Router, useValue: routerMock }],
      });
      const serviceWithUser = TestBed.inject(AuthService);
      const routerWithUser = TestBed.inject(Router);

      expect(serviceWithUser.currentUser()).toEqual(user);

      serviceWithUser.logout();

      expect(serviceWithUser.currentUser()).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
      expect(routerWithUser.navigate).toHaveBeenCalledWith(['/auth/login']);
    });
  });
});
