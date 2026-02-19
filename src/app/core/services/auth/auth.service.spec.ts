import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  const originalLocation = window.location;

  beforeEach(() => {
    // Mock window.location.reload
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: vi.fn() },
    });

    TestBed.configureTestingModule({
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  it('should be created with a default user', () => {
    expect(service.currentUser()).not.toBeNull();
    expect(service.currentUser()?.name).toBe('Admin User');
  });

  it('should clear currentUser and reload on logout', () => {
    service.logout();
    expect(service.currentUser()).toBeNull();
    expect(window.location.reload).toHaveBeenCalled();
  });
});
