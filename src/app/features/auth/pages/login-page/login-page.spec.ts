/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login-page';
import { AuthService } from '../../../../core/auth/auth-service';
import { of, throwError, Subject } from 'rxjs';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let authServiceMock: { login: any };

  beforeEach(async () => {
    authServiceMock = {
      login: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LoginPage], // Standalone component
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.loginForm.getRawValue()).toEqual({ email: '', password: '' });
    expect(component.loginForm.valid).toBe(false);
  });

  it('should expose form controls via getters', () => {
    expect(component.email).toBe(component.loginForm.get('email'));
    expect(component.password).toBe(component.loginForm.get('password'));
  });

  describe('onSubmit', () => {
    it('should not call authService.login if form is invalid', () => {
      component.loginForm.patchValue({ email: 'invalid' }); // Password missing
      component.onSubmit();
      expect(authServiceMock.login).not.toHaveBeenCalled();
    });

    it('should set isLoading to true during login execution', () => {
      const loginSubject = new Subject<any>();
      authServiceMock.login.mockReturnValue(loginSubject.asObservable());

      component.loginForm.setValue({ email: 'test@test.com', password: 'password' });
      component.onSubmit();

      expect(component.isLoading()).toBe(true);

      loginSubject.next({ token: '123' });
      loginSubject.complete();

      expect(component.isLoading()).toBe(false);
    });

    it('should call authService.login with correct credentials when valid', () => {
      authServiceMock.login.mockReturnValue(of({ token: '123' }));
      component.loginForm.setValue({ email: 'test@test.com', password: 'password' });

      component.onSubmit();

      expect(authServiceMock.login).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password',
      });
    });

    it('should handle login error and reset isLoading', () => {
      authServiceMock.login.mockReturnValue(throwError(() => new Error('Login failed')));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

      component.loginForm.setValue({ email: 'test@test.com', password: 'password' });
      component.onSubmit();

      expect(component.isLoading()).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
    });
  });
});
