import {
  Directive,
  effect,
  inject,
  Input,
  signal,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { PermissionsService } from '../services/permissions.service';

@Directive({
  selector: '[hasPermission]',
  standalone: true,
})
export class HasPermissionDirective {
  private readonly permissionService = inject(PermissionsService);
  private readonly templateRef = inject(TemplateRef);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly permission = signal('');
  private hasView = false;

  constructor() {
    effect(() => {
      const allowed = this.permissionService.hasPermission(this.permission());

      if (allowed && !this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else if (!allowed && this.hasView) {
        this.viewContainer.clear();
        this.hasView = false;
      }
    });
  }

  @Input()
  set hasPermission(permission: string) {
    this.permission.set(permission);
  }
}
