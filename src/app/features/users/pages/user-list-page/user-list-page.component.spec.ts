import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserListPageComponent } from './user-list-page.component';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

describe('UserListPageComponent', () => {
  let component: UserListPageComponent;
  let fixture: ComponentFixture<UserListPageComponent>;
  let userServiceMock: any;

  beforeEach(async () => {
    userServiceMock = {
      users: signal([]),
      deleteUser: jasmine.createSpy('deleteUser').and.returnValue(of(undefined)),
    };

    await TestBed.configureTestingModule({
      imports: [UserListPageComponent],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
