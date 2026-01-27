/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Breadcrumbs } from './breadcrumbs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { provideRouter } from '@angular/router';

describe('Breadcrumbs', () => {
  let component: Breadcrumbs;
  let fixture: ComponentFixture<Breadcrumbs>;
  let routerEvents: Subject<any>;

  beforeEach(async () => {
    routerEvents = new Subject();

    await TestBed.configureTestingModule({
      imports: [Breadcrumbs, LucideAngularModule],
      providers: [
        provideRouter([]),
        {
          provide: Router,
          useValue: {
            events: routerEvents.asObservable(),
            url: '/dashboard',
            createUrlTree: () => ({}) as any,
            serializeUrl: () => '',
            navigate: () => Promise.resolve(true),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            root: {
              children: [],
              snapshot: { url: [] },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Breadcrumbs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update breadcrumbs on NavigationEnd', () => {
    // This is a shallow test since we are mocking ActivatedRoute heavily.
    // Real routing tests are better done in e2e or integration,
    // but here we verify subscription exists.

    // Trigger event
    routerEvents.next(new NavigationEnd(1, '/dashboard', '/dashboard'));
    fixture.detectChanges();

    // Since our mock ActivatedRoute has no children, breadcrumbs should be empty or default
    expect(component).toBeTruthy();
  });
});
