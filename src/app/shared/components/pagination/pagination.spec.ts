import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination';
import { By } from '@angular/platform-browser';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
  });

  it('should calculate total pages correctly', async () => {
    fixture.componentRef.setInput('currentPage', 1);
    fixture.componentRef.setInput('itemsPerPage', 10);
    fixture.componentRef.setInput('totalItems', 25);
    await fixture.whenStable();

    expect(component.totalPages()).toBe(3);
  });

  it('should calculate item ranges correctly', async () => {
    fixture.componentRef.setInput('currentPage', 2);
    fixture.componentRef.setInput('itemsPerPage', 10);
    fixture.componentRef.setInput('totalItems', 25);
    await fixture.whenStable();

    expect(component.startItem()).toBe(11);
    expect(component.endItem()).toBe(20);

    fixture.componentRef.setInput('currentPage', 3);
    fixture.detectChanges();
    expect(component.startItem()).toBe(21);
    expect(component.endItem()).toBe(25);
  });

  it('should emit pageChange on page click', async () => {
    fixture.componentRef.setInput('currentPage', 1);
    fixture.componentRef.setInput('itemsPerPage', 10);
    fixture.componentRef.setInput('totalItems', 30);
    await fixture.whenStable();

    const spy = vi.spyOn(component.pageChange, 'emit');

    component.onPageChange(2);
    expect(spy).toHaveBeenCalledWith(2);
  });

  it('should not emit pageChange for out of bounds pages', async () => {
    fixture.componentRef.setInput('currentPage', 1);
    fixture.componentRef.setInput('itemsPerPage', 10);
    fixture.componentRef.setInput('totalItems', 30);
    await fixture.whenStable();

    const spy = vi.spyOn(component.pageChange, 'emit');

    component.onPageChange(0);
    component.onPageChange(4);

    expect(spy).not.toHaveBeenCalled();
  });

  it('should disable previous button on first page', async () => {
    fixture.componentRef.setInput('currentPage', 1);
    fixture.componentRef.setInput('itemsPerPage', 10);
    fixture.componentRef.setInput('totalItems', 30);
    fixture.detectChanges();

    const prevButton = fixture.debugElement.queryAll(By.css('button'))[0];
    expect(prevButton.nativeElement.disabled).toBe(true);
  });

  it('should disable next button on last page', async () => {
    fixture.componentRef.setInput('currentPage', 3);
    fixture.componentRef.setInput('itemsPerPage', 10);
    fixture.componentRef.setInput('totalItems', 30);
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const nextButton = buttons[buttons.length - 1];
    expect(nextButton.nativeElement.disabled).toBe(true);
  });
});
