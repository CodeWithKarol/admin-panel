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
      getUserById: jasmine.createSpy('getUserById').and.returnValue(of(null)),
      addUser: jasmine.createSpy('addUser').and.returnValue(of(undefined)),
      updateUser: jasmine.createSpy('updateUser').and.returnValue(of(undefined)),
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };

    await TestBed.configureTestingModule({
      imports: [UserFormPageComponent],
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

    fixture = TestBed.createComponent(UserFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
