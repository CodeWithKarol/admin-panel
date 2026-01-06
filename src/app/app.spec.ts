import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [App],
    });
  });

  it('should create the app', () => {
    const app = TestBed.runInInjectionContext(() => new App());
    expect(app).toBeTruthy();
  });
});
