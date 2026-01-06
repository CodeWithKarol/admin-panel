import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteUserDialogComponent } from './delete-user-dialog.component';

describe('DeleteUserDialogComponent', () => {
  let component: DeleteUserDialogComponent;
  let fixture: ComponentFixture<DeleteUserDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteUserDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteUserDialogComponent);
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
