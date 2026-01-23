import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateProjectPage } from './create-project-page';
import { NotificationService } from '../../../../core/services/notification.service';
import { By } from '@angular/platform-browser';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('CreateProjectPage', () => {
  let component: CreateProjectPage;
  let fixture: ComponentFixture<CreateProjectPage>;
  let notificationService: NotificationService;

  beforeEach(async () => {
    const notificationServiceMock = {
      add: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CreateProjectPage],
      providers: [{ provide: NotificationService, useValue: notificationServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProjectPage);
    component = fixture.componentInstance;
    notificationService = TestBed.inject(NotificationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with step 0', () => {
    expect(component.currentStep()).toBe(0);
  });

  it('should validate details before moving to next step', () => {
    component.next();
    // Should stay at step 0 because form is invalid
    expect(component.currentStep()).toBe(0);
    expect(component.detailsGroup?.touched).toBe(true);
  });

  it('should move to next step if details are valid', () => {
    component.projectForm.patchValue({
      details: {
        name: 'Valid Project',
        description: 'Description',
        category: 'development',
      },
    });

    component.next();
    expect(component.currentStep()).toBe(1);
  });

  it('should move back to previous step', () => {
    component.currentStep.set(1);
    component.back();
    expect(component.currentStep()).toBe(0);
  });

  it('should not move back from step 0', () => {
    component.currentStep.set(0);
    component.back();
    expect(component.currentStep()).toBe(0);
  });

  it('should submit form', () => {
    component.projectForm.patchValue({
      details: {
        name: 'Valid Project',
        description: 'Description',
        category: 'development',
      },
    });

    component.submit();
    expect(notificationService.add).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'success',
      }),
    );
  });
});
