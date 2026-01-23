import { Component, ChangeDetectionStrategy, inject, signal, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { AuthService } from '../../../../core/auth/auth-service';
import { NotificationService } from '../../../../core/services/notification.service';
import { LucideAngularModule, User, Mail, Shield, Save, Key, Bell, Moon } from 'lucide-angular';

@Component({
  selector: 'app-profile-page',
  imports: [ReactiveFormsModule, LucideAngularModule, TitleCasePipe],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  readonly UserIcon = User;
  readonly Mail = Mail;
  readonly Shield = Shield;
  readonly Save = Save;
  readonly Key = Key;
  readonly Bell = Bell;
  readonly Moon = Moon;

  readonly currentUser = this.authService.currentUser;

  readonly isSaving = signal(false);
  readonly activeTab = signal<'general' | 'security' | 'preferences'>('general');

  readonly profileForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
  });

  readonly passwordForm = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
  });

  constructor() {
    effect(() => {
      const user = this.currentUser();
      if (user) {
        this.profileForm.patchValue(
          {
            name: user.name,
            email: user.email,
          },
          { emitEvent: false },
        );
      }
    });
  }

  saveProfile() {
    if (this.profileForm.invalid) return;

    this.isSaving.set(true);
    const updates = this.profileForm.getRawValue();

    this.authService
      .updateProfile({
        name: updates.name!,
        email: updates.email!,
      })
      .subscribe({
        next: () => {
          this.isSaving.set(false);
          this.notificationService.add({
            title: 'Profile',
            message: 'Profile updated successfully',
            type: 'success',
          });
        },
        error: () => {
          this.isSaving.set(false);
          this.notificationService.add({
            title: 'Profile',
            message: 'Failed to update profile',
            type: 'error',
          });
        },
      });
  }

  changePassword() {
    if (this.passwordForm.invalid) return;

    const { newPassword, confirmPassword } = this.passwordForm.getRawValue();

    if (newPassword !== confirmPassword) {
      this.notificationService.add({
        title: 'Security',
        message: 'Passwords do not match',
        type: 'error',
      });
      return;
    }

    this.isSaving.set(true);
    // Mock simulation
    setTimeout(() => {
      this.isSaving.set(false);
      this.passwordForm.reset();
      this.notificationService.add({
        title: 'Security',
        message: 'Password changed successfully',
        type: 'success',
      });
    }, 1500);
  }
}
