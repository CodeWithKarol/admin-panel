import { TestBed } from '@angular/core/testing';
import { UserFormPage } from './user-form-page';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('UserFormPage', () => {
  let component: UserFormPage;
  let userServiceMock: any;
  let routerMock: any;
  let activatedRouteMock: any;

  // Helper to setup the component with specific route params
  const setupComponent = (routeId: string | null) => {
    userServiceMock = {
      getUserById: vi.fn(),
      addUser: vi.fn(),
      updateUser: vi.fn(),
    };

    routerMock = {
      navigate: vi.fn(),
    };

    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: vi.fn().mockReturnValue(routeId),
        },
      },
    };

    TestBed.configureTestingModule({
      providers: [
        UserFormPage,
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    });

    component = TestBed.runInInjectionContext(() => new UserFormPage());
  };

  it('should create', () => {
    setupComponent('new');
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize in add mode when id is "new"', () => {
      setupComponent('new');
      component.ngOnInit();

      expect(component.isEditMode()).toBe(false);
      expect(userServiceMock.getUserById).not.toHaveBeenCalled();
    });

    it('should initialize in edit mode and load user when id is provided', () => {
      setupComponent('123');
      const mockUser = {
        id: 123,
        name: 'John',
        email: 'john@example.com',
        role: 'admin',
        active: true,
      };
      userServiceMock.getUserById.mockReturnValue(of(mockUser));

      component.ngOnInit();

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
    it('should not submit if form is invalid', () => {
      setupComponent('new');
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

    it('should call addUser when in add mode', () => {
      setupComponent('new');
      userServiceMock.addUser.mockReturnValue(of({}));

      component.userForm.setValue({
        name: 'New User',
        email: 'new@example.com',
        role: 'user',
        active: true,
      });

      component.onSubmit();

      expect(component.isSaving()).toBe(true); // Should be true during (though sync here) or handled?
      // Note: Observable completes synchronously here, so isSaving might flicker or be false if set in error/complete?
      // Looking at code: next: () => navigate... error: => isSaving(false).
      // It doesn't set isSaving(false) in next?
      // Code: request.subscribe({ next: () => router.navigate..., error: ... })
      // It does NOT set isSaving(false) on success (presumably because we navigate away).

      expect(userServiceMock.addUser).toHaveBeenCalledWith({
        name: 'New User',
        email: 'new@example.com',
        role: 'user',
        active: true,
      });
      expect(routerMock.navigate).toHaveBeenCalledWith(['/users']);
    });

    it('should call updateUser when in edit mode', () => {
      setupComponent('123');
      const mockUser = {
        id: 123,
        name: 'Old',
        email: 'old@example.com',
        role: 'user',
        active: true,
      };
      userServiceMock.getUserById.mockReturnValue(of(mockUser));
      userServiceMock.updateUser.mockReturnValue(of({}));

      component.ngOnInit(); // Load user to set edit mode and ID

      component.userForm.patchValue({
        name: 'Updated User',
      });

      component.onSubmit();

      expect(userServiceMock.updateUser).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 123,
          name: 'Updated User',
        })
      );
      expect(routerMock.navigate).toHaveBeenCalledWith(['/users']);
    });

    it('should handle error during submission', () => {
      setupComponent('new');
      userServiceMock.addUser.mockReturnValue(throwError(() => new Error('Failed')));

      component.userForm.setValue({
        name: 'User',
        email: 'user@example.com',
        role: 'user',
        active: true,
      });

      component.onSubmit();

      expect(userServiceMock.addUser).toHaveBeenCalled();
      expect(component.isSaving()).toBe(false); // Reset on error
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });
  });
});
