import { TestBed } from '@angular/core/testing';
import { DeleteUserDialog } from './delete-user-dialog';

describe('DeleteUserDialog', () => {
  let component: DeleteUserDialog;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeleteUserDialog],
    });

    component = TestBed.runInInjectionContext(() => new DeleteUserDialog());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
