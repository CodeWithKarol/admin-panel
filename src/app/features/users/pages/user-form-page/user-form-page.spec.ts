/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserFormPage } from './user-form-page';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi, describe, it, expect } from 'vitest';

describe('UserFormPage', () => {
  let component: UserFormPage;
  let fixture: ComponentFixture<UserFormPage>;
  let userServiceMock: any;
  let router: Router;
  let activatedRouteMock: any;

  // Helper to setup the component with specific route params
  const setupComponent = async (routeId: string | null, mockUser?: any) => {
    userServiceMock = {
      getUserById: vi.fn(),
      addUser: vi.fn(),
      updateUser: vi.fn(),
    };

    if (mockUser) {
      userServiceMock.getUserById.mockReturnValue(of(mockUser));
    } else {
      userServiceMock.getUserById.mockReturnValue(of(undefined));
    }

    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: vi.fn().mockReturnValue(routeId),
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [UserFormPage],
      providers: [
        provideRouter([]),
        { provide: UserService, useValue: userServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    // Mock navigate to prevent actual navigation and allow tracking
    vi.spyOn(router, 'navigate').mockImplementation(async () => true);

    fixture = TestBed.createComponent(UserFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('should create', async () => {
    await setupComponent('new');
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize in add mode when id is "new"', async () => {
      await setupComponent('new');
      expect(component.isEditMode()).toBe(false);
      expect(userServiceMock.getUserById).not.toHaveBeenCalled();
    });

    it('should initialize in edit mode and load user when id is provided', async () => {
      const mockUser = {
        id: 123,
        name: 'John',
        email: 'john@example.com',
        role: 'admin',
        active: true,
      };

      await setupComponent('123', mockUser);

      expect(component.isEditMode()).toBe(true);
      expect(component.userId()).toBe(123);
      expect(userServiceMock.getUserById).toHaveBeenCalledWith(123);
      expect(component.userForm.value).toMatchObject({
        name: 'John',
        email: 'john@example.com',
        role: 'admin',
        active: true,
      });
    });
  });

  describe('onSubmit', () => {
    it('should not submit if form is invalid', async () => {
      await setupComponent('new');
      component.userForm.setValue({
        name: '', // Invalid required
        email: 'invalid-email',
        role: 'user',
        active: true,
      });

      component.onSubmit();

      expect(userServiceMock.addUser).not.toHaveBeenCalled();
      expect(userServiceMock.updateUser).not.toHaveBeenCalled();
    });

    it('should call addUser when in add mode', async () => {
      await setupComponent('new');
      userServiceMock.addUser.mockReturnValue(of({}));

      component.userForm.setValue({
        name: 'New User',
        email: 'new@example.com',
        role: 'user',
        active: true,
      });

      component.onSubmit();

      expect(userServiceMock.addUser).toHaveBeenCalledWith({
        name: 'New User',
        email: 'new@example.com',
        role: 'user',
        active: true,
      });
      expect(router.navigate).toHaveBeenCalledWith(['/users']);
    });

    it('should call updateUser when in edit mode', async () => {
      const mockUser = {
        id: 123,
        name: 'Old',
        email: 'old@example.com',
        role: 'user',
        active: true,
      };
      await setupComponent('123', mockUser);
      userServiceMock.updateUser.mockReturnValue(of({}));

      component.userForm.patchValue({
        name: 'Updated Name',
      });

      component.onSubmit();

      expect(userServiceMock.updateUser).toHaveBeenCalledWith({
        id: 123,
        name: 'Updated Name',
        email: 'old@example.com',
        role: 'user',
        active: true,
      });
      expect(router.navigate).toHaveBeenCalledWith(['/users']);
    });

    it('should set isSaving to false on error', async () => {
      await setupComponent('new');
      userServiceMock.addUser.mockReturnValue(throwError(() => new Error('Error')));

      component.userForm.setValue({
        name: 'New User',
        email: 'new@example.com',
        role: 'user',
        active: true,
      });

      component.onSubmit();

      expect(component.isSaving()).toBe(false);
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});
