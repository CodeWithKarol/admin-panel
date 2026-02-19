import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { ModalService } from '../../../core/services/modal/modal.service';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('ModalComponent', () => {
  let fixture: ComponentFixture<ModalComponent>;
  let modalService: {
    isOpen: ReturnType<typeof signal<boolean>>;
    config: ReturnType<typeof signal<unknown>>;
    close: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    modalService = {
      isOpen: signal(false),
      config: signal(null),
      close: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ModalComponent],
      providers: [{ provide: ModalService, useValue: modalService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    fixture.detectChanges();
  });

  it('should not be visible when isOpen is false', () => {
    modalService.isOpen.set(false);
    fixture.detectChanges();
    const modalContainer = fixture.debugElement.query(By.css('.fixed'));
    expect(modalContainer).toBeNull();
  });

  it('should be visible when isOpen is true', () => {
    modalService.isOpen.set(true);
    fixture.detectChanges();
    const modalContainer = fixture.debugElement.query(By.css('.fixed'));
    expect(modalContainer).not.toBeNull();
  });

  it('should render the title from config', () => {
    modalService.isOpen.set(true);
    modalService.config.set({ title: 'Test Modal' });
    fixture.detectChanges();

    const title = fixture.debugElement.query(By.css('h3')).nativeElement.textContent.trim();
    expect(title).toBe('Test Modal');
  });

  it('should call close when backdrop is clicked', () => {
    modalService.isOpen.set(true);
    fixture.detectChanges();

    const backdrop = fixture.debugElement.query(By.css('.bg-brand-900\\/40'));
    backdrop.triggerEventHandler('click', null);

    expect(modalService.close).toHaveBeenCalled();
  });

  it('should call close when close button is clicked', () => {
    modalService.isOpen.set(true);
    fixture.detectChanges();

    const closeButton = fixture.debugElement.query(By.css('button'));
    closeButton.triggerEventHandler('click', null);

    expect(modalService.close).toHaveBeenCalled();
  });
});
