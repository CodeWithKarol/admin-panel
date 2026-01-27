import { TestBed } from '@angular/core/testing';
import { Sidebar } from './sidebar';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { LayoutService } from '../../../core/layout/layout-service';
import { AuthService } from '../../../core/auth/auth-service';
import { signal } from '@angular/core';
import { vi, describe, beforeEach, it, expect } from 'vitest';

describe('Sidebar', () => {
  let component: Sidebar;
  let layoutServiceMock: { closeSidebar: ReturnType<typeof vi.fn> };
  let authServiceMock: { currentUser: ReturnType<typeof signal> };

  beforeEach(() => {
    layoutServiceMock = {
      closeSidebar: vi.fn(),
    };

    authServiceMock = {
      currentUser: signal(null),
    };

    TestBed.configureTestingModule({
      providers: [
        Sidebar,
        { provide: AuthService, useValue: authServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
          },
        },
        { provide: LayoutService, useValue: layoutServiceMock },
      ],
    });

    component = TestBed.runInInjectionContext(() => new Sidebar());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call closeSidebar on layout service when closeSidebar is called', () => {
    component.closeSidebar();
    expect(layoutServiceMock.closeSidebar).toHaveBeenCalled();
  });
});
