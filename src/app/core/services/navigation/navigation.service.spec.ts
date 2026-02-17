import { TestBed } from '@angular/core/testing';
import { NavigationService } from './navigation.service';
import { Router } from '@angular/router';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('NavigationService', () => {
  let service: NavigationService;
  let routerSpy: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    vi.useFakeTimers();
    routerSpy = { navigate: vi.fn().mockReturnValue(Promise.resolve(true)) };

    TestBed.configureTestingModule({
      providers: [
        NavigationService,
        { provide: Router, useValue: routerSpy }
      ]
    });
    service = TestBed.inject(NavigationService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with isTransitioning false', () => {
    expect(service.isTransitioning()).toBe(false);
  });

  it('should manage transition state during navigation', async () => {
    const route = '/test-route';
    // Catch errors because 'test-route' won't match any real routes in the spy setup
    const navigationPromise = service.navigateWithManifest(route).catch(() => {
      // Intentionally empty: we are only testing transition state
    });

    // Initial state after calling
    expect(service.isTransitioning()).toBe(true);

    // Advance for cinematic delay (800ms)
    await vi.advanceTimersByTimeAsync(800);
    expect(routerSpy.navigate).toHaveBeenCalledWith([route]);

    // Advance for settling delay (200ms)
    await vi.advanceTimersByTimeAsync(200);
    expect(service.isTransitioning()).toBe(false);
    
    await navigationPromise;
  });
});
