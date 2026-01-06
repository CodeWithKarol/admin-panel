import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserListPage } from './user-list-page';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

describe('UserListPage', () => {
  let component: UserListPage;
  let fixture: ComponentFixture<UserListPage>;
  let userServiceMock: any;

  beforeEach(async () => {
    userServiceMock = {
      users: signal([]),
      deleteUser: vi.fn().mockReturnValue(of(undefined)),
    };

    await TestBed.configureTestingModule({
      imports: [UserListPage],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
