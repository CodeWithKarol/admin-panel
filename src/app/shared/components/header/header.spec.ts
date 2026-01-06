// @vitest-environment jsdom
import { TestBed } from '@angular/core/testing';
import { Header } from './header';
import { AuthService } from '../../../core/auth/auth-service';
import { LayoutService } from '../../../core/layout/layout-service';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { describe, it, expect, beforeEach, afterEach, vi, beforeAll } from 'vitest';

describe('Header Class Logic', () => {
  let component: Header;
  let authServiceSpy: any;
  let layoutServiceSpy: any;

  beforeEach(() => {
    // Mock AuthService
    authServiceSpy = {
      logout: vi.fn(),
      currentUser: vi.fn().mockReturnValue({ id: 1, name: 'Test User', role: 'admin' }),
      isAuthenticated: vi.fn().mockReturnValue(true),
    };

    // Mock LayoutService
    layoutServiceSpy = {
      toggleSidebar: vi.fn(),
      isSidebarOpen: vi.fn().mockReturnValue(false),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: LayoutService, useValue: layoutServiceSpy },
      ],
    });

    // Instantiate inside TestBed injection context to handle inject() calls
    component = TestBed.runInInjectionContext(() => new Header());
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.logout when logout is called', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });

  it('should call layoutService.toggleSidebar when toggleSidebar is called', () => {
    component.toggleSidebar();
    expect(layoutServiceSpy.toggleSidebar).toHaveBeenCalled();
  });

  it('should toggle dark mode class on document element', () => {
    document.documentElement.classList.remove('dark');

    component.toggleDarkMode();
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    component.toggleDarkMode();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should have initial signal values', () => {
    expect(component.showNotifications()).toBe(false);
    expect(component.showProfileMenu()).toBe(false);
  });

  it('should toggle notifications', () => {
    component.toggleNotifications();
    expect(component.showNotifications()).toBe(true);
    component.toggleNotifications();
    expect(component.showNotifications()).toBe(false);
  });

  it('should toggle profile menu', () => {
    component.toggleProfileMenu();
    expect(component.showProfileMenu()).toBe(true);
    component.toggleProfileMenu();
    expect(component.showProfileMenu()).toBe(false);
  });
});
