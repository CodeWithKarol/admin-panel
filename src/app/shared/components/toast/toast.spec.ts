/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Toast } from './toast';
import { ToastService } from '../../../core/services/toast.service';
import { signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

describe('Toast', () => {
  let component: Toast;
  let fixture: ComponentFixture<Toast>;
  let mockToastService: any;
  const toastsSignal = signal<any[]>([]);

  beforeEach(async () => {
    mockToastService = {
      toasts: toastsSignal,
      remove: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Toast, LucideAngularModule],
      providers: [{ provide: ToastService, useValue: mockToastService }],
    }).compileComponents();

    fixture = TestBed.createComponent(Toast);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display toasts', () => {
    toastsSignal.set([{ id: 1, type: 'success', message: 'Test Toast' }]);
    fixture.detectChanges();

    const elements = fixture.nativeElement.querySelectorAll('.shadow-lg');
    expect(elements.length).toBe(1);
    expect(elements[0].textContent).toContain('Test Toast');
  });

  it('should call remove when close button clicked', () => {
    toastsSignal.set([{ id: 123, type: 'error', message: 'Error Toast' }]);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(mockToastService.remove).toHaveBeenCalledWith(123);
  });
});
