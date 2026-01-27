/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardPage } from './dashboard-page';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthService } from '../../../../core/auth/auth-service';
import { signal } from '@angular/core';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;
  let notificationServiceSpy: { add: ReturnType<typeof vi.fn> };
  let authServiceMock: any;

  beforeEach(async () => {
    vi.useFakeTimers();
    notificationServiceSpy = {
      add: vi.fn(),
    };

    authServiceMock = {
      currentUser: signal(null),
    };

    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ngOnInit runs
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with loading state', () => {
    // ngOnInit started the timer but it hasn't finished
    expect(component['isLoading']()).toBe(true);
  });

  it('should turn off loading after timeout', () => {
    expect(component['isLoading']()).toBe(true);
    vi.advanceTimersByTime(1500);
    expect(component['isLoading']()).toBe(false);
  });

  it('should show export notification', () => {
    component.exportData();
    expect(notificationServiceSpy.add).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Export',
        message: 'Downloading report...',
        type: 'info',
      }),
    );

    vi.advanceTimersByTime(1000);

    expect(notificationServiceSpy.add).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Export',
        message: 'Report downloaded successfully',
        type: 'success',
      }),
    );
  });
});
