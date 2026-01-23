import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteUserDialog } from './delete-user-dialog';
import { User } from '../../../../core/models/user';

describe('DeleteUserDialog', () => {
  let component: DeleteUserDialog;
  let fixture: ComponentFixture<DeleteUserDialog>;

  const mockUser: User = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    active: true,
    lastLogin: new Date(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteUserDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteUserDialog);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('user', mockUser);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
