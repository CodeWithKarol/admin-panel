import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteUserDialog } from './delete-user-dialog';

describe('DeleteUserDialog', () => {
  let component: DeleteUserDialog;
  let fixture: ComponentFixture<DeleteUserDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteUserDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteUserDialog);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('user', {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      role: 'User',
      status: 'Active',
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
