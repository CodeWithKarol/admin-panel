import { TestBed } from '@angular/core/testing';
import { LoginPage } from './login-page';
import { AuthService } from '../../../../core/auth/auth-service';
import { of, throwError } from 'rxjs';

describe('LoginPage', () => {
  let component: LoginPage;
  let authServiceMock: any;

  beforeEach(() => {
    authServiceMock = {
      login: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [LoginPage, { provide: AuthService, useValue: authServiceMock }],
    });

    component = TestBed.runInInjectionContext(() => new LoginPage());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('should not login if form is invalid', () => {
      component.loginForm.setValue({
        email: 'invalid', // invalid email
        password: '', // required
      });

      component.onSubmit();

      expect(authServiceMock.login).not.toHaveBeenCalled();
    });

    it('should login with valid credentials', () => {
      authServiceMock.login.mockReturnValue(of({ token: 'abc' }));

      component.loginForm.setValue({
        email: 'test@example.com',
        password: 'password123',
      });

      component.onSubmit();

      expect(component.isLoading()).toBe(false); // Should be reset after success
      expect(authServiceMock.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should handle login error', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      authServiceMock.login.mockReturnValue(throwError(() => new Error('Auth failed')));

      component.loginForm.setValue({
        email: 'test@example.com',
        password: 'wrong',
      });

      component.onSubmit();

      expect(authServiceMock.login).toHaveBeenCalled();
      expect(component.isLoading()).toBe(false); // Should be reset after error
      expect(consoleSpy).toHaveBeenCalledWith('Login failed', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });
});
