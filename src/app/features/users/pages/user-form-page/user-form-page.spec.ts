import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserFormPage } from './user-form-page';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('UserFormPage', () => {
  let component: UserFormPage;
  let fixture: ComponentFixture<UserFormPage>;
  let userServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    userServiceMock = {
      getUserById: vi.fn().mockReturnValue(of(null)),
      addUser: vi.fn().mockReturnValue(of(undefined)),
      updateUser: vi.fn().mockReturnValue(of(undefined)),
    };

    routerMock = {
      navigate: vi.fn(),
      createUrlTree: vi.fn(),
      serializeUrl: vi.fn(),
      events: of(undefined),
    };

    await TestBed.configureTestingModule({
      imports: [UserFormPage],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'new',
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
