import { Component, input, output } from '@angular/core';
import { LucideAngularModule, AlertTriangle } from 'lucide-angular';
import { User } from '../../../../core/models/user';

@Component({
  selector: 'app-delete-user-dialog',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './delete-user-dialog.html',
  styleUrl: './delete-user-dialog.css',
})
export class DeleteUserDialogComponent {
  user = input.required<User>();
  confirm = output<void>();
  cancel = output<void>();

  readonly AlertTriangle = AlertTriangle;
}
