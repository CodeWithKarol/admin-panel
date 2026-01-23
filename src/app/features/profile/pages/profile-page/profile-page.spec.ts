import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilePage } from './profile-page';
import { AuthService } from '../../../../core/auth/auth-service';
import { NotificationService } from '../../../../core/services/notification.service';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;
  let authServiceSpy: {
    currentUser: ReturnType<typeof signal>;
    updateProfile: ReturnType<typeof vi.fn>;
  };
  let notificationServiceSpy: { add: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authServiceSpy = {
      currentUser: signal({
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        avatar: 'avatar.png',
      }),
      updateProfile: vi.fn(),
    };

    notificationServiceSpy = {
      add: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ProfilePage],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with current user data', () => {
    const user = authServiceSpy.currentUser() as { name: string; email: string };
    expect(component.profileForm.value).toEqual({
      name: user.name,
      email: user.email,
    });
  });

  it('should update profile when form is valid', () => {
    component.profileForm.controls.name.setValue('New Name');
    authServiceSpy.updateProfile.mockReturnValue(of({}));

    component.saveProfile();

    expect(authServiceSpy.updateProfile).toHaveBeenCalledWith({
      name: 'New Name',
      email: 'test@example.com',
    });
    expect(notificationServiceSpy.add).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'success',
      }),
    );
  });

  it('should handle update profile error', () => {
    component.profileForm.controls.name.setValue('New Name');
    authServiceSpy.updateProfile.mockReturnValue(throwError(() => new Error('Error')));

    component.saveProfile();

    expect(authServiceSpy.updateProfile).toHaveBeenCalled();
    expect(notificationServiceSpy.add).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'error',
      }),
    );
  });

  it('should validate password match', () => {
    component.passwordForm.patchValue({
      currentPassword: 'old',
      newPassword: 'newpassword',
      confirmPassword: 'wrongpassword',
    });

    component.changePassword();

    expect(notificationServiceSpy.add).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Passwords do not match',
        type: 'error',
      }),
    );
  });
});
