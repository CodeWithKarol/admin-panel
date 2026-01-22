import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '../../../../core/services/notification.service';
import { LucideAngularModule, ChevronLeft, ChevronRight, Check, ChevronDown } from 'lucide-angular';
import { Stepper, Step } from '../../../../shared/components/stepper/stepper';

@Component({
  selector: 'app-create-project-page',
  imports: [ReactiveFormsModule, LucideAngularModule, Stepper],
  templateUrl: './create-project-page.html',
  styleUrl: './create-project-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateProjectPage {
  private readonly fb = inject(FormBuilder);
  private readonly notificationService = inject(NotificationService);

  readonly currentStep = signal(0);
  readonly steps: Step[] = [
    { label: 'Project Details', description: 'Name and description' },
    { label: 'Team Members', description: 'Add your team' },
    { label: 'Review', description: 'Verify details' },
  ];

  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly Check = Check;
  readonly ChevronDown = ChevronDown;

  // Form Group for the entire wizard
  readonly projectForm = this.fb.group({
    details: this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      category: ['development', Validators.required],
    }),
    team: this.fb.group({
      inviteEmails: [''],
    }),
    settings: this.fb.group({
      isPublic: [false],
      notifications: [true],
    }),
  });

  get detailsGroup() {
    return this.projectForm.get('details');
  }

  get teamGroup() {
    return this.projectForm.get('team');
  }

  next() {
    if (this.currentStep() < this.steps.length - 1) {
      // Validate current step before moving
      if (this.currentStep() === 0 && this.detailsGroup?.invalid) {
        this.detailsGroup.markAllAsTouched();
        return;
      }
      this.currentStep.update((s) => s + 1);
    }
  }

  back() {
    if (this.currentStep() > 0) {
      this.currentStep.update((s) => s - 1);
    }
  }

  submit() {
    const data = this.projectForm.value;
    console.log('Creating project:', data);
    // Submit logic here
    this.notificationService.add({
      title: 'Project',
      message: 'Project created successfully!',
      type: 'success',
    });
  }
}
