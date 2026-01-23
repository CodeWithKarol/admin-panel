// @vitest-environment jsdom
import { TestBed } from '@angular/core/testing';
import { Header } from './header';
import { AuthService } from '../../../core/auth/auth-service';
import { LayoutService } from '../../../core/layout/layout-service';
import { ThemeService } from '../../../core/theme/theme.service';
import { ToastService } from '../../../core/services/toast.service';
import { NotificationService } from '../../../core/services/notification.service';
import { signal } from '@angular/core';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { describe, it, expect, beforeEach, afterEach, vi, beforeAll } from 'vitest';

describe('Header Class Logic', () => {
  let component: Header;
  let authServiceSpy: any;
  let layoutServiceSpy: any;
  let themeServiceSpy: any;
  let toastServiceSpy: any;
  let notificationServiceSpy: any;

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

    // Mock ThemeService
    themeServiceSpy = {
      isDarkMode: signal(false),
      brandColor: signal('indigo'),
      toggleDarkMode: vi.fn(),
    };

    // Mock ToastService
    toastServiceSpy = {
      show: vi.fn(),
    };

    // Mock NotificationService
    notificationServiceSpy = {
      count: signal(0),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: LayoutService, useValue: layoutServiceSpy },
        { provide: ThemeService, useValue: themeServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
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

  it('should call themeService.toggleDarkMode when toggleDarkMode is called', () => {
    component.toggleDarkMode();
    expect(themeServiceSpy.toggleDarkMode).toHaveBeenCalled();
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
