import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { LucideAngularModule, AlertTriangle } from 'lucide-angular';
import { User } from '../../../../core/models/user';

@Component({
  selector: 'app-delete-user-dialog',
  imports: [LucideAngularModule],
  templateUrl: './delete-user-dialog.html',
  styleUrl: './delete-user-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteUserDialog {
  user = input.required<User>();
  confirmAction = output<void>();
  cancelAction = output<void>();

  readonly AlertTriangle = AlertTriangle;
}
