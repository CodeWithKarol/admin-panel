import { TestBed } from '@angular/core/testing';
import { Sidebar } from './sidebar';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { LayoutService } from '../../../core/layout/layout-service';

describe('Sidebar', () => {
  let component: Sidebar;
  let layoutServiceMock: any;

  beforeEach(() => {
    layoutServiceMock = {
      closeSidebar: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        Sidebar,
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
