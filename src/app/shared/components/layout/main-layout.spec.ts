import { TestBed } from '@angular/core/testing';
import { MainLayout } from './main-layout';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('MainLayout', () => {
  let component: MainLayout;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MainLayout,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
          },
        },
      ],
    });

    component = TestBed.runInInjectionContext(() => new MainLayout());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
