import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainLayoutComponent } from './main-layout';
import { AuthService } from '../../../core/services/auth/auth.service';
import { AnalyticsService } from '../../../core/services/analytics/analytics.service';
import { MilestoneService } from '../../../core/services/milestone/milestone.service';
import { InspectorService } from '../../../core/services/inspector/inspector.service';
import { ModalService } from '../../../core/services/modal/modal.service';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;
  let authService: { currentUser: ReturnType<typeof signal>; logout: ReturnType<typeof vi.fn> };
  let analyticsService: {
    activities: ReturnType<typeof signal>;
    teamMembers: ReturnType<typeof signal>;
  };
  let milestoneService: { milestones: ReturnType<typeof signal> };
  let inspectorService: {
    open: ReturnType<typeof vi.fn>;
    isOpen: ReturnType<typeof signal<boolean>>;
    activeData: ReturnType<typeof signal<unknown>>;
    activeType: ReturnType<typeof signal<string | null>>;
    isCreating: ReturnType<typeof signal<boolean>>;
  };

  beforeEach(async () => {
    authService = { currentUser: signal({ name: 'Admin' }), logout: vi.fn() };
    analyticsService = { activities: signal([]), teamMembers: signal([]) };
    milestoneService = { milestones: signal([]) };
    inspectorService = {
      open: vi.fn(),
      isOpen: signal(false),
      activeData: signal(null),
      activeType: signal(null),
      isCreating: signal(false),
    };

    const modalService = {
      open: vi.fn(),
      close: vi.fn(),
      isOpen: signal(false),
      config: signal(null),
    };

    await TestBed.configureTestingModule({
      imports: [MainLayoutComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
        { provide: AnalyticsService, useValue: analyticsService },
        { provide: MilestoneService, useValue: milestoneService },
        { provide: InspectorService, useValue: inspectorService },
        { provide: ModalService, useValue: modalService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should toggle sidebar', () => {
    expect(component.isSidebarOpen()).toBe(false);
    component.toggleSidebar();
    expect(component.isSidebarOpen()).toBe(true);
    component.closeSidebar();
    expect(component.isSidebarOpen()).toBe(false);
  });

  it('should calculate search results correctly', () => {
    component.searchQuery.set('Over');
    expect(component.searchResults()).toContainEqual(
      expect.objectContaining({ label: 'Overview' }),
    );

    analyticsService.teamMembers.set([{ name: 'Alice' }]);
    component.searchQuery.set('Ali');
    expect(component.searchResults()).toContainEqual(
      expect.objectContaining({ label: 'Alice', type: 'Team' }),
    );
  });

  it('should handle search results correctly', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.handleSearchResult({ type: 'Navigation', route: '/team' });
    expect(navigateSpy).toHaveBeenCalledWith(['/team']);

    const milestone = { id: 'm1' };
    component.handleSearchResult({ type: 'Project', data: milestone });
    expect(inspectorService.open).toHaveBeenCalledWith(milestone, 'milestone');
  });

  it('should update mobile status on resize', () => {
    // Mock window innerWidth
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 });
    component.onResize();
    expect(component.isMobile()).toBe(true);

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1500,
    });
    component.onResize();
    expect(component.isMobile()).toBe(false);
  });
});
