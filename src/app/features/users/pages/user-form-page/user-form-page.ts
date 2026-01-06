import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { LucideAngularModule, ChevronDown } from 'lucide-angular';

@Component({
  selector: 'app-user-form-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule],
  templateUrl: './user-form-page.html',
  styleUrl: './user-form-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormPage implements OnInit {
  readonly ChevronDown = ChevronDown;
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEditMode = signal(false);
  isSaving = signal(false);
  userId = signal<number | null>(null);

  userForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['user', Validators.required],
    active: [true],
  });

  get name() {
    return this.userForm.get('name');
  }
  get email() {
    return this.userForm.get('email');
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode.set(true);
      this.userId.set(+id);
      this.loadUser(+id);
    }
  }

  loadUser(id: number) {
    this.userService.getUserById(id).subscribe((user) => {
      if (user) {
        this.userForm.patchValue({
          name: user.name,
          email: user.email,
          role: user.role,
          active: user.active,
        });
      }
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.isSaving.set(true);
      const formValue = this.userForm.value;

      const userPayload: any = {
        name: formValue.name!,
        email: formValue.email!,
        role: formValue.role as 'admin' | 'user' | 'editor',
        active: formValue.active!,
      };

      const request = this.isEditMode()
        ? this.userService.updateUser({ ...userPayload, id: this.userId()! })
        : this.userService.addUser(userPayload);

      request.subscribe({
        next: () => {
          this.router.navigate(['/users']);
        },
        error: () => {
          this.isSaving.set(false);
        },
      });
    }
  }
}
