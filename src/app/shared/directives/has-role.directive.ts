import { Directive, TemplateRef, ViewContainerRef, inject, effect, input } from '@angular/core';
import { AuthService } from '../../core/auth/auth-service';
import { User } from '../../core/models/user';

@Directive({
  selector: '[appHasRole]',
})
export class HasRoleDirective {
  private templateRef = inject(TemplateRef);
  private viewContainer = inject(ViewContainerRef);
  private authService = inject(AuthService);

  readonly appHasRole = input.required<User['role'] | User['role'][]>();

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      const requiredRole = this.appHasRole();

      if (!user) {
        this.viewContainer.clear();
        return;
      }

      const hasPermission = this.checkPermission(user.role, requiredRole);

      if (hasPermission) {
        // Check if view is already created to avoid recreating it
        if (this.viewContainer.length === 0) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        }
      } else {
        this.viewContainer.clear();
      }
    });
  }

  private checkPermission(
    userRole: User['role'],
    requiredRole: User['role'] | User['role'][],
  ): boolean {
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(userRole);
    }

    return requiredRole === userRole;
  }
}
