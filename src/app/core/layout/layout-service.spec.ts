import { TestBed } from '@angular/core/testing';
import { LayoutService } from './layout-service';

describe('LayoutService', () => {
  let service: LayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LayoutService],
    });
    service = TestBed.inject(LayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with sidebar closed', () => {
    expect(service.isSidebarOpen()).toBe(false);
  });

  it('should toggle sidebar', () => {
    service.toggleSidebar();
    expect(service.isSidebarOpen()).toBe(true);
    service.toggleSidebar();
    expect(service.isSidebarOpen()).toBe(false);
  });

  it('should close sidebar', () => {
    service.isSidebarOpen.set(true);
    service.closeSidebar();
    expect(service.isSidebarOpen()).toBe(false);
  });
});
